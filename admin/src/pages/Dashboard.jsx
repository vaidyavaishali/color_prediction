import { useCarts, useProducts, useUsers } from '../customeHooks/useAPIfetch';
import DashboardCard from '../components/DashboardCard';
import { useSidebar } from '../contextAPI/sidebarContext'; // Import useSidebar hook
import { Spinner } from '../components/Spinner';
import { useEffect } from 'react';
import { useAuth } from '../contextAPI/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { isSidebarOpen } = useSidebar();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate()
    const { data: products, isLoading: isLoadingProducts } = useProducts();
    const { data: carts, isLoading: isLoadingCarts } = useCarts();
    const { data: users, isLoading: isLoadingUsers } = useUsers();
    const totalProducts = products?.length || 0;
    const totalUsers = users?.length || 0;
    const totalOrders = carts?.length || 0;
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated])
    const avgCartValue = carts && products
        ? 'Rs. ' + (carts.reduce((sum, cart) => {
            const cartTotal = cart.products.reduce((subtotal, item) => {
                const product = products.find(p => p.id === item.productId); 
                return subtotal + (product?.price || 0) * item.quantity;
            }, 0);
            return sum + cartTotal;
        }, 0) / carts.length).toFixed(2)
        : 'Rs. 0.00';

    if (isLoadingProducts || isLoadingCarts || isLoadingUsers) {
        return <Spinner className="mx-auto mt-5" />;
    }

    return (
        <div className={`min-h-screen bg-gray-200 text-white ${isSidebarOpen ? ' w-[100vw] md:w-[82vw]' : 'ml-0 w-[94vw]'} transition-all`}>
            <h1 className="text-4xl pt-6 font-bold text-center text-gray-800 mb-10">Dashboard</h1>
            <div className="w-full max-w-6xl mx-auto bg-gray-400 shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               
            </div>
        </div>
    );
};

export default Dashboard;
