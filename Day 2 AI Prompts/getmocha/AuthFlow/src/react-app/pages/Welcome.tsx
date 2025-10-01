import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { LogOut, User, Mail, Calendar, Loader2, Shield, Zap, Cpu } from 'lucide-react';
import GameLogo from '@/react-app/components/GameLogo';

export default function Welcome() {
  const { user, isPending, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/login');
    }
  }, [user, isPending, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isPending || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cyber-dark">
        <div className="animate-spin glow-cyan">
          <Loader2 className="w-8 h-8 text-cyan-400" />
        </div>
        <p className="mt-4 text-sm font-['Rajdhani'] text-green-400 tracking-wider">LOADING NEURAL PROFILE...</p>
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
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* Enhanced game lobby background matrix */}
      <div className="absolute inset-0 opacity-15 z-0">
        {/* Vertical scanning lines */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse"
            style={{
              left: `${(i * 3.33)}%`,
              height: '100%',
              animationDelay: `${i * 120}ms`,
              animationDuration: '3s'
            }}
          />
        ))}
        {/* Horizontal scanning lines */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"
            style={{
              top: `${(i * 5)}%`,
              width: '100%',
              animationDelay: `${i * 200}ms`,
              animationDuration: '4s'
            }}
          />
        ))}
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
            style={{
              left: `${20 + (i * 8)}%`,
              top: `${30 + (i * 5)}%`,
              animationDelay: `${i * 500}ms`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-20 premium-container">
        <div className="max-w-4xl w-full">
          {/* Game Lobby Welcome Header */}
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <GameLogo size="large" animated={true} />
            </div>
            <h1 className="font-['Orbitron'] text-6xl font-black mb-4 relative">
              <span className="text-green-400 text-glow-green animate-pulse">WELCOME</span>
              <span className="text-cyan-400 text-glow-cyan ml-4">TO THE LOBBY</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-blue-500/20 blur-xl animate-pulse"></div>
            </h1>
            <p className="font-['Rajdhani'] text-xl text-blue-300 tracking-wider mb-2">
              &gt; Neural link established • Authentication complete
            </p>
            <div className="flex justify-center items-center space-x-4 text-green-400">
              <Shield className="w-5 h-5 animate-pulse" />
              <span className="font-['Rajdhani'] text-sm tracking-wider">SECURE CONNECTION ACTIVE</span>
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Player Profile Panel */}
            <div className="glass-panel rounded-2xl overflow-hidden glow-green panel-hover transition-all duration-500">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 via-cyan-600 to-blue-600 px-6 py-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 animate-pulse"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center">
                    {user.google_user_data.picture ? (
                      <img
                        src={user.google_user_data.picture}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-3 border-cyan-400 shadow-lg mr-3 glow-cyan"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-800 rounded-full border-3 border-cyan-400 shadow-lg mr-3 flex items-center justify-center glow-cyan">
                        <User className="w-6 h-6 text-cyan-400" />
                      </div>
                    )}
                    <div>
                      <h2 className="font-['Orbitron'] text-xl font-bold text-white text-glow-cyan">
                        PLAYER PROFILE
                      </h2>
                      <p className="font-['Rajdhani'] text-green-300 tracking-wider text-sm">
                        {user.google_user_data.given_name ? `${user.google_user_data.given_name.toUpperCase()}` : 'AUTHENTICATED USER'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 p-2 rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-110"
                    title="Disconnect"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

            {/* Content */}
              <div className="p-6 bg-slate-900/50">
                <div className="grid gap-3">
                  <div className="flex items-center p-3 bg-slate-800/60 rounded-lg border-glow-green hover-glow-green transition-all duration-300">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3 glow-green">
                      <Mail className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-['Rajdhani'] font-medium text-cyan-400 tracking-wider">COMM FREQUENCY</p>
                      <p className="text-sm font-['Orbitron'] text-green-300">{user.email}</p>
                    </div>
                  </div>

                  {user.google_user_data.name && (
                    <div className="flex items-center p-3 bg-slate-800/60 rounded-lg border-glow-blue hover-glow-blue transition-all duration-300">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 glow-blue">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-['Rajdhani'] font-medium text-cyan-400 tracking-wider">IDENTITY MATRIX</p>
                        <p className="text-sm font-['Orbitron'] text-blue-300">{user.google_user_data.name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center p-3 bg-slate-800/60 rounded-lg border-glow-cyan hover-glow-cyan transition-all duration-300">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3 glow-cyan">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs font-['Rajdhani'] font-medium text-cyan-400 tracking-wider">LAST SYNC</p>
                      <p className="text-sm font-['Orbitron'] text-cyan-300">{formatDate(user.last_signed_in_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Lobby Controls Panel */}
            <div className="glass-panel rounded-2xl overflow-hidden glow-blue panel-hover transition-all duration-500">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 px-6 py-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                <div className="flex items-center relative z-10">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 glow-blue">
                    <Cpu className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-['Orbitron'] text-xl font-bold text-white text-glow-blue">
                      LOBBY CONTROLS
                    </h2>
                    <p className="font-['Rajdhani'] text-cyan-300 tracking-wider text-sm">
                      SYSTEM READY • ALL INTERFACES ACTIVE
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900/50">
                <div className="space-y-4">
                  {/* System Status */}
                  <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-['Rajdhani'] text-green-400 font-semibold tracking-wider">SYSTEM STATUS</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-['Orbitron'] text-xs text-green-400">ONLINE</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                        <span className="font-['Rajdhani'] text-cyan-300">NEURAL LINK</span>
                      </div>
                      <div className="text-center">
                        <Shield className="w-4 h-4 text-green-400 mx-auto mb-1" />
                        <span className="font-['Rajdhani'] text-cyan-300">SECURITY</span>
                      </div>
                      <div className="text-center">
                        <Cpu className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <span className="font-['Rajdhani'] text-cyan-300">QUANTUM CORE</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-cyber-button button-cyber text-slate-900 font-['Orbitron'] font-bold py-4 px-6 rounded-xl relative overflow-hidden group">
                      <span className="transition-all duration-300 group-hover:scale-110">&gt; ENTER MAIN TERMINAL</span>
                    </button>
                    
                    <button className="w-full bg-cyber-button-blue button-cyber button-cyber-blue text-white font-['Orbitron'] font-bold py-3 px-6 rounded-xl relative overflow-hidden group">
                      <span className="transition-all duration-300 group-hover:scale-110">&gt; SYSTEM DIAGNOSTICS</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 font-['Orbitron'] font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                    >
                      &lt; DISCONNECT SESSION
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
