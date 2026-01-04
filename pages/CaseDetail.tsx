import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { getData } from '../data';
import { ContentBlock } from '../types';
import { Badge, Button, GlassCard, Tag } from '../components/ui';
import { Play, Pause, FileText, Share2, ArrowLeft, ArrowRight, Download, Bookmark } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const ContentRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'h2':
      return <h2 className="text-2xl md:text-3xl font-bold text-white mt-16 mb-8 tracking-tight">{block.content}</h2>;
    case 'h3':
      return <h3 className="text-xl font-semibold text-white mt-10 mb-4">{block.content}</h3>;
    case 'p':
      return <p className="text-lg text-slate-300 leading-relaxed mb-8 font-light tracking-wide">{block.content}</p>;
    case 'quote':
      return (
        <div className="my-12 relative group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gemini-ultra to-gemini-pro group-hover:w-1.5 transition-all duration-300" />
          <div className="pl-8 py-2">
            <p className="text-2xl font-light italic text-white mb-4 leading-normal">"{block.content}"</p>
            {block.author && <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">— {block.author}</p>}
          </div>
        </div>
      );
    case 'image':
      return (
        <figure className="my-12 w-full group">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
             <img src={block.src} alt={block.alt} className="w-full transform group-hover:scale-105 transition-transform duration-700 ease-out" />
             <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
          </div>
          {block.caption && <figcaption className="mt-4 text-center text-xs text-slate-500 font-mono">{block.caption}</figcaption>}
        </figure>
      );
    case 'metrics':
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-12">
          {block.items.map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-2">
                {item.value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</div>
              {item.sub && <div className="text-[10px] text-slate-500 font-mono mt-1">{item.sub}</div>}
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const AudioPlayer: React.FC<{ label: string }> = ({ label }) => {
  const [playing, setPlaying] = useState(false);
  
  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full p-2 pr-6 w-fit mb-10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group" onClick={() => setPlaying(!playing)}>
      <button 
        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-105 transition-transform"
      >
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>
      <div className="flex flex-col gap-1 min-w-[140px]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">{label}</span>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full">
          <div className={`h-full bg-gradient-to-r from-gemini-ultra via-gemini-pro to-gemini-nano w-1/3 ${playing ? 'animate-pulse' : ''}`} />
        </div>
      </div>
      <span className="text-[10px] text-slate-500 font-mono">03:45</span>
    </div>
  );
};

const CaseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const data = getData(lang);
  const caseItem = data.cases.find(c => c.slug === slug);

  if (!isAuthenticated) {
    return <Navigate to={`/gate?redirect=/case/${slug}`} replace />;
  }

  if (!caseItem) {
    return <div className="text-center py-20 text-white">Case not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <button onClick={() => navigate('/library')} className="group flex items-center text-slate-500 hover:text-white mb-12 text-xs font-bold uppercase tracking-widest transition-colors">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> {t('back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
        {/* Main Content (8 cols) */}
        <div className="lg:col-span-8 animate-fade-in">
          {/* Header */}
          <div className="mb-10 space-y-6">
            <div className="flex flex-wrap gap-2">
              {caseItem.tags.map(tag => (
                <Badge key={tag} className="bg-gemini-ultra/10 text-gemini-ultra border-gemini-ultra/20">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-tight">{caseItem.title}</h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl">{caseItem.subtitle}</p>
            
            <div className="flex items-center gap-6 text-xs text-slate-500 border-t border-white/10 pt-6 font-mono uppercase tracking-wide">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> {caseItem.readTime} {t('readTime')}</span>
              <span>{t('updated')} {caseItem.updatedAt}</span>
            </div>
          </div>

          <AudioPlayer label={t('listen')} />

          {/* Article Body */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white">
            {caseItem.contentBlocks.map((block, idx) => (
              <ContentRenderer key={idx} block={block} />
            ))}
          </div>
        </div>

        {/* Sidebar (4 cols) - Optimized for less whitespace */}
        <div className="lg:col-span-4 space-y-6 animate-fade-in animation-delay-200">
          <div className="sticky top-24 space-y-4">
            
            {/* Card 1: Context & Metadata */}
            <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5 backdrop-blur-xl">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">{t('clientProfile')}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">{caseItem.clientIntro}</p>
              
              <div className="w-full h-px bg-white/5 mb-4" />

              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">{t('scenario')}</h3>
              <div className="flex flex-wrap gap-2">
                {caseItem.tags.map(tag => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>
            </div>

            {/* Card 2: Actions */}
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-5 backdrop-blur-xl space-y-3">
                 <Button variant="gemini" className="w-full text-sm font-semibold h-10 group">
                   <Download size={16} className="mr-2 group-hover:scale-110 transition-transform" /> {t('download')}
                 </Button>
                 <div className="grid grid-cols-2 gap-3">
                   <button className="h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 text-sm gap-2 transition-all font-medium">
                     <Share2 size={16} /> {t('share')}
                   </button>
                   <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`h-10 rounded-full flex items-center justify-center text-sm gap-2 transition-all font-medium border ${isBookmarked ? 'bg-white text-black border-white' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent hover:border-white/5'}`}
                   >
                     <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} /> {isBookmarked ? t('bookmarked') : t('bookmark')}
                   </button>
                 </div>
            </div>

            {/* Card 3: Booking CTA */}
            <div className="bg-gradient-to-br from-gemini-ultra/20 to-purple-900/20 border border-white/10 rounded-xl p-5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gemini-ultra/20 rounded-full blur-[40px] -z-10 group-hover:bg-gemini-ultra/30 transition-colors" />
                <h3 className="text-white font-bold text-sm mb-4 leading-relaxed relative z-10">{t('ctaTitle')}</h3>
                <Button onClick={() => navigate('/gate')} variant="gemini" className="w-full text-xs font-bold h-9 group">
                    {t('btnBookDemo')} <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Recommended Section - Moved to bottom full width */}
      <div className="pt-12 border-t border-white/10 animate-fade-in">
        <h3 className="text-lg font-bold text-white mb-8 tracking-wide uppercase">{t('recommended')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.cases.filter(c => c.slug !== slug).slice(0, 3).map(c => (
            <GlassCard key={c.slug} className="group cursor-pointer border-white/5 hover:border-white/10 transition-all duration-300" hoverEffect={true} noPadding={true}>
               <div onClick={() => navigate(`/case/${c.slug}`)} className="flex items-center p-4 gap-4">
                 <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-navy-800">
                   <img src={c.coverImageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white text-sm mb-1 group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">{c.title}</h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{t('cases')}</span>
                 </div>
               </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;