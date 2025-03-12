import { useEffect, useState } from 'react';
import { useProducts } from '../customeHooks/useAPIfetch';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contextAPI/AuthContext';
import { useSidebar } from '../contextAPI/sidebarContext';
import { Spinner } from '../components/Spinner';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';

const Products = () => {
    const { isSidebarOpen } = useSidebar();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: products = [], isLoading, error } = useProducts();
    const [categoryFilter, setCategoryFilter] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        setFilteredProducts(categoryFilter
            ? products.filter((product) => product.category === categoryFilter)
            : products
        );
    }, [products, categoryFilter]);

    const deleteProduct = async (productId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`https://fakestoreapi.com/products/${productId}`);
                Swal.fire({
                    title: 'Deleted successfully!',
                    text: `Product with ID ${productId} deleted successfully`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                });

                setFilteredProducts((prev) => prev.filter((product) => product.id !== productId));

                queryClient.invalidateQueries('products');
            } catch (err) {
                console.error('Error deleting product:', err);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete the product.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const handleCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1);
    };

    if (isLoading) return <Spinner />;
    if (error) return <p>Error loading products</p>;

    const columns = ['Product Name', 'Price', 'Category', 'Actions'];

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className={`min-h-screen text-white ${isSidebarOpen ? 'w-[100vw] md:w-[82vw] ' : 'ml-0 w-full md:w-[94vw]'} transition-all`}>
            <div className="w-full mx-auto h-full p-3 md:p-10">
                <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Product Management</h1>

                <div className="mb-6 flex justify-between items-center">
                    <select
                        value={categoryFilter}
                        onChange={handleCategoryChange}
                        className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                        <option value="">All Categories</option>
                        {[...new Set(products.map((product) => product.category))].map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
                        <thead className="bg-gray-800 text-white sticky top-0 z-10">
                            <tr>
                                {columns.map((col, index) => (
                                    <th key={index} className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white shadow-md">
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-100 transition-all"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-800 border-t border-gray-200">
                                            {product.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 border-t border-gray-200">
                                            ${product.price}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 border-t border-gray-200">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 border-t border-gray-200">
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="text-red-600 hover:text-red-800 px-4 py-2 rounded-md border border-red-600 hover:border-red-800 transition-all"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-center gap-5 items-center mt-4 flex-wrap">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-800 text-white rounded disabled:bg-gray-400"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-800 text-white rounded disabled:bg-gray-400"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
