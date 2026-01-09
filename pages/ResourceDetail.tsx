import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { getData } from '../data';
import { ContentBlock, LibraryItem } from '../types';
import { Button, ContentTag } from '../components/ui';
import { Play, Pause, Share2, ArrowLeft, ArrowRight, Bookmark, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';

// --- Audio Decoding Helpers ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


// --- Shared Components ---

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

// --- Main Component ---

const ResourceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { isAuthenticated, user, toggleBookmark } = useAuth();
  const { openBooking } = useBooking();
  
  const data = getData(lang);
  // Search for the item in all collections
  const item = data.all.find(i => i.slug === slug);
  const isBookmarked = user?.bookmarks?.includes(slug || '');

  // Audio state
  const [audioState, setAudioState] = useState<'idle' | 'generating' | 'playing'>('idle');
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Determine item type characteristics
  const isCase = item?.type === 'case';

  useEffect(() => {
    window.scrollTo(0, 0);
    // Reset audio state when slug or language changes
    if (audioSourceRef.current) audioSourceRef.current.stop();
    if (audioContextRef.current) audioContextRef.current.close();
    setAudioState('idle');
    setAudioBuffer(null);
    audioContextRef.current = null;
    audioSourceRef.current = null;
  }, [slug, lang]);

  const handleAudioAction = async () => {
    if (audioState === 'generating' || !item || !item.audioData) return;

    if (audioState === 'playing') {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
      }
      setAudioState('idle');
      return;
    }

    // Initialize AudioContext on first play
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      } else {
        console.error("Web Audio API is not supported.");
        return;
      }
    }
    
    const play = (buffer: AudioBuffer) => {
      const audioContext = audioContextRef.current;
      if (!audioContext) return;
      
      if (audioSourceRef.current) {
        audioSourceRef.current.disconnect();
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);

      source.onended = () => {
        setAudioState('idle');
        audioSourceRef.current = null;
      };

      audioSourceRef.current = source;
      setAudioState('playing');
    };

    // If audio is already decoded in component state, just play it
    if (audioBuffer) {
      play(audioBuffer);
      return;
    }

    // Get pre-generated base64 audio data from the item based on current language
    const base64Audio = item.audioData[lang];
    if (!base64Audio || !audioContextRef.current) {
        console.error("Pre-generated audio data not found for this resource and language.");
        return;
    }

    setAudioState('generating'); // Use this state for 'decoding'
    try {
      const decodedBytes = decode(base64Audio);
      const buffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
      
      setAudioBuffer(buffer); // Cache decoded buffer in component state for re-plays
      play(buffer);

    } catch (error) {
      console.error("Error decoding pre-generated audio:", error);
      setAudioState('idle');
    }
  };

  if (!isAuthenticated) {
    const path = window.location.hash.slice(1); // Get current path from hash router
    return <Navigate to={`/gate?redirect=${path}`} replace />;
  }

  if (!item) {
    return <div className="text-center py-20 text-white">Resource not found</div>;
  }

  // Recommendation Logic
  const recommendedItems = isCase 
    ? data.cases.filter(c => c.slug !== slug).slice(0, 3)
    : [...data.reports, ...data.methodologies].filter(n => n.slug !== slug).slice(0, 3);

  // Helper to format type label
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'case': return t('typeCase');
      case 'report': return t('typeReport');
      case 'methodology': return t('typeMethod');
      case 'announcement': return t('typeAnnounce');
      default: return 'Resource';
    }
  };

  const getAudioStatusText = () => {
    switch(audioState) {
      case 'generating': return t('audioStatusLoading');
      case 'playing': return t('audioStatusPlaying');
      default: return t('audioStatusDefault');
    }
  };

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
               <ContentTag label={getTypeLabel(item.type) as string} type="category" />
               {item.tags.slice(0, 2).map(tag => (
                   <ContentTag key={tag} label={tag} type="context" />
               ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-tight">{item.title}</h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl">{item.subtitle}</p>
            
            <div className="flex items-center gap-6 text-xs text-slate-500 border-t border-white/10 pt-6 font-mono uppercase tracking-wide">
              <span className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  {item.readTime} {t('readTime')}
              </span>
              <span>{t('updated')} {item.updatedAt}</span>
            </div>
          </div>

          {/* Audio Player */}
          <div 
            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full p-2 pr-6 w-fit mb-10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group" 
            onClick={handleAudioAction}
            aria-label="Listen to article summary"
            role="button"
            tabIndex={0}
          >
            <button 
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-105 transition-transform"
              disabled={audioState === 'generating'}
            >
              {audioState === 'generating' && <Loader2 size={18} className="animate-spin" />}
              {audioState === 'playing' && <Pause size={18} fill="currentColor" />}
              {audioState === 'idle' && <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">{t('listen')}</span>
              <span className="text-xs text-slate-500 font-mono mt-0.5">
                  {getAudioStatusText()}
              </span>
            </div>
          </div>


          {/* Article Body */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white">
            {item.contentBlocks.map((block, idx) => (
              <ContentRenderer key={idx} block={block} />
            ))}
          </div>
        </div>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6 animate-fade-in animation-delay-200">
          <div className="sticky top-24 space-y-4">
            
            {/* Unified Context / Metadata Card */}
            <div className="bg-navy-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
              {/* Show Client Intro if available (Cases) */}
              {item.clientIntro && (
                  <>
                    <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">{t('clientProfile')}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">{item.clientIntro}</p>
                    <div className="w-full h-px bg-white/5 mb-4" />
                  </>
              )}

              {/* Show Category for everyone */}
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">{t('scenario')}</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                    <ContentTag key={tag} label={tag} type="context" />
                ))}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">
                 <div className="grid grid-cols-2 gap-3">
                   <button className="h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 text-sm gap-2 transition-all font-medium">
                     <Share2 size={16} /> {t('share')}
                   </button>
                   <button 
                    onClick={() => toggleBookmark(slug || '')}
                    className={`h-10 rounded-full flex items-center justify-center text-sm gap-2 transition-all font-medium border ${isBookmarked ? 'bg-white text-black border-white' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent hover:border-white/5'}`}
                   >
                     <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} /> {isBookmarked ? t('bookmarked') : t('bookmark')}
                   </button>
                 </div>
            </div>

            {/* Unified Booking CTA Card */}
            <div className="bg-gradient-to-br from-gemini-ultra/10 to-purple-900/20 border border-white/10 rounded-xl p-6 backdrop-blur-xl relative overflow-hidden group">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gemini-ultra/20 rounded-full blur-[50px] -z-10 group-hover:bg-gemini-ultra/30 transition-colors" />
                
                <h3 className="text-white font-bold text-base mb-2 leading-tight relative z-10">
                    {t('ctaTitle')}
                </h3>
                <p className="text-xs text-slate-400 mb-6 relative z-10 leading-relaxed">
                    Unlock the full potential of your team with our AI-native methodologies.
                </p>
                <Button onClick={openBooking} variant="gemini" className="w-full text-xs font-bold h-10 group shadow-lg shadow-black/20">
                    {t('btnBookDemo')} <ArrowRight size={14} className="ml-1" />
                </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="pt-12 border-t border-white/10 animate-fade-in">
        <h3 className="text-lg font-bold text-white mb-8 tracking-wide uppercase">{t('recommended')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedItems.map(c => (
            <div 
              key={c.slug} 
              className="group cursor-pointer bg-navy-900/90 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300"
              onClick={() => {
                navigate(`/resource/${c.slug}`);
              }}
            >
               <div className="flex items-center p-4 gap-4">
                 <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-navy-800 border border-white/5">
                   <img src={c.coverImageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white text-sm mb-1 group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">{c.title}</h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{getTypeLabel(c.type)}</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;