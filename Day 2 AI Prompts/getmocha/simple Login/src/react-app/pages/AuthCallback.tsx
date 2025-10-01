import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const { exchangeCodeForSessionToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        // The user state will be updated automatically
      } catch (error) {
        console.error('Authentication failed:', error);
        // Redirect to login on error
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  useEffect(() => {
    if (user) {
      // Redirect to welcome page once user is authenticated
      navigate('/welcome');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
          {user ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          )}
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {user ? 'Authentication successful!' : 'Completing authentication...'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {user 
            ? 'Redirecting you to your dashboard.' 
            : 'Please wait while we verify your credentials.'
          }
        </p>

        {!user && (
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm text-gray-700">Processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
