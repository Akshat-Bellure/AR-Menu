import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const baseStyle = "px-5 py-3 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40",
    secondary: "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
    ghost: "hover:bg-white/5 text-slate-400 hover:text-white",
    outline: "border-2 border-white/10 hover:border-white/30 text-white bg-transparent"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          <Icon size={18} />
        </div>
      )}
      <input 
        className={`w-full ${Icon ? 'pl-12' : 'px-4'} pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-slate-600 ${className}`} 
        {...props} 
      />
    </div>
  </div>
);

export const Badge = ({ children, color = 'orange' }: { children?: React.ReactNode, color?: string }) => (
  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-${color}-500/10 text-${color}-500 border border-${color}-500/20`}>
    {children}
  </span>
);