import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export const NotFoundPage = () => {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-6xl font-bold text-gray-900", children: "404" }), _jsx("p", { className: "text-xl text-gray-600 mt-4", children: "Page not found" }), _jsx(Link, { to: "/dashboard", className: "mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Return to Dashboard" })] }) }));
};
//# sourceMappingURL=NotFoundPage.js.map