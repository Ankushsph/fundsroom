import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerApi } from '../services/api';
export const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const limit = 10;
    const fetchCustomers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await customerApi.getAll(page, limit, search);
            setCustomers(response.data.data || []);
            setTotal(response.data.pagination?.total || 0);
        }
        catch (err) {
            setError('Failed to load customers');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCustomers();
    }, [page, search]);
    const handleDelete = async (id) => {
        if (window.confirm('Delete this customer?')) {
            try {
                await customerApi.delete(id);
                fetchCustomers();
            }
            catch (err) {
                alert('Failed to delete customer');
            }
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Customers" }), _jsx(Link, { to: "/customers/new", className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "New Customer" })] }), error && _jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded text-red-700", children: error }), _jsx("div", { className: "bg-white rounded-lg shadow p-4", children: _jsx("input", { type: "text", placeholder: "Search by name, email, or mobile...", value: search, onChange: (e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }, className: "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" }) }), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Email" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Mobile" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y", children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-4 text-center text-gray-500", children: "Loading..." }) })) : customers.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-4 text-center text-gray-500", children: "No customers found" }) })) : (customers.map((customer) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: customer.name }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: customer.email }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: customer.mobile }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${customer.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-800'
                                                : customer.status === 'LEAD'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'}`, children: customer.status }) }), _jsxs("td", { className: "px-6 py-4 text-sm space-x-2", children: [_jsx(Link, { to: `/customers/${customer.id}`, className: "text-blue-600 hover:text-blue-800", children: "View" }), _jsx(Link, { to: `/customers/${customer.id}/edit`, className: "text-blue-600 hover:text-blue-800", children: "Edit" }), _jsx("button", { onClick: () => handleDelete(customer.id), className: "text-red-600 hover:text-red-800", children: "Delete" })] })] }, customer.id)))) })] }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Showing ", customers.length, " of ", total, " customers"] }), _jsxs("div", { className: "space-x-2", children: [_jsx("button", { onClick: () => setPage(Math.max(1, page - 1)), disabled: page === 1, className: "px-3 py-1 border border-gray-300 rounded disabled:opacity-50", children: "Previous" }), _jsxs("span", { className: "px-3 py-1", children: ["Page ", page] }), _jsx("button", { onClick: () => setPage(page + 1), disabled: customers.length < limit, className: "px-3 py-1 border border-gray-300 rounded disabled:opacity-50", children: "Next" })] })] })] }));
};
//# sourceMappingURL=CustomersPage.js.map