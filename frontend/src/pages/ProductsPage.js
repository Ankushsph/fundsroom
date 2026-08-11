import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../services/api';
export const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const limit = 10;
    const fetchProducts = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await productApi.getAll(page, limit, search, true);
            setProducts(response.data.data || []);
            setTotal(response.data.pagination?.total || 0);
        }
        catch (err) {
            setError('Failed to load products');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, [page, search]);
    const handleDeactivate = async (id) => {
        if (window.confirm('Deactivate this product?')) {
            try {
                await productApi.update(id, { isActive: false });
                fetchProducts();
            }
            catch {
                alert('Failed to deactivate product');
            }
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Products" }), _jsx(Link, { to: "/products/new", className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "New Product" })] }), error && _jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded text-red-700", children: error }), _jsx("div", { className: "bg-white rounded-lg shadow p-4", children: _jsx("input", { type: "text", placeholder: "Search by SKU or name...", value: search, onChange: (e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }, className: "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" }) }), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "SKU" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Price" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Stock" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Category" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y", children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-4 text-center text-gray-500", children: "Loading..." }) })) : products.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-4 text-center text-gray-500", children: "No products found" }) })) : (products.map((product) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: product.sku }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: product.name }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: typeof product.unitPrice === 'object' ? product.unitPrice.toString() : product.unitPrice }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: product.currentStock }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: product.category }), _jsxs("td", { className: "px-6 py-4 text-sm space-x-2", children: [_jsx(Link, { to: `/inventory/${product.id}`, className: "text-blue-600 hover:text-blue-800", children: "Stock" }), _jsx(Link, { to: `/products/${product.id}/edit`, className: "text-blue-600 hover:text-blue-800", children: "Edit" }), _jsx("button", { onClick: () => handleDeactivate(product.id), className: "text-red-600 hover:text-red-800", children: "Deactivate" })] })] }, product.id)))) })] }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Showing ", products.length, " of ", total, " products"] }), _jsxs("div", { className: "space-x-2", children: [_jsx("button", { onClick: () => setPage(Math.max(1, page - 1)), disabled: page === 1, className: "px-3 py-1 border border-gray-300 rounded disabled:opacity-50", children: "Previous" }), _jsxs("span", { className: "px-3 py-1", children: ["Page ", page] }), _jsx("button", { onClick: () => setPage(page + 1), disabled: products.length < limit, className: "px-3 py-1 border border-gray-300 rounded disabled:opacity-50", children: "Next" })] })] })] }));
};
//# sourceMappingURL=ProductsPage.js.map