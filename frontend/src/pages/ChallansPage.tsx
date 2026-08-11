import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { challanApi } from '../services/api';

export const ChallansPage: React.FC = () => {
  const [challans, setChallans] = useState<any[]>([]);
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
    } catch {
      setError('Failed to load challans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, [page, status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Sales Challans</h1>
        <Link to="/challans/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New Challan
        </Link>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      <div className="bg-white rounded-lg shadow p-4">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Challan #</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Qty</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : challans.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No challans found
                </td>
              </tr>
            ) : (
              challans.map((challan) => (
                <tr key={challan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{challan.challanNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{challan.customer.name}</td>
                  <td className="px-6 py-4 text-sm">
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
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{challan.totalQuantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(challan.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Link to={`/challans/${challan.id}`} className="text-blue-600 hover:text-blue-800">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {challans.length} of {total} challans
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
            disabled={challans.length < limit}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
