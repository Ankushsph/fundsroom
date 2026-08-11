import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { challanApi } from '../services/api';
export const ChallansPage = () => {
    const [challans, setChallans] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const limit = 10;
    const fetchChallans = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await challanApi.getAll(page, limit, status);
            setChallans(response.data.data || []);
            setTotal(response.data.pagination?.total || 0);
        }
        catch {
            setError('Failed to load challans');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchChallans();
    }, [page, status]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Sales Challans" }), _jsx(Link, { to: "/challans/new", className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "New Challan" })] }), error && _jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded text-red-700", children: error }), _jsx("div", { className: "bg-white rounded-lg shadow p-4", children: _jsxs("select", { value: status, onChange: (e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }, className: "px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "DRAFT", children: "Draft" }), _jsx("option", { value: "CONFIRMED", children: "Confirmed" }), _jsx("option", { value: "CANCELLED", children: "Cancelled" })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Challan #" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Customer" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Qty" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y", children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-4 text-center text-gray-500", children: "Loading..." }) })) : challans.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-4 text-center text-gray-500", children: "No challans found" }) })) : (challans.map((challan) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: challan.challanNumber }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: challan.customer.name }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${challan.status === 'DRAFT'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : challan.status === 'CONFIRMED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'}`, children: challan.status }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: challan.totalQuantity }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: new Date(challan.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 text-sm space-x-2", children: _jsx(Link, { to: `/challans/${challan.id}`, className: "text-blue-600 hover:text-blue-800", children: "View" }) })] }, challan.id)))) })] }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Showing ", challans.length, " of ", total, " challans"] }), _jsxs("div", { className: "space-x-2", children: [_jsx("button", { onClick: () => setPage(Math.max(1, page - 1)), disabled: page === 1, className: "px-3 py-1 border border-gray-300 rounded disabled:opacity-50", children: "Previous" }), _jsxs("span", { className: "px-3 py-1", children: ["Page ", page] }), _jsx("button", { onClick: () => setPage(page + 1), disabled: challans.length < limit, className: "px-3 py-1 border border-gray-300 rounded disabled:opacity-50", children: "Next" })] })] })] }));
};
//# sourceMappingURL=ChallansPage.js.map