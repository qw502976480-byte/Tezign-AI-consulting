import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getData, searchLibrary } from '../data';
import { Button, Input, ContentTag } from '../components/ui';
import { Sparkles, ArrowRight, Bot, Mic, ArrowUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBooking } from '../contexts/BookingContext';
import { LibraryItem } from '../types';

// --- Interactive Blob Background (High-tech Fluid Motion) ---
const InteractiveBlob: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Physics State
    const blob = {
      x: width / 2,
      y: height * 0.85, // Positioned explicitly at the bottom
      vx: 0,
      vy: 0,
      baseRadius: Math.min(width, height) * 0.35, // Size
      points: [] as { angle: number; speed: number; offset: number }[]
    };

    // Initialize morphing points - Adjusted speeds for visible but slow organic breathing
    const numPoints = 12; 
    for (let i = 0; i < numPoints; i++) {
      blob.points.push({
        angle: (i / numPoints) * Math.PI * 2,
        speed: 0.03 + Math.random() * 0.05, // Increased slightly so morphing is visible
        offset: Math.random() * 80
      });
    }

    // Interaction State
    let mouse = { x: width / 2, y: height / 2 };
    let isHovering = false;
    let wanderTarget = { x: Math.random() * width, y: height * 0.8 }; 
    let idleTimer: any;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isHovering = true;
      
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isHovering = false;
        // Bias target to bottom when idle
        wanderTarget = { x: Math.random() * width, y: height * 0.7 + Math.random() * (height * 0.3) };
      }, 3000);
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.008; // Time flows to drive the morphing

      // --- 1. Movement Physics (Spring System) ---
      let targetX, targetY;
      
      if (isHovering) {
        targetX = mouse.x;
        targetY = mouse.y;
      } else {
        // Autonomous wandering logic
        const dx = wanderTarget.x - blob.x;
        const dy = wanderTarget.y - blob.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Retarget very slowly
        if (dist < 50 || Math.random() < 0.002) {
          wanderTarget = { 
            x: Math.random() * width, 
            y: height * 0.6 + Math.random() * (height * 0.4) 
          };
        }
        targetX = wanderTarget.x;
        targetY = wanderTarget.y;
      }

      // Smooth Spring Physics
      // Extremely low spring constant for "heavy" slow movement
      const spring = isHovering ? 0.002 : 0.0005; 
      const friction = 0.95; 

      const ax = (targetX - blob.x) * spring;
      const ay = (targetY - blob.y) * spring;

      blob.vx += ax;
      blob.vy += ay;
      blob.vx *= friction;
      blob.vy *= friction;

      blob.x += blob.vx;
      blob.y += blob.vy;

      // --- 2. Shape Morphing (Organic) ---
      ctx.beginPath();
      
      const currentPoints = blob.points.map((p) => {
        // Sine wave stacking for organic breathing shape
        const variance = Math.sin(time * p.speed + p.angle) * 30 
                       + Math.cos(time * p.speed * 0.5 + p.angle * 2) * 20;
        const r = blob.baseRadius + variance;
        
        // Very slow rotation
        const rot = time * 0.02;
        return {
           x: blob.x + Math.cos(p.angle + rot) * r,
           y: blob.y + Math.sin(p.angle + rot) * r
        };
      });

      // Smooth Bezier Curve connecting points
      const len = currentPoints.length;
      const first = currentPoints[0];
      const last = currentPoints[len - 1];
      const startX = (first.x + last.x) / 2;
      const startY = (first.y + last.y) / 2;

      ctx.moveTo(startX, startY);

      for (let i = 0; i < len; i++) {
        const p1 = currentPoints[i];
        const p2 = currentPoints[(i + 1) % len];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
      }
      
      ctx.closePath();

      // --- 3. Rendering (Gemini Aesthetic) ---
      // Blue/White/Black Gradient
      // Increased Opacity to ensure visibility
      const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.baseRadius * 2);
      
      // Core: Bright White/Blue
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)'); 
      
      // Mid: Gemini Blue
      gradient.addColorStop(0.2, 'rgba(66, 133, 244, 0.3)'); 
      
      // Mid-Outer: Deep Blue
      gradient.addColorStop(0.5, 'rgba(30, 40, 120, 0.1)'); 
      
      // Outer: Transparent
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fill();

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
      style={{ filter: 'blur(60px)' }} // Reduced blur from 100px to 60px to keep edges slightly more defined
    />
  );
};

