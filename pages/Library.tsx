import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../data';
import { Search, ArrowUpRight, Mic, ArrowUp, Bot, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { LibraryItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Input, Button } from '../components/ui';

const ITEMS_PER_PAGE = 12;

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  
  // Search State
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{text: string, links: LibraryItem[]} | null>(null);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const data = getData(lang);
  const allItems = data.all;
  const sortedItems = [...allItems].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const searchPrompts = t('searchPrompts') as string[];
  useEffect(() => {
    let promptIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: number;

    const type = () => {
      const currentPrompt = searchPrompts[promptIndex];
      if (isDeleting) {
        setAnimatedPlaceholder(currentPrompt.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setAnimatedPlaceholder(currentPrompt.substring(0, charIndex + 1));
        charIndex++;
      }
      if (!isDeleting && charIndex === currentPrompt.length) {
        isDeleting = true;
        timeoutId = window.setTimeout(type, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        promptIndex = (promptIndex + 1) % searchPrompts.length;
        timeoutId = window.setTimeout(type, 500);
      } else {
        const typingSpeed = isDeleting ? 60 : 120;
        timeoutId = window.setTimeout(type, typingSpeed);
      }
    };
    timeoutId = window.setTimeout(type, 500);
    return () => clearTimeout(timeoutId);
  }, [lang, searchPrompts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    setSubmittedQuery('');
    setTimeout(() => {
      setIsSearching(false);
      setSubmittedQuery(query);
      setCurrentPage(1);
      const relevantDocs = sortedItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      const displayDocs = relevantDocs.length > 0 ? relevantDocs.slice(0, 3) : sortedItems.slice(0, 3);
      setSearchResult({
        text: t('aiResponseText') as string,
        links: displayDocs
      });
    }, 1500);
  };

  const filteredItems = sortedItems.filter(item => {
    if (!submittedQuery) return true;
    const matchesTitle = item.title.toLowerCase().includes(submittedQuery.toLowerCase());
    const matchesSubtitle = item.subtitle.toLowerCase().includes(submittedQuery.toLowerCase());
    const matchesTag = item.tags.some(t => t.toLowerCase().includes(submittedQuery.toLowerCase()));
    return matchesTitle || matchesSubtitle || matchesTag;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* 1. Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-7xl font-medium tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] leading-[1.1]">
          {t('library')}
        </h1>
        <p className="text-lg md:text-2xl text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed">
          {t('librarySubtitle')}
        </p>
      </div>

      {/* 2. GPT Interactive Input Box */}
      <div className="sticky top-6 z-30 max-w-3xl mx-auto mb-16 animate-fade-in animation-delay-200">
        <div className="bg-navy-900 border border-slate-800/80 rounded-2xl p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
           <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gemini-ultra pointer-events-none">
                {isSearching ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Bot size={20} />}
              </div>
              <Input 
                id="ai-library-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={animatedPlaceholder}
                className="w-full bg-transparent border-none text-base py-3 pl-12 pr-28 rounded-lg focus:ring-0 placeholder:text-slate-500 transition-all font-normal"
                autoComplete="off"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button 
                  type="button" 
                  aria-label="Voice search"
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
                >
                  <Mic size={18} />
                </button>
                <button 
                  type="submit" 
                  aria-label="Submit search"
                  disabled={!query.trim() || isSearching}
                  className="p-3 rounded-lg bg-navy-800 text-slate-300 transition-all enabled:hover:bg-navy-950 enabled:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
           </form>
        </div>

        {/* AI Search Result Card */}
        <div className={`mt-6 transition-all duration-500 ease-out ${searchResult ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none absolute w-full'}`}>
          {searchResult && (
             <div className="glass-panel rounded-2xl p-6 border-gemini-pro/20">
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(161,66,244,0.4)]"
                    style={{
                      background: 'linear-gradient(#000, #000) padding-box, linear-gradient(135deg, #4285F4, #A142F4, #F4B400) border-box',
                      border: '1.5px solid transparent',
                    }}
                  >
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gemini-pro uppercase tracking-wider mb-2">{t('aiResponseTitle')}</h3>
                    <p className="text-slate-300 leading-relaxed font-normal">{searchResult.text}</p>
                  </div>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* 3. Resource Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-12">
          {currentItems.map((item) => (
            <div 
              key={item.slug} 
              onClick={() => navigate(item.type === 'case' ? `/case/${item.slug}` : `/news/${item.slug}`)}
              className="group cursor-pointer flex flex-col gap-5 animate-fade-in"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-800">
                <img 
                  src={item.coverImageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white">
                    <ArrowUpRight size={14} />
                </div>
              </div>

              <div className="flex flex-col gap-3 px-1">
                <div className="flex flex-wrap gap-2">
                   {item.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] font-semibold tracking-wider text-slate-200 border border-white/20 px-2.5 py-1 rounded-full bg-white/5 backdrop-blur-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-medium text-slate-200 group-hover:text-white transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-400 font-normal line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono pt-1">
                  <span>{item.updatedAt}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span>{item.readTime} {t('readTime')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-600">
              <Search size={24} />
            </div>
            <p className="text-lg text-slate-400 font-normal">{t('noResults')}</p>
            {submittedQuery && (
                <button onClick={() => { setQuery(''); setSubmittedQuery(''); setSearchResult(null); }} className="mt-4 text-primary-400 hover:text-white underline text-sm transition-colors">
                    Clear search
                </button>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-20 pb-10">
             <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
                <ChevronLeft size={16} />
                <span className="text-sm font-medium">{t('prevPage')}</span>
             </button>

             <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                      currentPage === page 
                        ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {page}
                  </button>
                ))}
             </div>

             <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
                <span className="text-sm font-medium">{t('nextPage')}</span>
                <ChevronRight size={16} />
             </button>
          </div>
        )}
        
        <section className="max-w-4xl mx-auto mt-32 mb-16 text-center animate-fade-in">
            <div className="relative p-10 md:p-16 rounded-3xl overflow-hidden border border-white/10 bg-navy-900/50">
                <div className="absolute inset-0 bg-glow-radial opacity-20 pointer-events-none" />
                <h2 className="text-3xl md:text-4xl font-medium text-white mb-6 relative z-10">{t('ctaTitle')}</h2>
                <Button onClick={() => navigate('/gate')} variant="gemini" size="lg" className="text-base px-10 relative z-10 font-medium group">
                    {t('btnBookDemo')} <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </section>

      </div>
    </div>
  );
};

export default Library;