import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';
// Pages
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

function ProtectedRoute() {
    const { token, isLoading } = useAuth();
    if (isLoading) return null;
    if (!token) return <Navigate to="/login" replace />;
    return <Outlet />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC */}
                <Route path="/" element={<Home />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />}/>

                {/* PROTECTED */}
                <Route element={<ProtectedRoute/>}>
                    <Route path="/dashboard" element={<Dashboard />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
