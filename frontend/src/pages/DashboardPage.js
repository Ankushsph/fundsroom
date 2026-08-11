import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
export const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeProducts: 0,
        draftChallans: 0,
        confirmedChallans: 0,
    });
    useEffect(() => {
        // Placeholder for fetching real data
        // Stats will be populated when APIs are available
        setStats({
            totalCustomers: 0,
            activeProducts: 0,
            draftChallans: 0,
            confirmedChallans: 0,
        });
    }, []);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: ["Welcome, ", user?.name] }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["Role: ", user?.role] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-600", children: "Total Customers" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.totalCustomers })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-600", children: "Active Products" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.activeProducts })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-600", children: "Draft Challans" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.draftChallans })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-600", children: "Confirmed Challans" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.confirmedChallans })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Quick Links" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: [_jsxs("a", { href: "/customers", className: "p-4 border rounded hover:bg-gray-50 transition-colors", children: [_jsx("p", { className: "font-medium text-gray-900", children: "Customers" }), _jsx("p", { className: "text-sm text-gray-600", children: "Manage customer records" })] }), _jsxs("a", { href: "/products", className: "p-4 border rounded hover:bg-gray-50 transition-colors", children: [_jsx("p", { className: "font-medium text-gray-900", children: "Products" }), _jsx("p", { className: "text-sm text-gray-600", children: "Product catalog" })] }), _jsxs("a", { href: "/inventory", className: "p-4 border rounded hover:bg-gray-50 transition-colors", children: [_jsx("p", { className: "font-medium text-gray-900", children: "Inventory" }), _jsx("p", { className: "text-sm text-gray-600", children: "Stock management" })] }), _jsxs("a", { href: "/challans", className: "p-4 border rounded hover:bg-gray-50 transition-colors", children: [_jsx("p", { className: "font-medium text-gray-900", children: "Challans" }), _jsx("p", { className: "text-sm text-gray-600", children: "Sales challans" })] })] })] })] }));
};
//# sourceMappingURL=DashboardPage.js.map