// --- Interactive Boids Simulation Component (Touch Supported) ---
// (Kept unchanged for brevity, same as previous file)

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { openBooking } = useBooking();
  const data = getData(lang);
  
  // -- AI Search State --
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{slugs: string[]} | null>(null);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');
  
  // -- Latest News State --
  const [activeIndex, setActiveIndex] = useState(0);

  // -- Video Modal State --
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  // -- Data Slicing --
  const allItems = data.all;
  const featuredNews = allItems.slice(0, 6); 
  const carouselItems = featuredNews.slice(0, 3);
  const staticNewsItems = featuredNews.slice(3, 6);

  // -- Handlers --
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    setTimeout(() => {
      setIsSearching(false);
      
      const results = searchLibrary(query);
      const displaySlugs = results.length > 0 ? results.slice(0, 3) : allItems.slice(0, 3).map(i => i.slug);
      
      setSearchResult({
        slugs: displaySlugs
      });
    }, 1500);
  };

  const openVideoModal = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl('');
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

  const searchPrompts = t('searchPrompts') as string[];

  // Typewriter animation
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


  // Carousel Interval
  useEffect(() => {
    if (carouselItems.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);
  
  const activeCarouselItem = carouselItems[activeIndex];

  return (
    <div className="min-h-screen text-slate-200 font-sans">
      {/* Dynamic Background: Interactive Physics Blob */}
      <InteractiveBlob />
      
      {/* Video Modal Player */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeVideoModal}
        >
          <div 
            className="relative w-full max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeVideoModal}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Close video player"
            >
              &times;
            </button>
            <video 
              src={currentVideoUrl} 
              controls 
              autoPlay 
              loop
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-24 px-4 flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-8 animate-fade-in">
        <h1 className="text-4xl md:text-7xl font-medium tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] leading-[1.1]">
          {t('heroTitle')}
        </h1>
        <p className="text-lg md:text-2xl text-slate-400 font-normal max-w-3xl leading-relaxed">
          {t('heroSubtitle')}
        </p>
        
        <div className="flex flex-col items-center pt-8">
          <Button 
            onClick={openBooking} 
            variant="gemini" 
            size="md" 
            className="text-base px-8 py-3 font-medium group"
          >
            {t('btnBookDemo')}
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* 2. Interactive AI Search */}
      <section className="px-4 max-w-3xl mx-auto mb-20 relative z-20">
        <div className="bg-navy-900 border border-slate-800/80 rounded-2xl p-2 shadow-2xl shadow-black/60 transition-all duration-300 focus-within:shadow-gemini-ultra/20 focus-within:border-slate-700 hover:border-slate-700">
           <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gemini-ultra pointer-events-none">
                {isSearching ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Bot size={20} />}
              </div>
              <Input 
                id="ai-search"
                variant="ghost"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={animatedPlaceholder}
                className="w-full bg-transparent border-none text-base py-3 pl-12 pr-28 rounded-lg focus:ring-0 placeholder:text-slate-500 font-normal"
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

        {/* Search Results */}
        <div className={`mt-6 transition-all duration-500 ease-out ${searchResult ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          {searchResult && (
             <div className="glass-panel rounded-2xl p-6 animate-fade-in border-gemini-pro/20">
                <div className="flex items-start gap-4 mb-6">
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
                    <p className="text-slate-300 leading-relaxed font-normal">{t('aiResponseText')}</p>
                  </div>
                </div>
                <div className="grid gap-3 pl-12">
                  {searchResult.slugs.map(slug => {
                    const link = allItems.find(item => item.slug === slug);
                    if (!link) return null;
                    return (
                      <div 
                        key={link.slug} 
                        onClick={() => navigate(`/resource/${link.slug}`)}
                        className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                      >
                         <span className="font-medium text-slate-200 group-hover:text-white truncate pr-2">{link.title}</span>
                         <ArrowRight size={14} className="text-slate-500 group-hover:text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
             </div>
          )}
        </div>
      </section>

      {/* 3. Latest News Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white">{t('latestNews')}</h2>
            <Link to="/library" className="flex items-center gap-2 text-slate-400 hover:text-white font-medium text-sm transition-colors group">
              {t('viewNews')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Auto-rotating Card */}
            {activeCarouselItem && (
              <div 
                key={activeCarouselItem.slug} 
                className="relative h-[400px] lg:h-auto w-full overflow-hidden rounded-2xl group cursor-pointer border border-white/5" 
                onClick={() => navigate(`/resource/${activeCarouselItem.slug}`)}
              >
                <img 
                  src={activeCarouselItem.coverImageUrl} 
                  alt={activeCarouselItem.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
                
                <div className="absolute top-0 left-0 right-0 p-6 flex flex-col items-start z-10 h-full justify-between">
                  <div className="flex flex-wrap gap-2">
                     <ContentTag label={getTypeLabel(activeCarouselItem.type) as string} type="category" />
                     {activeCarouselItem.tags.slice(0, 2).map(tag => (
                       <ContentTag key={tag} label={tag} type="context" />
                     ))}
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-4xl font-medium tracking-tight text-white leading-tight mb-3 pr-4">{activeCarouselItem.title}</h3>
                    
                    <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed mb-5 max-w-sm line-clamp-2">
                      {activeCarouselItem.subtitle}
                    </p>
                    
                    <div className="flex items-center gap-3">
                       <button className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-primary-400 transition-colors group/btn">
                         {t('learnMore')} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Right Column: Static List */}
            <div className="flex flex-col">
              {staticNewsItems.map((item, index) => (
                <div key={item.slug} className={`py-4 ${index > 0 ? 'border-t border-slate-800' : ''}`}>
                   <div className="flex justify-between items-start gap-5 group cursor-pointer" onClick={() => navigate(`/resource/${item.slug}`)}>
                     <div className="flex-grow pt-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                           <ContentTag label={getTypeLabel(item.type) as string} type="category" />
                        </div>
                        <h4 className="text-base font-medium text-slate-200 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">{item.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                          <span>{item.updatedAt}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="font-medium text-slate-400">{item.tags[0]}</span>
                        </div>
                     </div>
                     <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-navy-800 border border-white/5">
                       <img src={item.coverImageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Homepage;