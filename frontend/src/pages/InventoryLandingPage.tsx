import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../services/api';

export const InventoryLandingPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const limit = 20;

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await productApi.getAll(page, limit, search, true);
      setProducts(response.data.data || []);
      setTotal(response.data.pagination?.total || 0);
    } catch (err: any) {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-1">View and manage stock levels across all products</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search by SKU or product name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No products found</div>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              to={`/inventory/${product.id}`}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 font-medium">SKU</p>
                  <p className="text-sm font-semibold text-gray-900">{product.sku}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-medium">Product Name</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{product.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-600">Current Stock</p>
                    <p className="text-lg font-bold text-blue-600">
                      {product.currentStock}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Min Alert</p>
                    <p className="text-lg font-bold text-gray-900">
                      {product.minStockAlert}
                    </p>
                  </div>
                </div>

                {product.currentStock <= product.minStockAlert && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800 font-medium">Low Stock Alert</p>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-blue-600 font-medium">Click to manage stock</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {products.length} of {total} products
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={products.length < limit}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
