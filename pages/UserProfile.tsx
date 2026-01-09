import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth, User as UserType } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Badge, Input, ContentTag } from '../components/ui';
import { User, Bookmark, Settings, ArrowRight, Shield, Bell, Lock, CheckCircle, AlertCircle, Camera, Trash2, CheckSquare, Square, MessageSquare } from 'lucide-react';
import { getData } from '../data';

const UserProfile: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, updateProfile, toggleBookmark } = useAuth();
  const { t, lang } = useLanguage();
  const data = getData(lang);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTab = searchParams.get('tab') || 'account';

  // --- Edit State ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    company: '',
  });

  // --- Bookmarks Management State ---
  const [isManagingBookmarks, setIsManagingBookmarks] = useState(false);
  const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set());

  // --- Password Change State ---
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
        navigate('/gate');
    }
    if (user) {
        setFormData({
            nickname: user.nickname || user.name || '',
            email: user.email || '',
            company: user.company || 'Tezign AI Consulting'
        });
    }
  }, [isAuthenticated, navigate, user]);

  const handleSaveProfile = () => {
    updateProfile({
        nickname: formData.nickname,
        email: formData.email,
        company: formData.company
    });
    setIsEditing(false);
  };

  const handleSavePassword = () => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
          setPasswordMessage({ type: 'error', text: "Passwords do not match" });
          return;
      }
      if (passwordData.newPassword.length < 6) {
          setPasswordMessage({ type: 'error', text: "Password must be at least 6 characters" });
          return;
      }
      
      // In a real app, we would verify old password and call API
      updateProfile({ password: passwordData.newPassword });
      setPasswordMessage({ type: 'success', text: t('passwordUpdated') as string });
      
      setTimeout(() => {
          setIsChangingPassword(false);
          setPasswordMessage(null);
          setPasswordData({ newPassword: '', confirmPassword: '' });
      }, 1500);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            updateProfile({ avatar: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  // --- Bookmark Logic ---
  
  // Get actual bookmark objects based on slugs in user profile
  const bookmarks = data.all.filter(item => user?.bookmarks?.includes(item.slug));

  const toggleSelection = (slug: string) => {
    const newSelected = new Set(selectedBookmarks);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    setSelectedBookmarks(newSelected);
  };

  const handleBatchRemove = () => {
    const newBookmarks = (user?.bookmarks || []).filter(slug => !selectedBookmarks.has(slug));
    updateProfile({ bookmarks: newBookmarks });
    setSelectedBookmarks(new Set());
    setIsManagingBookmarks(false);
  };

  const handleSingleRemove = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    toggleBookmark(slug);
  };

  const selectAll = () => {
      if (selectedBookmarks.size === bookmarks.length) {
          setSelectedBookmarks(new Set());
      } else {
          setSelectedBookmarks(new Set(bookmarks.map(b => b.slug)));
      }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'case': return t('typeCase');
      case 'report': return t('typeReport');
      case 'methodology': return t('typeMethod');
      case 'announcement': return t('typeAnnounce');
      default: return 'Resource';
    }
  };

  const tabs = [
    { id: 'account', label: t('account'), icon: User },
    { id: 'bookings', label: t('consultations'), icon: MessageSquare },
    { id: 'bookmarks', label: t('bookmarks'), icon: Bookmark },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  if (!user) return null;

  const displayInitial = (user.nickname || user.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-medium text-white mb-12 tracking-tight">{t('myProfile')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setSearchParams({ tab: tab.id }); setIsManagingBookmarks(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow-lg border border-white/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
             <div className="bg-navy-900/50 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-xl min-h-[500px] animate-fade-in relative overflow-hidden">
                
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gemini-ultra/5 rounded-full blur-[80px] -z-10" />

                {activeTab === 'account' && (
                  <div className="space-y-10 animate-fade-in">
                     
                     {/* Hidden File Input */}
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                     />

                     {/* 1. Header Section */}
                     <div className="flex flex-col md:flex-row md:items-center gap-8 border-b border-white/5 pb-10">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gemini-ultra to-gemini-pro flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_30px_rgba(66,133,244,0.25)] border-2 border-white/10 overflow-hidden relative">
                               {user.avatar ? (
                                   <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                               ) : (
                                   displayInitial
                               )}
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Camera size={24} className="text-white/80" />
                               </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-navy-900 border border-white/10 flex items-center justify-center text-gemini-ultra shadow-lg">
                                <span className="text-xs font-bold">{displayInitial}</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                           <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">{user.nickname || user.name || 'User'}</h2>
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">{t('accountName')}</span>
                              <p className="text-slate-300 text-sm font-medium">{user.name}</p>
                           </div>
                        </div>
                     </div>
                     
                     {/* 2. Form Section */}
                     <div className="space-y-6 max-w-lg">
                        
                        {/* Editable Fields */}
                        <div className="grid gap-6">
                           <div>
                              <label className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2 block">{t('nickname')}</label>
                              {isEditing ? (
                                  <Input 
                                    value={formData.nickname} 
                                    onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                                    className="bg-black/40 border-white/20 focus:border-white/50"
                                  />
                              ) : (
                                  <div className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-slate-300">
                                     {user?.nickname || user?.name}
                                  </div>
                              )}
                           </div>

                           <div>
                              <label className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2 block">{t('email')}</label>
                              {isEditing ? (
                                  <Input 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="bg-black/40 border-white/20 focus:border-white/50"
                                  />
                              ) : (
                                  <div className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-slate-300">
                                     {user?.email || 'user@tezign.com'}
                                  </div>
                              )}
                           </div>
                           
                           <div>
                              <label className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2 block">{t('company')}</label>
                              {isEditing ? (
                                  <Input 
                                    value={formData.company} 
                                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                                    className="bg-black/40 border-white/20 focus:border-white/50"
                                  />
                              ) : (
                                  <div className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-slate-300">
                                     {user?.company || 'Tezign AI Consulting'}
                                  </div>
                              )}
                           </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2">
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <Button onClick={handleSaveProfile} size="sm" className="h-10 px-6">{t('saveChanges')}</Button>
                                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="h-10 px-6 border-white/10 hover:bg-white/5">{t('cancel')}</Button>
                                </div>
                            ) : (
                                <Button onClick={() => setIsEditing(true)} variant="outline" className="border-white/10 hover:bg-white/5 text-sm h-10 px-6">{t('editProfile')}</Button>
                            )}
                        </div>
                     </div>

                     <div className="w-full h-px bg-white/5 my-8" />

                     {/* 3. Password Section */}
                     <div className="max-w-lg">
                        {!isChangingPassword ? (
                            <button 
                                onClick={() => setIsChangingPassword(true)}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
                            >
                                <Lock size={16} className="group-hover:text-gemini-ultra transition-colors" /> 
                                {t('changePassword')}
                            </button>
                        ) : (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 animate-fade-in">
                                <h3 className="text-white font-medium mb-2">{t('changePassword')}</h3>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2 block">{t('newPassword')}</label>
                                    <Input 
                                        type="password"
                                        placeholder={t('enterPassword') as string}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        className="bg-black/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2 block">{t('confirmPassword')}</label>
                                    <Input 
                                        type="password"
                                        placeholder={t('confirmPassword') as string}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        className="bg-black/40"
                                    />
                                </div>

                                {passwordMessage && (
                                    <div className={`flex items-center gap-2 text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                        {passwordMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                        {passwordMessage.text}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button onClick={handleSavePassword} size="sm" className="h-9">{t('saveChanges')}</Button>
                                    <Button onClick={() => { setIsChangingPassword(false); setPasswordMessage(null); }} variant="outline" size="sm" className="h-9 border-white/10">{t('cancel')}</Button>
                                </div>
                            </div>
                        )}
                     </div>
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div className="space-y-8 animate-fade-in">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <MessageSquare size={20} className="text-gemini-ultra" /> {t('upcomingSessions')}
                      {user.bookings && user.bookings.length > 0 && (
                        <span className="text-sm font-normal text-slate-500 ml-2">({user.bookings.length})</span>
                      )}
                    </h2>

                    {!user.bookings || user.bookings.length === 0 ? (
                      <div className="text-center py-20 text-slate-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                        {t('noConsultations')}
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {user.bookings.map(booking => (
                          <div 
                            key={booking.id} 
                            className="bg-white/5 border border-white/5 rounded-xl p-5 hover:bg-white/10 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gemini-ultra/10 text-gemini-ultra rounded-full flex items-center justify-center border border-gemini-ultra/20">
                                <MessageSquare size={20} />
                              </div>
                              <div>
                                <h3 className="font-medium text-white mb-1">Scenario Consultation</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-400 font-mono">
                                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                  <span>{booking.slot}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                                {t('confirmed')}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'bookmarks' && (
                  <div className="space-y-6 animate-fade-in">
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Bookmark size={20} className="text-gemini-ultra" /> {t('savedItems')}
                            <span className="text-sm font-normal text-slate-500 ml-2">({bookmarks.length})</span>
                        </h2>
                        
                        <div className="flex gap-3">
                            {isManagingBookmarks ? (
                                <>
                                   {selectedBookmarks.size > 0 && (
                                     <Button onClick={handleBatchRemove} variant="gemini" size="sm" className="h-8 px-4 text-xs">
                                        Remove ({selectedBookmarks.size})
                                     </Button>
                                   )}
                                   <Button onClick={() => setIsManagingBookmarks(false)} variant="outline" size="sm" className="h-8 px-4 text-xs border-white/10">
                                      Done
                                   </Button>
                                </>
                            ) : (
                                bookmarks.length > 0 && (
                                    <Button onClick={() => setIsManagingBookmarks(true)} variant="outline" size="sm" className="h-8 px-4 text-xs border-white/10 hover:bg-white/10">
                                        {t('manage')}
                                    </Button>
                                )
                            )}
                        </div>
                     </div>

                     {isManagingBookmarks && (
                        <div className="flex items-center gap-2 mb-4">
                            <button onClick={selectAll} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                                {selectedBookmarks.size === bookmarks.length && bookmarks.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                                Select All
                            </button>
                        </div>
                     )}

                     {bookmarks.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            No saved items yet.
                        </div>
                     ) : (
                        <div className="grid gap-4">
                            {bookmarks.map(item => (
                            <div 
                                key={item.slug} 
                                onClick={() => {
                                    if (isManagingBookmarks) {
                                        toggleSelection(item.slug);
                                    } else {
                                        navigate(`/resource/${item.slug}`);
                                    }
                                }}
                                className={`group flex gap-4 p-4 rounded-xl border transition-all cursor-pointer relative ${
                                    isManagingBookmarks && selectedBookmarks.has(item.slug)
                                        ? 'bg-gemini-ultra/10 border-gemini-ultra/50'
                                        : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-navy-800 border border-white/5 relative">
                                    <img src={item.coverImageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                                    
                                    {isManagingBookmarks && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            {selectedBookmarks.has(item.slug) ? (
                                                <div className="w-5 h-5 bg-gemini-ultra rounded flex items-center justify-center text-white"><CheckCircle size={14} /></div>
                                            ) : (
                                                <div className="w-5 h-5 border-2 border-white/50 rounded" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-grow min-w-0 pr-8">
                                    <h3 className="font-medium text-slate-200 group-hover:text-white line-clamp-1 transition-colors">{item.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-1 mt-1">{item.subtitle}</p>
                                    <div className="flex gap-2 mt-2">
                                        <ContentTag label={getTypeLabel(item.type) as string} type="category" />
                                    </div>
                                </div>

                                {!isManagingBookmarks && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button 
                                            onClick={(e) => handleSingleRemove(e, item.slug)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-white/10 rounded-full transition-all"
                                            title="Remove from saved"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <ArrowRight size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                                    </div>
                                )}
                            </div>
                            ))}
                        </div>
                     )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-8 animate-fade-in">
                     <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><Settings size={20} className="text-gemini-pro" /> {t('preferences')}</h2>
                     
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                <Bell size={20} className="text-slate-400" />
                              </div>
                              <div>
                                 <h3 className="text-white font-medium text-sm">{t('notifications')}</h3>
                                 <p className="text-xs text-slate-400 mt-0.5">{t('notifyDesc')}</p>
                              </div>
                           </div>
                           <div className="w-10 h-6 bg-gemini-ultra rounded-full relative cursor-pointer opacity-90 hover:opacity-100">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                <Shield size={20} className="text-slate-400" />
                              </div>
                              <div>
                                 <h3 className="text-white font-medium text-sm">{t('privacy')}</h3>
                                 <p className="text-xs text-slate-400 mt-0.5">{t('privacyDesc')}</p>
                              </div>
                           </div>
                           <Button variant="outline" size="sm" className="border-white/10 text-xs h-8 px-3 hover:bg-white/10">{t('manage')}</Button>
                        </div>
                     </div>
                     
                     <div className="pt-8 border-t border-white/10">
                        <button onClick={() => { logout(); navigate('/gate'); }} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center gap-2 px-2 py-1 rounded hover:bg-red-500/10">
                           {t('logout')}
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;