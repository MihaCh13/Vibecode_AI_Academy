import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { LogIn, Lock, Shield } from 'lucide-react';

export default function Login() {
  const { user, redirectToLogin, isFetching } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/welcome');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await redirectToLogin();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SecureFlow</h1>
          <p className="text-gray-600">Secure authentication platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Enhanced Security</p>
                <p className="text-sm text-blue-700 mt-1">
                  We use Google OAuth for secure, passwordless authentication to protect your account.
                </p>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isFetching}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
          >
            {isFetching ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {isFetching ? 'Redirecting...' : 'Continue with Google'}
          </button>

          {/* Info Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>

        {/* Bottom Links */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
