import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePurchaseVerification } from '@/hooks/usePurchaseVerification';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requirePurchase?: boolean;
}

const ProtectedRoute = ({ children, requirePurchase = false }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { hasValidPurchase, loading: purchaseLoading } = usePurchaseVerification();

  if (authLoading || (requirePurchase && purchaseLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-purple-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requirePurchase && !hasValidPurchase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-purple-900 mb-2">Purchase Required</h1>
          <p className="text-gray-700 mb-6">
            You need to purchase a course to access this content. Please visit our store to get started.
          </p>
          <div className="space-y-2">
            <a 
              href="/new-product-launch" 
              className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View Courses
            </a>
            <a 
              href="/" 
              className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
