import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function AuthCallback() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        setStatus('success');
        setTimeout(() => {
          navigate('/welcome');
        }, 1500);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Scanning animation */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-md w-full glass-panel rounded-2xl p-8 text-center glow-cyan relative z-10">
        {status === 'loading' && (
          <>
            <div className="animate-spin mx-auto mb-4 glow-cyan">
              <Loader2 className="w-12 h-12 text-cyan-400" />
            </div>
            <h2 className="font-['Orbitron'] text-2xl font-bold text-cyan-400 mb-2 text-glow-cyan">
              NEURAL SYNC IN PROGRESS
            </h2>
            <p className="font-['Rajdhani'] text-green-300 tracking-wider">
              &gt; Establishing secure quantum tunnel...
            </p>
            <div className="mt-4 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500 animate-pulse"></div>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto mb-4 w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center glow-green">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="font-['Orbitron'] text-2xl font-bold text-green-400 mb-2 text-glow-green">
              CONNECTION ESTABLISHED
            </h2>
            <p className="font-['Rajdhani'] text-cyan-300 tracking-wider">
              &gt; Neural link authenticated. Routing to main terminal...
            </p>
            <div className="mt-4 flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
              ))}
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto mb-4 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="font-['Orbitron'] text-2xl font-bold text-red-400 mb-2">
              CONNECTION FAILED
            </h2>
            <p className="font-['Rajdhani'] text-cyan-300 mb-4 tracking-wide">
              &gt; {error || 'Neural interface authentication error detected.'}
            </p>
            <p className="text-sm font-['Rajdhani'] text-red-300 tracking-wider">
              [ REDIRECTING TO AUTHENTICATION TERMINAL ]
            </p>
          </>
        )}
      </div>
    </div>
  );
}
