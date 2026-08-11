import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productApi, inventoryApi } from '../services/api';
export const InventoryPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [movements, setMovements] = useState([]);
    const [formData, setFormData] = useState({ quantity: '', reason: '' });
    const [movementType, setMovementType] = useState('in');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (productId) {
                    const [prodRes, movRes] = await Promise.all([
                        productApi.getById(productId),
                        inventoryApi.getProductMovements(productId),
                    ]);
                    setProduct(prodRes.data.data);
                    setMovements(movRes.data.data || []);
                }
            }
            catch {
                setError('Failed to load inventory data');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [productId]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);
        try {
            const quantity = parseInt(formData.quantity);
            if (!productId)
                throw new Error('Product ID missing');
            if (movementType === 'in') {
                await inventoryApi.stockIn(productId, quantity, formData.reason);
            }
            else {
                await inventoryApi.stockOut(productId, quantity, formData.reason);
            }
            setFormData({ quantity: '', reason: '' });
            const [prodRes, movRes] = await Promise.all([
                productApi.getById(productId),
                inventoryApi.getProductMovements(productId),
            ]);
            setProduct(prodRes.data.data);
            setMovements(movRes.data.data || []);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to record movement');
        }
        finally {
            setIsSaving(false);
        }
    };
    if (isLoading)
        return _jsx("div", { children: "Loading..." });
    if (error && !product)
        return _jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded text-red-700", children: error });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Inventory Management" }), product && (_jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "grid grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "SKU" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: product.sku })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Product" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: product.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Current Stock" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: product.currentStock })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Min Alert" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: product.minStockAlert })] })] }) })), error && _jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded text-red-700", children: error }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Record Stock Movement" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Movement Type" }), _jsxs("select", { value: movementType, onChange: (e) => setMovementType(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "in", children: "Stock IN" }), _jsx("option", { value: "out", children: "Stock OUT" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Quantity" }), _jsx("input", { type: "number", value: formData.quantity, onChange: (e) => setFormData((prev) => ({ ...prev, quantity: e.target.value })), min: "1", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Reason" }), _jsx("input", { type: "text", value: formData.reason, onChange: (e) => setFormData((prev) => ({ ...prev, reason: e.target.value })), placeholder: "e.g., Purchase, Return", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsx("button", { type: "submit", disabled: isSaving || !formData.quantity || !formData.reason, className: "w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400", children: isSaving ? 'Recording...' : 'Record Movement' })] })] }), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Quantity" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Reason" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "User" })] }) }), _jsx("tbody", { className: "divide-y", children: movements.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-4 text-center text-gray-500", children: "No movements yet" }) })) : (movements.map((mov) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: new Date(mov.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${mov.movementType === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: mov.movementType }) }), _jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: mov.quantityChanged }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: mov.reason }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: mov.createdBy.name })] }, mov.id)))) })] }) })] }));
};
//# sourceMappingURL=InventoryPage.js.map