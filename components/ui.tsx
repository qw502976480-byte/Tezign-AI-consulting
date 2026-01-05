import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gemini';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const base = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg"
  };

  // Special handling for the Gradient Border (Gemini) variant
  // Reference: Black background, thin animated gradient border, reveal arrow on hover
  if (variant === 'gemini') {
    return (
      <>
        <style>
          {`
            @keyframes gemini-border-flow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .gemini-btn-anim {
              background-size: 100% 100%, 400% 400% !important;
              animation: gemini-border-flow 3s ease infinite;
            }
            /* Target the lucide icon (svg) inside the button to hide/show it */
            .gemini-btn-anim svg {
              max-width: 0;
              opacity: 0;
              margin-left: 0;
              transform: translateX(-10px);
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .gemini-btn-anim:hover svg {
              max-width: 24px; 
              opacity: 1;
              margin-left: 0.5rem;
              transform: translateX(0);
            }
          `}
        </style>
        <button 
          className={`${base} ${sizes[size]} ${className} text-white hover:brightness-110 relative group overflow-hidden gemini-btn-anim`}
          style={{
              background: 'linear-gradient(#050505, #050505) padding-box, linear-gradient(135deg, #4285F4, #A142F4, #F4B400, #4285F4) border-box',
              border: '1px solid transparent',
          }}
          {...props}
        >
          {children}
        </button>
      </>
    );
  }

  const variants = {
    // Primary: Updated to Deep Blue/Black gradient or just clean white for high contrast
    primary: "bg-white text-black hover:bg-slate-200 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    
    // Secondary: Glass style
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm",
    
    // Outline: Thin border
    outline: "bg-transparent border border-white/20 text-slate-300 hover:text-white hover:border-white/50",
    
    // Fallback
    gemini: "" 
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false, noPadding = false, ...props }) => {
  return (
    <div className={`gradient-border-wrapper ${hoverEffect ? 'glass-card-hover cursor-pointer' : ''} ${className}`} {...props}>
      <div className={`relative h-full w-full bg-navy-900/90 rounded-[inherit] overflow-hidden ${noPadding ? '' : 'p-6'}`}>
         {children}
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider backdrop-blur-md ${className || 'bg-white/5 text-slate-200 border border-white/10'}`}>
    {children}
  </span>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'ghost';
}

export const Input: React.FC<InputProps> = ({ className = '', variant = 'default', ...props }) => {
  // Added appearance-none and explicit outline/border controls
  const baseStyles = "w-full rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none appearance-none font-normal";
  
  const variants = {
    default: "bg-black/40 border border-white/10 focus:border-white/40 focus:bg-black/60 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all",
    // Ghost: Explicitly remove all borders, outlines, rings, shadows, and transitions that might cause flashes
    ghost: "bg-transparent border-none border-0 outline-none ring-0 focus:ring-0 focus:border-none focus:outline-none shadow-none focus:shadow-none" 
  };

  return (
    <input 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

export const Tag: React.FC<{ label: string; onClick?: () => void; active?: boolean }> = ({ label, onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all border ${
      active 
        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
        : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-500 hover:text-slate-200'
    }`}
  >
    {label}
  </button>
);

export const Logo: React.FC = () => (
  <Link to="/" className="flex items-center">
    <span className="text-xl font-medium text-white tracking-tight">Tezign AI Consulting</span>
  </Link>
);