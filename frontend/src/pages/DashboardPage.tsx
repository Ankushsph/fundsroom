import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    // Placeholder for fetching real data
    // Stats will be populated when APIs are available
    setStats({
      totalCustomers: 0,
      activeProducts: 0,
      draftChallans: 0,
      confirmedChallans: 0,
    });
  }, []);

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
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCustomers}</p>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Active Products</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeProducts}</p>
        </div>

        {/* Draft Challans Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Draft Challans</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.draftChallans}</p>
        </div>

        {/* Confirmed Challans Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Confirmed Challans</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.confirmedChallans}</p>
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
