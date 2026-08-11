import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { productApi, inventoryApi } from '../services/api';

export const InventoryPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [formData, setFormData] = useState({ quantity: '', reason: '' });
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchInventoryData = useCallback(async () => {
    try {
      if (productId) {
        const [prodRes, movRes] = await Promise.all([
          productApi.getById(productId),
          inventoryApi.getProductMovements(productId),
        ]);
        setProduct(prodRes.data.data);
        setMovements(movRes.data.data || []);
      }
    } catch {
      setError('Failed to load inventory data');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const quantity = parseInt(formData.quantity);
      if (!productId) throw new Error('Product ID missing');

      if (movementType === 'in') {
        await inventoryApi.stockIn(productId, quantity, formData.reason);
      } else {
        await inventoryApi.stockOut(productId, quantity, formData.reason);
      }

      setFormData({ quantity: '', reason: '' });

      await fetchInventoryData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record movement');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error && !product) return <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>

      {product && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">SKU</p>
              <p className="text-lg font-semibold text-gray-900">{product.sku}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Product</p>
              <p className="text-lg font-semibold text-gray-900">{product.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold text-blue-600">{product.currentStock}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Min Alert</p>
              <p className="text-lg font-semibold text-gray-900">{product.minStockAlert}</p>
            </div>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Record Stock Movement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Movement Type</label>
              <select
                value={movementType}
                onChange={(e) => setMovementType(e.target.value as 'in' | 'out')}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="in">Stock IN</option>
                <option value="out">Stock OUT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                min="1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="e.g., Purchase, Return"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || !formData.quantity || !formData.reason}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSaving ? 'Recording...' : 'Record Movement'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Reason</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No movements yet
                </td>
              </tr>
            ) : (
              movements.map((mov) => (
                <tr key={mov.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(mov.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        mov.movementType === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {mov.movementType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{mov.quantityChanged}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{mov.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{mov.createdBy.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
