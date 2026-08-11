import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { MainLayout } from './layouts/MainLayout';
export const App = () => {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, {}) }), children: [_jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }), _jsx(Route, { path: "/unauthorized", element: _jsx("div", { className: "p-8", children: "Unauthorized access" }) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }) }));
};
//# sourceMappingURL=App.js.map