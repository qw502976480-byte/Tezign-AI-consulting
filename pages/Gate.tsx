import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Tag, Logo } from '../components/ui';
import { Lock, ArrowRight, User, Mail, Phone, Building, ArrowLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// --- Constants ---

const SCENARIOS = [
  "Strategic Planning", "Content Production", "Market Research", 
  "Product Innovation", "Customer Service", "Data Analysis",
  "Competitor Monitoring", "Trend Spotting"
];

const INTERESTS = [
  "Product Innovation", "Brand Strategy", "Retail Growth", 
  "Food & Beverage", "Luxury", "AI Ops", 
  "Consumer Insights", "Social Listening", "Competitive Intelligence"
];

const Gate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  const redirectUrl = searchParams.get('redirect') || '/library';

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // --- Signup State ---
  const [step, setStep] = useState(1);
  const [signupData, setSignupData] = useState({
    account: '',
    password: '',
    fullName: '',
    phone: '',
    email: '',
    userType: '' as 'personal' | 'enterprise' | '',
    companyName: '',
    scenarios: [] as string[],
    interests: [] as string[],
    painPoints: ''
  });
  const [signupError, setSignupError] = useState('');

  // --- Login State ---
  const [loginData, setLoginData] = useState({ account: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Check access
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  // --- Handlers ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.account || !loginData.password) {
      setLoginError('Please enter both account and password.');
      return;
    }
    
    // Login via Context
    login({ name: loginData.account });
    navigate(redirectUrl);
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return !!signupData.account && !!signupData.password;
      case 2:
        return !!signupData.fullName && !!signupData.phone && !!signupData.email;
      case 3:
        if (!signupData.userType) return false;
        if (signupData.userType === 'enterprise' && !signupData.companyName) return false;
        return true;
      case 4:
        return signupData.scenarios.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    setSignupError('');
    if (!validateStep(step)) {
      setSignupError('Please fill in all required fields.');
      return;
    }

    if (step < 6) {
      setStep(s => s + 1);
    } else {
      completeSignup();
    }
  };

  const handleSkip = () => {
    if (step < 6) {
      setStep(s => s + 1);
    } else {
      completeSignup();
    }
  };

  const completeSignup = () => {
    login(signupData);
    navigate(redirectUrl);
  };

  const toggleSelection = (field: 'scenarios' | 'interests', value: string) => {
    setSignupData(prev => {
      const list = prev[field];
      const newList = list.includes(value) 
        ? list.filter(item => item !== value)
        : [...list, value];
      return { ...prev, [field]: newList };
    });
  };

  // --- Render Helpers ---
  
  const renderSignupContent = () => {
    return (
      <div className="animate-fade-in min-h-[300px] flex flex-col">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6">Create Account</h3>
            <div className="space-y-4">
              <Input 
                placeholder="Account Name" 
                value={signupData.account}
                onChange={e => setSignupData({...signupData, account: e.target.value})}
                autoFocus
              />
              <Input 
                type="password"
                placeholder="Password" 
                value={signupData.password}
                onChange={e => setSignupData({...signupData, password: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              <Input 
                placeholder="Full Name" 
                value={signupData.fullName}
                onChange={e => setSignupData({...signupData, fullName: e.target.value})}
                autoFocus
              />
              <Input 
                placeholder="Mobile Number" 
                value={signupData.phone}
                onChange={e => setSignupData({...signupData, phone: e.target.value})}
              />
              <Input 
                type="email"
                placeholder="Email Address" 
                value={signupData.email}
                onChange={e => setSignupData({...signupData, email: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6">User Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSignupData({...signupData, userType: 'personal'})}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${signupData.userType === 'personal' ? 'bg-white/10 border-gemini-ultra text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
              >
                <User size={24} />
                <span className="text-sm font-medium">Personal</span>
              </button>
              <button
                type="button"
                onClick={() => setSignupData({...signupData, userType: 'enterprise'})}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${signupData.userType === 'enterprise' ? 'bg-white/10 border-gemini-ultra text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
              >
                <Building size={24} />
                <span className="text-sm font-medium">Enterprise</span>
              </button>
            </div>
            {signupData.userType === 'enterprise' && (
              <div className="animate-fade-in pt-2">
                <Input 
                  placeholder="Company Name" 
                  value={signupData.companyName}
                  onChange={e => setSignupData({...signupData, companyName: e.target.value})}
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-2">Usage Scenarios</h3>
            <p className="text-xs text-slate-400 mb-4">Select all that apply (Multiple)</p>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map(s => (
                <Tag 
                  key={s} 
                  label={s} 
                  active={signupData.scenarios.includes(s)}
                  onClick={() => toggleSelection('scenarios', s)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-2">Interests</h3>
            <p className="text-xs text-slate-400 mb-4">Select topics (Multiple)</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i => (
                <Tag 
                  key={i} 
                  label={i} 
                  active={signupData.interests.includes(i)}
                  onClick={() => toggleSelection('interests', i)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-2">Pain Points</h3>
            <p className="text-xs text-slate-400 mb-4">What specific challenges are you facing?</p>
            <textarea 
              className="w-full h-32 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 resize-none text-sm font-normal"
              placeholder="Describe here..."
              value={signupData.painPoints}
              onChange={e => setSignupData({...signupData, painPoints: e.target.value})}
              autoFocus
            />
          </div>
        )}

        {/* Navigation Area */}
        <div className="mt-auto pt-8">
          {signupError && <p className="text-red-400 text-xs text-center mb-4">{signupError}</p>}
          
          <div className="flex gap-3">
             {step >= 5 && (
               <Button onClick={handleSkip} variant="outline" className="flex-1 text-sm h-11 border-white/10 text-slate-400">
                 Skip
               </Button>
             )}
             <Button onClick={handleNext} variant="gemini" className="flex-1 text-sm font-bold h-11 group">
               {step === 6 ? 'Complete' : 'Next'} 
               {step < 6 && <ChevronRight size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform" />}
             </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden font-sans bg-black">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gemini-ultra/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gemini-pro/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute top-8 left-8 z-20">
        <Logo />
      </div>

      <div className="max-w-md w-full z-10 relative">
        <div className="transition-all duration-500 ease-in-out">
          
          {/* Enhanced Elegant Card Container */}
          <div className="relative group w-full">
            {/* Subtle Glow Behind */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gemini-ultra via-gemini-pro to-gemini-nano rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>
            
            {/* Main Card with Thin 1px Gradient Border */}
            <div 
              className="relative bg-navy-900/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
              style={{
                background: 'linear-gradient(rgba(5,5,5,0.95), rgba(5,5,5,0.95)) padding-box, linear-gradient(135deg, rgba(66, 133, 244, 0.4), rgba(161, 66, 244, 0.4), rgba(244, 180, 0, 0.4)) border-box',
                border: '1px solid transparent',
              }}
            >
            
              {/* LOGIN MODE */}
              {mode === 'login' && (
                <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 text-white shadow-inner">
                      <Lock size={20} />
                    </div>
                    <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400 text-sm">Sign in to access Tezign AI Consulting</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input 
                      placeholder="Account Name" 
                      value={loginData.account} 
                      onChange={(e) => setLoginData({...loginData, account: e.target.value})}
                    />
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      value={loginData.password} 
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    />
                    
                    {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}

                    <Button type="submit" variant="gemini" className="w-full text-sm font-bold h-12 mt-2 shadow-lg shadow-gemini-ultra/20">
                      {t('login')}
                    </Button>
                  </form>

                  <div className="text-center pt-4">
                    <p className="text-slate-500 text-xs">
                      New here? 
                      <button onClick={() => setMode('signup')} className="text-white font-medium ml-2 hover:underline decoration-gemini-ultra decoration-2 underline-offset-4">
                        Create an account
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* SIGNUP MODE */}
              {mode === 'signup' && (
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <button 
                      onClick={() => {
                        if (step > 1) setStep(s => s - 1);
                        else setMode('login');
                      }} 
                      className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    
                    {/* Steps Dots */}
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-gemini-ultra' : i < step ? 'w-2 bg-gemini-ultra/50' : 'w-2 bg-white/10'}`} />
                        ))}
                    </div>
                    <div className="w-8" /> {/* Spacer for centering */}
                  </div>

                  {renderSignupContent()}
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-600 flex justify-center gap-6 font-mono uppercase mt-12">
          <a href="#" className="hover:text-slate-400 transition-colors">{t('privacy')}</a>
          <a href="#" className="hover:text-slate-400 transition-colors">{t('terms')}</a>
        </div>
      </div>
    </div>
  );
};

export default Gate;