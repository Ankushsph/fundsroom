import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { challanApi } from '../services/api';
export const ChallanDetailPage = () => {
    const { id } = useParams();
    const [challan, setChallan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const response = await challanApi.getById(id);
                    setChallan(response.data.data);
                }
            }
            catch {
                setError('Failed to load challan');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);
    const handleConfirm = async () => {
        if (!id)
            return;
        if (!window.confirm('Confirm this challan? Stock will be deducted.'))
            return;
        setIsConfirming(true);
        try {
            await challanApi.confirm(id);
            const response = await challanApi.getById(id);
            setChallan(response.data.data);
        }
        catch (err) {
            alert(err.response?.data?.message || 'Failed to confirm challan');
        }
        finally {
            setIsConfirming(false);
        }
    };
    const handleCancel = async () => {
        if (!id)
            return;
        if (!window.confirm('Cancel this challan?'))
            return;
        try {
            await challanApi.cancel(id);
            const response = await challanApi.getById(id);
            setChallan(response.data.data);
        }
        catch {
            alert('Failed to cancel challan');
        }
    };
    if (isLoading)
        return _jsx("div", { children: "Loading..." });
    if (error)
        return _jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded text-red-700", children: error });
    if (!challan)
        return _jsx("div", { children: "Challan not found" });
    const totalAmount = challan.items.reduce((sum, item) => sum + parseFloat(item.lineTotal || 0), 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: ["Challan ", challan.challanNumber] }), _jsxs("div", { className: "space-x-2", children: [challan.status === 'DRAFT' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: handleConfirm, disabled: isConfirming, className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400", children: isConfirming ? 'Confirming...' : 'Confirm' }), _jsx("button", { onClick: handleCancel, className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700", children: "Cancel" })] })), _jsx(Link, { to: "/challans", className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700", children: "Back" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Details" }), _jsxs("dl", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-600", children: "Status" }), _jsx("dd", { className: "text-sm", children: _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${challan.status === 'DRAFT'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : challan.status === 'CONFIRMED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'}`, children: challan.status }) })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-600", children: "Customer" }), _jsx("dd", { className: "text-sm text-gray-900", children: challan.customer.name })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-600", children: "Created Date" }), _jsx("dd", { className: "text-sm text-gray-900", children: new Date(challan.createdAt).toLocaleDateString() })] }), challan.confirmedAt && (_jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-600", children: "Confirmed Date" }), _jsx("dd", { className: "text-sm text-gray-900", children: new Date(challan.confirmedAt).toLocaleDateString() })] }))] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Summary" }), _jsxs("dl", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-sm font-medium text-gray-600", children: "Total Items" }), _jsx("dd", { className: "text-sm text-gray-900 font-semibold", children: challan.totalQuantity })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-sm font-medium text-gray-600", children: "Total Amount" }), _jsxs("dd", { className: "text-sm text-gray-900 font-semibold", children: ["\u20B9", totalAmount.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between pt-3 border-t", children: [_jsx("dt", { className: "text-sm font-medium text-gray-900", children: "Grand Total" }), _jsxs("dd", { className: "text-lg text-gray-900 font-bold", children: ["\u20B9", totalAmount.toFixed(2)] })] })] })] })] }), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "SKU" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Product" }), _jsx("th", { className: "px-6 py-3 text-right text-sm font-medium text-gray-700", children: "Qty" }), _jsx("th", { className: "px-6 py-3 text-right text-sm font-medium text-gray-700", children: "Unit Price" }), _jsx("th", { className: "px-6 py-3 text-right text-sm font-medium text-gray-700", children: "Line Total" })] }) }), _jsx("tbody", { className: "divide-y", children: challan.items.map((item) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: item.productSku }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: item.productName }), _jsx("td", { className: "px-6 py-4 text-sm text-right text-gray-900", children: item.quantity }), _jsxs("td", { className: "px-6 py-4 text-sm text-right text-gray-900", children: ["\u20B9", typeof item.unitPrice === 'object' ? item.unitPrice.toString() : item.unitPrice] }), _jsxs("td", { className: "px-6 py-4 text-sm text-right font-semibold text-gray-900", children: ["\u20B9", parseFloat(item.lineTotal || 0).toFixed(2)] })] }, item.id))) })] }) })] }));
};
//# sourceMappingURL=ChallanDetailPage.js.map