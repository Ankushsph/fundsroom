import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const ProtectedRoute = ({ children, requiredRoles }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return _jsx("div", { className: "flex items-center justify-center h-screen", children: "Loading..." });
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (requiredRoles && !requiredRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
//# sourceMappingURL=ProtectedRoute.js.map