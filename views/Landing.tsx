
import React, { useState } from 'react';
import { Crown, ChefHat, ScanLine, Play } from 'lucide-react';
import { AdminLoginModal } from './Admin';
import { UserCredentials } from '../types';

interface LandingProps {
  onSelectMode: (mode: 'admin' | 'customer') => void;
  onLoginSuccess: (user: string) => void;
  registeredUsers: UserCredentials[];
}

export const Landing: React.FC<LandingProps> = ({ onSelectMode, onLoginSuccess, registeredUsers }) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
      
      {/* Admin Access Button */}
      <button 
        onClick={() => setShowLogin(true)} 
        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium backdrop-blur-sm group shadow-xl"
      >
        <Crown size={16} className="text-orange-500 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Owner Access</span>
      </button>

      {showLogin && (
        <AdminLoginModal 
            onLogin={onLoginSuccess} 
            onCancel={() => setShowLogin(false)} 
            registeredUsers={registeredUsers}
        />
      )}

      <div className="relative z-10 text-center space-y-10 max-w-md w-full">
        {/* Logo Section */}
        <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-700 fade-in">
            <h2 className="text-2xl md:text-3xl font-light text-slate-300">
                Hey, are you <span className="text-orange-500 font-bold relative inline-block">
                    Hungry?
                    <svg className="absolute w-full h-2 -bottom-1 left-0 text-orange-500 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                         <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                    </svg>
                </span>
            </h2>
            
            <div className="mx-auto w-28 h-28 bg-gradient-to-br from-orange-500 to-red-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-orange-500/30 transform hover:scale-105 hover:rotate-3 transition-all duration-500 border-4 border-orange-400/20">
                <ChefHat size={56} className="drop-shadow-md" />
            </div>
        </div>

        {/* Title Section */}
        <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
                AR MENU <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">PLATFORM</span>
            </h1>
            <div className="flex items-center justify-center gap-4">
                <div className="h-px w-8 bg-white/20"></div>
                <p className="text-slate-500 text-xs font-mono tracking-widest opacity-60">made by AkB</p>
                <div className="h-px w-8 bg-white/20"></div>
            </div>
            <p className="text-slate-400 text-lg max-w-xs mx-auto leading-relaxed">
                Experience the future of dining with immersive 3D food visualization.
            </p>
        </div>

        {/* CTA Button */}
        <div className="pt-6">
            <button 
                onClick={() => onSelectMode('customer')} 
                className="group relative w-full overflow-hidden rounded-[2rem] bg-white p-1 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_50px_-12px_rgba(249,115,22,0.3)]"
            >
                <div className="relative bg-slate-950 rounded-[1.8rem] p-8 flex flex-col items-center gap-4 border border-white/10 group-hover:border-orange-500/50 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-2 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/40">
                        <ScanLine size={32} />
                    </div>
                    <div className="space-y-1">
                        <span className="text-white font-black text-2xl block tracking-tight">SCAN QR CODE</span>
                        <p className="text-slate-500 text-sm font-medium group-hover:text-slate-400 transition-colors">Point your camera to view menu</p>
                    </div>
                </div>
                
                {/* Animated Border/Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            </button>
        </div>
      </div>
    </div>
  );
};
