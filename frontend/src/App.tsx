import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { CustomerFormPage } from './pages/CustomerFormPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { InventoryPage } from './pages/InventoryPage';
import { InventoryLandingPage } from './pages/InventoryLandingPage';
import { ChallansPage } from './pages/ChallansPage';
import { ChallanDetailPage } from './pages/ChallanDetailPage';
import { ChallanFormPage } from './pages/ChallanFormPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { MainLayout } from './layouts/MainLayout';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/new" element={<CustomerFormPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/:id/edit" element={<ProductFormPage />} />
            <Route path="/inventory" element={<InventoryLandingPage />} />
            <Route path="/inventory/:productId" element={<InventoryPage />} />
            <Route path="/challans" element={<ChallansPage />} />
            <Route path="/challans/new" element={<ChallanFormPage />} />
            <Route path="/challans/:id" element={<ChallanDetailPage />} />
            <Route path="/challans/:id/edit" element={<ChallanFormPage />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="/unauthorized" element={<div className="p-8">Unauthorized access</div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
