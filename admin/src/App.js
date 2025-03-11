import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Product';
import Login from './pages/Login'; // Import Login component
import { AuthProvider, useAuth } from './contextAPI/AuthContext';
import UserManagement from './pages/Users';
import Layout from './pages/Layout';
import { SidebarProvider } from './contextAPI/sidebarContext';

const App = () => {
  const { isAuthenticated } = useAuth(); // Access authentication state directly

  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            {/* Login Route */}

            <Route path="/" element={<Login />} />

            {/* Dashboard Main Route */}
            {/* <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          /> */}
            <Route path="/" element={<Layout />}>
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              {/* Products Route */}
              {/* <Route
            path="/dashboard/products"
            element={isAuthenticated ? <Products /> : <Navigate to="/login" />}
          /> */}
              <Route
                path="/dashboard/products"
                element={<Products />}
              />

              {/* Users Management Route */}
              <Route
                path="/dashboard/users"
                element={<UserManagement />}
              />
            </Route>
            {/* Redirect to login if no match */}
            {/* <Route path="*" element={<Navigate to="/login" />} /> */}
          </Routes>

        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default App;
