import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { challanApi } from '../services/api';

export const ChallanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [challan, setChallan] = useState<any>(null);
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
      } catch {
        setError('Failed to load challan');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleConfirm = async () => {
    if (!id) return;
    if (!window.confirm('Confirm this challan? Stock will be deducted.')) return;

    setIsConfirming(true);
    try {
      await challanApi.confirm(id);
      const response = await challanApi.getById(id);
      setChallan(response.data.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to confirm challan');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    if (!window.confirm('Cancel this challan?')) return;

    try {
      await challanApi.cancel(id);
      const response = await challanApi.getById(id);
      setChallan(response.data.data);
    } catch {
      alert('Failed to cancel challan');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>;
  if (!challan) return <div>Challan not found</div>;

  const totalAmount = challan.items.reduce((sum: number, item: any) => sum + parseFloat(item.lineTotal || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Challan {challan.challanNumber}</h1>
        <div className="space-x-2">
          {challan.status === 'DRAFT' && (
            <>
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {isConfirming ? 'Confirming...' : 'Confirm'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </>
          )}
          <Link to="/challans" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-600">Status</dt>
              <dd className="text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    challan.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-800'
                      : challan.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {challan.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Customer</dt>
              <dd className="text-sm text-gray-900">{challan.customer.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Created Date</dt>
              <dd className="text-sm text-gray-900">{new Date(challan.createdAt).toLocaleDateString()}</dd>
            </div>
            {challan.confirmedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Confirmed Date</dt>
                <dd className="text-sm text-gray-900">{new Date(challan.confirmedAt).toLocaleDateString()}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-600">Total Items</dt>
              <dd className="text-sm text-gray-900 font-semibold">{challan.totalQuantity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-600">Total Amount</dt>
              <dd className="text-sm text-gray-900 font-semibold">₹{totalAmount.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <dt className="text-sm font-medium text-gray-900">Grand Total</dt>
              <dd className="text-lg text-gray-900 font-bold">₹{totalAmount.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Product</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Qty</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Unit Price</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {challan.items.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.productSku}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.productName}</td>
                <td className="px-6 py-4 text-sm text-right text-gray-900">{item.quantity}</td>
                <td className="px-6 py-4 text-sm text-right text-gray-900">₹{typeof item.unitPrice === 'object' ? item.unitPrice.toString() : item.unitPrice}</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                  ₹{parseFloat(item.lineTotal || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
