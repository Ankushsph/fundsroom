import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
        { label: 'Customers', path: '/customers', roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
        { label: 'Products', path: '/products', roles: ['ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'] },
        { label: 'Inventory', path: '/inventory', roles: ['ADMIN', 'WAREHOUSE'] },
        { label: 'Challans', path: '/challans', roles: ['ADMIN', 'SALES'] },
    ];
    const visibleMenuItems = menuItems.filter((item) => item.roles.includes(user?.role || ''));
    return (_jsxs("div", { className: "flex h-screen bg-gray-100", children: [_jsxs("div", { className: `${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`, children: [_jsxs("div", { className: "p-4 border-b border-gray-800 flex items-center justify-between", children: [sidebarOpen && _jsx("h1", { className: "text-lg font-bold", children: "Fundsroom" }), _jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: "p-1 hover:bg-gray-800 rounded", children: sidebarOpen ? '←' : '→' })] }), _jsx("nav", { className: "flex-1 p-4 space-y-2", children: visibleMenuItems.map((item) => (_jsxs(Link, { to: item.path, className: "flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition-colors", title: sidebarOpen ? '' : item.label, children: [_jsx("span", { className: "text-lg", children: "\u2192" }), sidebarOpen && _jsx("span", { children: item.label })] }, item.path))) }), _jsxs("div", { className: "p-4 border-t border-gray-800", children: [sidebarOpen && (_jsxs("div", { className: "mb-3", children: [_jsx("p", { className: "text-sm font-semibold truncate", children: user?.name }), _jsx("p", { className: "text-xs text-gray-400", children: user?.role })] })), _jsx("button", { onClick: handleLogout, className: "w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors", children: sidebarOpen ? 'Logout' : '✕' })] })] }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("div", { className: "bg-white shadow px-6 py-4 flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Fundsroom ERP Portal" }), _jsxs("div", { className: "text-right text-sm text-gray-600", children: [_jsx("p", { children: user?.name }), _jsx("p", { className: "text-xs", children: user?.email })] })] }), _jsx("div", { className: "flex-1 overflow-auto p-6", children: _jsx(Outlet, {}) })] })] }));
};
//# sourceMappingURL=MainLayout.js.map