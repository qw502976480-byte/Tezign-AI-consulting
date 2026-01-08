import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Tag, Logo } from '../components/ui';
import { Lock, ArrowRight, User, Mail, Phone, Building, ArrowLeft, ChevronRight, Send, MapPin, Briefcase, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Gate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, lang } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  const redirectUrl = searchParams.get('redirect') || '/library';

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // --- Signup State ---
  const [step, setStep] = useState(1);
  const [signupData, setSignupData] = useState({
    email: '', 
    verificationCode: '',
    password: '',
    fullName: '',
    phone: '',
    userType: '' as 'personal' | 'enterprise' | '',
    // Enterprise fields
    companyName: '',
    department: '',
    jobTitle: '',
    // Personal fields
    profession: '',
    // Shared location fields
    country: '',
    city: '',
    // Tags
    scenarios: [] as string[],
    interests: [] as string[],
    painPoints: ''
  });
  const [signupError, setSignupError] = useState('');
  
  // Verification Code Logic
  const [codeCountdown, setCodeCountdown] = useState(0);

  // --- Login State ---
  const [loginData, setLoginData] = useState({ account: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Check access
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  // Simulate IP-based location detection on mount
  useEffect(() => {
    // Default to China/Shanghai for this simulation
    const defaultCountry = lang === 'cn' ? '中国' : 'China';
    const defaultCity = lang === 'cn' ? '上海' : 'Shanghai';
    
    setSignupData(prev => ({
      ...prev,
      country: defaultCountry,
      city: defaultCity
    }));
  }, [lang]);

  // Countdown timer for verification code
  useEffect(() => {
    if (codeCountdown > 0) {
      const timer = setTimeout(() => setCodeCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeCountdown]);

  // --- Handlers ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.account || !loginData.password) {
      setLoginError(t('enterCredentials') as string);
      return;
    }
    
    // Login via Context
    login({ name: loginData.account });
    navigate(redirectUrl);
  };

  const handleSendCode = () => {
    if (!signupData.email) {
      setSignupError(t('fillAllFields') as string);
      return;
    }
    // Simulate sending code
    setCodeCountdown(60);
    setSignupError('');
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        // Must have email, password, and verification code
        return !!signupData.email && !!signupData.password && !!signupData.verificationCode;
      case 2:
        // Name and Phone
        return !!signupData.fullName && !!signupData.phone;
      case 3:
        // User Type selection
        return !!signupData.userType;
      case 4:
        // Details based on type
        if (signupData.userType === 'enterprise') {
          return !!signupData.companyName && !!signupData.department && !!signupData.jobTitle && !!signupData.country && !!signupData.city;
        } else {
          return !!signupData.profession && !!signupData.country && !!signupData.city;
        }
      case 5:
        // Scenarios
        return signupData.scenarios.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    setSignupError('');
    if (!validateStep(step)) {
      setSignupError(t('fillAllFields') as string);
      return;
    }

    if (step < 7) {
      setStep(s => s + 1);
    } else {
      completeSignup();
    }
  };

  const handleSkip = () => {
    if (step < 7) {
      setStep(s => s + 1);
    } else {
      completeSignup();
    }
  };

  const completeSignup = () => {
    // Map email to 'name' for the AuthContext which uses 'name' as identifier
    login({
       ...signupData,
       name: signupData.email 
    });
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

  // Helper to get city list based on country
  const getCityOptions = () => {
    const c = signupData.country;
    if (c === 'China' || c === '中国') return t('citiesListCN') as string[];
    if (c === 'United States' || c === '美国') return t('citiesListUS') as string[];
    return t('citiesListOther') as string[];
  };

  // --- Render Helpers ---
  
  const renderSignupContent = () => {
    const scenariosList = t('scenariosList') as string[];
    const interestsList = t('interestsList') as string[];
    const countriesList = t('countriesList') as string[];
    const citiesList = getCityOptions();

    // Reusable Custom Select
    const CustomSelect = ({ value, onChange, options, placeholder }: any) => (
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-white/40 focus:bg-black/60 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all font-normal"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt} className="bg-navy-900 text-white">{opt}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
    );

    return (
      <div className="animate-fade-in min-h-[350px] flex flex-col">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6">{t('createAccount')}</h3>
            <div className="space-y-4">
              <Input 
                type="email"
                placeholder={t('emailPlaceholder') as string}
                value={signupData.email}
                onChange={e => setSignupData({...signupData, email: e.target.value})}
                autoFocus
              />
              <div className="flex gap-2">
                 <Input 
                    placeholder={t('verificationCode') as string}
                    value={signupData.verificationCode}
                    onChange={e => setSignupData({...signupData, verificationCode: e.target.value})}
                    className="flex-1"
                 />
                 <button 
                    type="button"
                    onClick={handleSendCode}
                    disabled={codeCountdown > 0 || !signupData.email}
                    className="px-4 rounded-lg bg-white/10 border border-white/10 text-xs font-medium text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[100px]"
                 >
                    {codeCountdown > 0 ? `${codeCountdown}s` : t('sendCode')}
                 </button>
              </div>
              <Input 
                type="password"
                placeholder={t('passwordPlaceholder') as string}
                value={signupData.password}
                onChange={e => setSignupData({...signupData, password: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6">{t('contactInfo')}</h3>
            <div className="space-y-4">
              <Input 
                placeholder={t('namePlaceholder') as string}
                value={signupData.fullName}
                onChange={e => setSignupData({...signupData, fullName: e.target.value})}
                autoFocus
              />
              <Input 
                placeholder={t('mobileNumber') as string}
                value={signupData.phone}
                onChange={e => setSignupData({...signupData, phone: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6">{t('userType')}</h3>
            <div className="grid grid-cols-2 gap-4 h-[140px]">
              <button
                type="button"
                onClick={() => setSignupData({...signupData, userType: 'personal'})}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-3 ${signupData.userType === 'personal' ? 'bg-white/10 border-gemini-ultra text-white shadow-[0_0_15px_rgba(66,133,244,0.3)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
              >
                <div className={`p-3 rounded-full ${signupData.userType === 'personal' ? 'bg-gemini-ultra text-white' : 'bg-white/10'}`}>
                   <User size={24} />
                </div>
                <span className="text-sm font-medium">{t('personal')}</span>
              </button>
              <button
                type="button"
                onClick={() => setSignupData({...signupData, userType: 'enterprise'})}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-3 ${signupData.userType === 'enterprise' ? 'bg-white/10 border-gemini-ultra text-white shadow-[0_0_15px_rgba(66,133,244,0.3)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
              >
                 <div className={`p-3 rounded-full ${signupData.userType === 'enterprise' ? 'bg-gemini-ultra text-white' : 'bg-white/10'}`}>
                   <Building size={24} />
                 </div>
                <span className="text-sm font-medium">{t('enterprise')}</span>
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
           <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-6">{t('userDetails')}</h3>
              
              {signupData.userType === 'enterprise' ? (
                 <div className="space-y-4">
                    <Input 
                        placeholder={t('companyName') as string}
                        value={signupData.companyName}
                        onChange={e => setSignupData({...signupData, companyName: e.target.value})}
                        autoFocus
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <Input 
                          placeholder={t('department') as string}
                          value={signupData.department}
                          onChange={e => setSignupData({...signupData, department: e.target.value})}
                       />
                       <Input 
                          placeholder={t('jobTitle') as string}
                          value={signupData.jobTitle}
                          onChange={e => setSignupData({...signupData, jobTitle: e.target.value})}
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <CustomSelect 
                          value={signupData.country}
                          onChange={(e: any) => setSignupData({...signupData, country: e.target.value, city: ''})}
                          options={countriesList}
                          placeholder={t('selectCountry')}
                       />
                       <CustomSelect 
                          value={signupData.city}
                          onChange={(e: any) => setSignupData({...signupData, city: e.target.value})}
                          options={citiesList}
                          placeholder={t('selectCity')}
                       />
                    </div>
                 </div>
              ) : (
                 <div className="space-y-4">
                    <Input 
                        placeholder={t('profession') as string}
                        value={signupData.profession}
                        onChange={e => setSignupData({...signupData, profession: e.target.value})}
                        autoFocus
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <CustomSelect 
                          value={signupData.country}
                          onChange={(e: any) => setSignupData({...signupData, country: e.target.value, city: ''})}
                          options={countriesList}
                          placeholder={t('selectCountry')}
                       />
                       <CustomSelect 
                          value={signupData.city}
                          onChange={(e: any) => setSignupData({...signupData, city: e.target.value})}
                          options={citiesList}
                          placeholder={t('selectCity')}
                       />
                    </div>
                 </div>
              )}
           </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-2">{t('usageScenarios')}</h3>
            <p className="text-xs text-slate-400 mb-4">{t('selectMultiple')}</p>
            <div className="flex flex-wrap gap-2">
              {scenariosList.map(s => (
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

        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-2">{t('interests')}</h3>
            <p className="text-xs text-slate-400 mb-4">{t('selectTopics')}</p>
            <div className="flex flex-wrap gap-2">
              {interestsList.map(i => (
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

        {step === 7 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-2">{t('painPoints')}</h3>
            <p className="text-xs text-slate-400 mb-4">{t('challengesPrompt')}</p>
            <textarea 
              className="w-full h-32 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 resize-none text-sm font-normal"
              placeholder={t('describePlaceholder') as string}
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
                 {t('skip')}
               </Button>
             )}
             <Button onClick={handleNext} variant="gemini" className="flex-1 text-sm font-bold h-11 group">
               {step === 7 ? t('complete') : t('next')} 
               {step < 7 && <ChevronRight size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform" />}
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
                    <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">{t('welcomeBack')}</h1>
                    <p className="text-slate-400 text-sm">{t('signInSubtitle')}</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input 
                      placeholder={t('accountNamePlaceholder') as string}
                      value={loginData.account} 
                      onChange={(e) => setLoginData({...loginData, account: e.target.value})}
                    />
                    <Input 
                      type="password" 
                      placeholder={t('passwordPlaceholder') as string}
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
                      {t('newHere')} 
                      <button onClick={() => setMode('signup')} className="text-white font-medium ml-2 hover:underline decoration-gemini-ultra decoration-2 underline-offset-4">
                        {t('createAccountAction')}
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
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
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