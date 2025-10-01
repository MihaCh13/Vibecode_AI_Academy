import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { User, LogOut, Shield, Clock } from 'lucide-react';

export default function Welcome() {
  const { user, logout, isFetching } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isFetching) {
      navigate('/login');
    }
  }, [user, isFetching, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">SecureFlow</h1>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back{user.google_user_data.given_name ? `, ${user.google_user_data.given_name}` : ''}!
            </h2>
            <p className="text-gray-600">
              You have successfully authenticated to SecureFlow
            </p>
          </div>

          {/* User Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Information */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Account Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded-md border">
                    {user.email}
                  </p>
                </div>
                {user.google_user_data.name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900 bg-white px-3 py-2 rounded-md border">
                      {user.google_user_data.name}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded-md border break-all">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Session Information */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Session Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Sign In</label>
                  <p className="text-gray-900 bg-white px-3 py-2 rounded-md border">
                    {formatDate(user.last_signed_in_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                  <p className="text-gray-900 bg-white px-3 py-2 rounded-md border">
                    {formatDate(user.created_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Verified</label>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${user.google_user_data.email_verified ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-sm font-medium ${user.google_user_data.email_verified ? 'text-green-700' : 'text-red-700'}`}>
                      {user.google_user_data.email_verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </main>
    </div>
  );
}
