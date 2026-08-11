import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { CustomerFormPage } from './pages/CustomerFormPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { InventoryPage } from './pages/InventoryPage';
import { ChallansPage } from './pages/ChallansPage';
import { ChallanDetailPage } from './pages/ChallanDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { MainLayout } from './layouts/MainLayout';
export const App = () => {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, {}) }), children: [_jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/customers", element: _jsx(CustomersPage, {}) }), _jsx(Route, { path: "/customers/new", element: _jsx(CustomerFormPage, {}) }), _jsx(Route, { path: "/customers/:id", element: _jsx(CustomerDetailPage, {}) }), _jsx(Route, { path: "/customers/:id/edit", element: _jsx(CustomerFormPage, {}) }), _jsx(Route, { path: "/products", element: _jsx(ProductsPage, {}) }), _jsx(Route, { path: "/products/new", element: _jsx(ProductFormPage, {}) }), _jsx(Route, { path: "/products/:id/edit", element: _jsx(ProductFormPage, {}) }), _jsx(Route, { path: "/inventory/:productId", element: _jsx(InventoryPage, {}) }), _jsx(Route, { path: "/challans", element: _jsx(ChallansPage, {}) }), _jsx(Route, { path: "/challans/:id", element: _jsx(ChallanDetailPage, {}) }), _jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }), _jsx(Route, { path: "/unauthorized", element: _jsx("div", { className: "p-8", children: "Unauthorized access" }) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }) }));
};
//# sourceMappingURL=App.js.map