import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-100 flex items-center justify-center", children: _jsxs("div", { className: "bg-white rounded-lg shadow-md w-full max-w-md p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Fundsroom" }), _jsx("p", { className: "text-gray-600 text-sm mt-2", children: "ERP + CRM Operations Portal" })] }), error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "user@example.com", required: true, disabled: isLoading })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, disabled: isLoading })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors", children: isLoading ? 'Logging in...' : 'Login' })] }), _jsxs("div", { className: "mt-6 pt-6 border-t border-gray-200", children: [_jsx("p", { className: "text-sm text-gray-600 text-center", children: "Demo Credentials:" }), _jsx("p", { className: "text-xs text-gray-500 text-center mt-2", children: "admin@example.com / password123" })] })] }) }));
};
//# sourceMappingURL=LoginPage.js.map