import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
  totalCustomers: number;
  activeProducts: number;
  draftChallans: number;
  confirmedChallans: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeProducts: 0,
    draftChallans: 0,
    confirmedChallans: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const [customersRes, productsRes, challansDraftRes, challansConfirmedRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/customers?limit=1`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/products?active=true&limit=1`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/challans?status=DRAFT&limit=1`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/challans?status=CONFIRMED&limit=1`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      let totalCustomers = 0;
      let activeProducts = 0;
      let draftChallans = 0;
      let confirmedChallans = 0;

      if (customersRes.ok) {
        const data = await customersRes.json();
        totalCustomers = data.total || 0;
      }
      if (productsRes.ok) {
        const data = await productsRes.json();
        activeProducts = data.total || 0;
      }
      if (challansDraftRes.ok) {
        const data = await challansDraftRes.json();
        draftChallans = data.total || 0;
      }
      if (challansConfirmedRes.ok) {
        const data = await challansConfirmedRes.json();
        confirmedChallans = data.total || 0;
      }

      setStats({
        totalCustomers,
        activeProducts,
        draftChallans,
        confirmedChallans,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-600 mt-1">Role: {user?.role}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Customers Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Customers</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '—' : stats.totalCustomers}
          </p>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Active Products</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '—' : stats.activeProducts}
          </p>
        </div>

        {/* Draft Challans Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Draft Challans</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '—' : stats.draftChallans}
          </p>
        </div>

        {/* Confirmed Challans Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Confirmed Challans</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '—' : stats.confirmedChallans}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <a href="/customers" className="p-4 border rounded hover:bg-gray-50 transition-colors">
            <p className="font-medium text-gray-900">Customers</p>
            <p className="text-sm text-gray-600">Manage customer records</p>
          </a>
          <a href="/products" className="p-4 border rounded hover:bg-gray-50 transition-colors">
            <p className="font-medium text-gray-900">Products</p>
            <p className="text-sm text-gray-600">Product catalog</p>
          </a>
          <a href="/inventory" className="p-4 border rounded hover:bg-gray-50 transition-colors">
            <p className="font-medium text-gray-900">Inventory</p>
            <p className="text-sm text-gray-600">Stock management</p>
          </a>
          <a href="/challans" className="p-4 border rounded hover:bg-gray-50 transition-colors">
            <p className="font-medium text-gray-900">Challans</p>
            <p className="text-sm text-gray-600">Sales challans</p>
          </a>
        </div>
      </div>
    </div>
  );
};
