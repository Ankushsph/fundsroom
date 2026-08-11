import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mt-4">Page not found</p>
        <Link to="/dashboard" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
