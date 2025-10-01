import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { ArrowLeft, Loader2, Shield, Zap } from 'lucide-react';
import GameLogo from '@/react-app/components/GameLogo';

export default function Login() {
  const { user, isPending, isFetching, redirectToLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isPending && user) {
      navigate('/welcome');
    }
  }, [user, isPending, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await redirectToLogin();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cyber-dark">
        <div className="animate-spin glow-cyan">
          <Loader2 className="w-8 h-8 text-cyan-400" />
        </div>
        <p className="mt-4 text-sm font-['Rajdhani'] text-green-400 tracking-wider">INITIALIZING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* Enhanced animated background grid */}
      <div className="absolute inset-0 opacity-15 z-0">
        <div className="grid grid-cols-10 grid-rows-10 h-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div 
              key={i} 
              className="border border-green-500/8 animate-pulse relative" 
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {i % 10 === 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-20 premium-container">
        <div className="max-w-md w-full">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-cyan-400 hover:text-green-400 mb-8 transition-all duration-300 font-['Rajdhani'] font-semibold tracking-wider hover:translate-x-2 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            &lt; RETURN TO MAIN
          </button>

          <div className="glass-panel rounded-2xl p-8 glow-blue panel-hover transition-all duration-500">
            <div className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                <GameLogo size="large" animated={true} />
              </div>
              <h1 className="font-['Orbitron'] text-3xl font-black text-blue-400 mb-2 text-glow-blue">NEURAL LINK</h1>
              <p className="font-['Rajdhani'] text-cyan-300 font-medium tracking-wide">
                &gt; Establish secure connection protocol
              </p>
            </div>

            <div className="space-y-6">
              {/* Security Notice */}
              <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/5">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-green-400 mr-2" />
                  <span className="font-['Orbitron'] text-green-400 font-semibold tracking-wider text-sm">SECURE AUTHENTICATION</span>
                  <Shield className="w-5 h-5 text-green-400 ml-2" />
                </div>
                <p className="text-xs font-['Rajdhani'] text-cyan-300 text-center tracking-wide">
                  This terminal uses quantum-encrypted OAuth protocols for maximum security.
                  <br />Traditional passwords have been deprecated for neural safety.
                </p>
              </div>

              {/* Google Authentication */}
              <button
                onClick={handleGoogleLogin}
                disabled={isFetching || isLoading}
                className="w-full bg-cyber-button-blue button-cyber button-cyber-blue text-white font-['Orbitron'] font-bold py-4 px-6 rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-glow-blue relative overflow-hidden group"
              >
                {isFetching || isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-300 mr-3" />
                    <span>ESTABLISHING CONNECTION...</span>
                    <div className="loading-progress-blue"></div>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path
                        fill="#00D4FF"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#00FF88"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#00D4FF"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#00FF88"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="transition-all duration-300">INITIATE GOOGLE PROTOCOL</span>
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cyan-500/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900/80 font-['Rajdhani'] text-green-400 tracking-wider">[ QUANTUM ENCRYPTION ]</span>
                </div>
              </div>

              {/* Additional Authentication Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-center p-3 bg-slate-800/40 rounded-lg border border-green-500/20">
                  <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="font-['Rajdhani'] text-xs text-cyan-300 tracking-wider">INSTANT ACCESS</span>
                </div>
                <div className="flex items-center justify-center p-3 bg-slate-800/40 rounded-lg border border-blue-500/20">
                  <Shield className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="font-['Rajdhani'] text-xs text-cyan-300 tracking-wider">SECURE VAULT</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs font-['Rajdhani'] text-cyan-400 tracking-wide">
                  Neural interface authentication protocol active.
                  <br />Data streams secured via quantum encryption matrix.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
