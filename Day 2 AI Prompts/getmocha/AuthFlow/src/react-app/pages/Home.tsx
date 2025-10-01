import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import GameLogo from '@/react-app/components/GameLogo';

export default function Home() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && user) {
      navigate('/welcome');
    }
  }, [user, isPending, navigate]);

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
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-32 h-32 border border-green-500/20 rounded-full animate-pulse">
          <div className="premium-backdrop"></div>
        </div>
        <div className="absolute bottom-40 right-20 w-24 h-24 border border-blue-500/20 rounded-full animate-pulse delay-1000">
          <div className="premium-backdrop"></div>
        </div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-cyan-500/20 rounded-full animate-pulse delay-500">
          <div className="premium-backdrop"></div>
        </div>
        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/4 w-20 h-20 border border-cyan-500/10 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-28 h-28 border border-green-500/10 rounded-full animate-pulse delay-1500"></div>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-20 premium-container">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="font-['Orbitron'] text-5xl font-black mb-4 text-glow-green">
              <span className="text-green-400">AUTH</span>
              <span className="text-cyan-400 text-glow-cyan">FLOW</span>
            </h1>
            <p className="text-lg font-['Rajdhani'] font-semibold text-blue-300 tracking-wider">
              &gt; SECURE NEURAL AUTHENTICATION PROTOCOL
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 glow-green panel-hover transition-all duration-500">
            <div className="mb-6">
              <div className="mb-4 flex justify-center">
                <GameLogo size="large" animated={true} />
              </div>
              <h2 className="font-['Orbitron'] text-2xl font-bold text-green-400 mb-2 text-glow-green">INITIALIZE</h2>
              <p className="font-['Rajdhani'] text-cyan-300 font-medium tracking-wide">
                Access neural interface terminal
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-cyber-button button-cyber text-slate-900 font-['Orbitron'] font-bold py-4 px-6 rounded-xl flex items-center justify-center group relative overflow-hidden"
            >
              <span className="mr-2 transition-all duration-300 group-hover:scale-110">&gt;</span>
              <span className="transition-all duration-300">CONNECT</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
            </button>

            <div className="mt-6 pt-6 border-t border-green-500/30">
              <p className="text-xs font-['Rajdhani'] text-cyan-400 text-center tracking-wider">
                [ QUANTUM ENCRYPTED OAUTH PROTOCOL ]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
