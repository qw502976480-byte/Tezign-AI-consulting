import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getData } from '../data';
import { GlassCard, Button, Badge, Input } from '../components/ui';
import { Sparkles, ArrowRight, Bot, ArrowUpRight, Mic, ArrowUp, Play, Code } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
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
      y: height * 0.8, // Start near bottom
      vx: 0,
      vy: 0,
      baseRadius: Math.min(width, height) * 0.35, // Large ambient size
      points: [] as { angle: number; speed: number; offset: number }[]
    };

    // Initialize morphing points
    const numPoints = 16; // More points for smoother organic shape
    for (let i = 0; i < numPoints; i++) {
      blob.points.push({
        angle: (i / numPoints) * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02, // Slow morphing
        offset: Math.random() * 60
      });
    }

    // Interaction State
    let mouse = { x: width / 2, y: height / 2 };
    let isHovering = false;
    let wanderTarget = { x: Math.random() * width, y: height * 0.5 + Math.random() * (height * 0.5) }; // Bias to bottom half
    let idleTimer: any;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isHovering = true;
      
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isHovering = false;
        // Pick new random target in bottom half when going idle
        wanderTarget = { x: Math.random() * width, y: height * 0.4 + Math.random() * (height * 0.6) };
      }, 2500);
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.005; // Slow time

      // --- 1. Movement Physics (Spring System) ---
      let targetX, targetY;
      
      if (isHovering) {
        targetX = mouse.x;
        targetY = mouse.y;
      } else {
        // Autonomous wandering
        const dx = wanderTarget.x - blob.x;
        const dy = wanderTarget.y - blob.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Change target if close
        if (dist < 200) {
          wanderTarget = { 
            x: Math.random() * width, 
            y: height * 0.4 + Math.random() * (height * 0.6) 
          };
        }
        targetX = wanderTarget.x;
        targetY = wanderTarget.y;
      }

      // Smooth Spring Physics for "Heavy" feel
      const spring = isHovering ? 0.008 : 0.002; // More responsive when interacting
      const friction = 0.94; // Drag

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
        // Perlin-like noise using sine stacking
        const variance = Math.sin(time * p.speed * 4 + p.angle * 2) * 40 
                       + Math.cos(time * p.speed * 2 + p.angle * 3) * 20;
        const r = blob.baseRadius + variance;
        
        // Rotate shape slowly
        const rot = time * 0.2;
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

      // --- 3. Rendering ---
      const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.baseRadius * 1.5);
      gradient.addColorStop(0, 'rgba(66, 133, 244, 0.2)'); // Gemini Blue core
      gradient.addColorStop(0.5, 'rgba(161, 66, 244, 0.1)'); // Purple mid
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fade out

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
      style={{ filter: 'blur(50px)' }} 
    />
  );
};

// --- Interactive Boids Simulation Component (Touch Supported) ---
const BoidCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const boidsRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize boids
    const numBoids = 50;
    const boids = [];
    for (let i = 0; i < numBoids; i++) {
      boids.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
      });
    }
    boidsRef.current = boids;

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    
    // Touch support for mobile interaction
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while interacting with canvas
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
          mouseX = touch.clientX - rect.left;
          mouseY = touch.clientY - rect.top;
      }
    };

    const resetInteraction = () => { mouseX = -1000; mouseY = -1000; };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', resetInteraction);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', resetInteraction);

    const animate = () => {
      if (!canvas) return;
      
      // Handle High DPI displays and resizing
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const width = rect.width;
      const height = rect.height;

      // Draw settings
      ctx.fillStyle = '#1a1a1a'; // Dark color for boids

      for (let boid of boidsRef.current) {
        // --- Boid Logic ---
        let separationX = 0;
        let separationY = 0;
        let alignmentX = 0;
        let alignmentY = 0;
        let cohesionX = 0;
        let cohesionY = 0;
        let numNeighbors = 0;

        // Mouse/Touch Repulsion (Interaction)
        const dxMouse = boid.x - mouseX;
        const dyMouse = boid.y - mouseY;
        const distMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
        if (distMouse < 100) {
            const force = (100 - distMouse) / 100;
            boid.vx += (dxMouse / distMouse) * force * 1.5;
            boid.vy += (dyMouse / distMouse) * force * 1.5;
        }

        // Flocking Rules
        for (let other of boidsRef.current) {
          if (other === boid) continue;
          const dx = boid.x - other.x;
          const dy = boid.y - other.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < 40) {
            // Separation
            separationX += dx / dist;
            separationY += dy / dist;
            
            // Alignment
            alignmentX += other.vx;
            alignmentY += other.vy;

            // Cohesion
            cohesionX += other.x;
            cohesionY += other.y;
            
            numNeighbors++;
          }
        }

        if (numNeighbors > 0) {
           boid.vx += (separationX / numNeighbors) * 0.5;
           boid.vy += (separationY / numNeighbors) * 0.5;
           
           boid.vx += ((alignmentX / numNeighbors) - boid.vx) * 0.05;
           boid.vy += ((alignmentY / numNeighbors) - boid.vy) * 0.05;

           const targetX = cohesionX / numNeighbors;
           const targetY = cohesionY / numNeighbors;
           boid.vx += (targetX - boid.x) * 0.005;
           boid.vy += (targetY - boid.y) * 0.005;
        }

        // Speed Limit
        const speed = Math.sqrt(boid.vx*boid.vx + boid.vy*boid.vy);
        const maxSpeed = 3;
        const minSpeed = 2;
        if (speed > maxSpeed) {
          boid.vx = (boid.vx / speed) * maxSpeed;
          boid.vy = (boid.vy / speed) * maxSpeed;
        } else if (speed < minSpeed) {
           boid.vx = (boid.vx / speed) * minSpeed;
           boid.vy = (boid.vy / speed) * minSpeed; 
        }

        // Move
        boid.x += boid.vx;
        boid.y += boid.vy;

        // Screen Wrap
        if (boid.x < 0) boid.x = width;
        if (boid.x > width) boid.x = 0;
        if (boid.y < 0) boid.y = height;
        if (boid.y > height) boid.y = 0;

        // Draw Triangle
        const angle = Math.atan2(boid.vy, boid.vx);
        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(-3, 3);
        ctx.lineTo(-3, -3);
        ctx.fill();
        ctx.restore();
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', resetInteraction);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', resetInteraction);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const data = getData(lang);
  
  // -- AI Search State --
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{text: string, links: LibraryItem[]} | null>(null);
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
      const relevantDocs = allItems.filter(i => 
        i.title.toLowerCase().includes(query.toLowerCase()) || 
        i.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3);
      const fallbackDocs = allItems.slice(0, 3);
      setSearchResult({
        text: t('aiResponseText') as string,
        links: relevantDocs.length > 0 ? relevantDocs : fallbackDocs
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

  // SVG Paths with Rounded Corners (Folded Effect)
  // Bounding Box: 0 0 176 176
  const hexagonPath = "M88 5L157.3 47.3C159.8 48.7 161.3 51.4 161.3 54.3V121.7C161.3 124.6 159.8 127.3 157.3 128.7L88 171L18.7 128.7C16.2 127.3 14.7 124.6 14.7 121.7V54.3C14.7 51.4 16.2 48.7 18.7 47.3L88 5Z";
  
  // Inverted Triangle Path (Base at top, Point at bottom) for better text alignment
  // Top Left (25, 18), Top Right (151, 18), Bottom Tip (88, 156)
  const trianglePathSafe = "M84 156 L19 26 C17 22 20 18 25 18 H151 C156 18 159 22 157 26 L92 156 C90 160 86 160 84 156 Z";


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
            onClick={() => navigate('/gate')} 
            variant="gemini" 
            size="md" 
            className="text-base px-8 py-3 group flex items-center gap-2.5 font-medium"
          >
            {t('btnBookDemo')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* 2. Interactive AI Search */}
      <section className="px-4 max-w-3xl mx-auto mb-20 relative z-20">
        <div className="bg-navy-900 border border-slate-800/80 rounded-2xl p-2 shadow-2xl shadow-black/60">
           <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gemini-ultra pointer-events-none">
                {isSearching ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Bot size={20} />}
              </div>
              <Input 
                id="ai-search"
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

        {/* Search Results */}
        <div className="mt-6 min-h-[60px] transition-all">
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
                    <p className="text-slate-300 leading-relaxed font-normal">{searchResult.text}</p>
                  </div>
                </div>
                <div className="grid gap-3 pl-12">
                  {searchResult.links.map(link => (
                    <div 
                      key={link.slug} 
                      onClick={() => navigate(link.type === 'case' ? `/case/${link.slug}` : `/news/${link.slug}`)}
                      className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                    >
                       <span className="font-medium text-slate-200 group-hover:text-white truncate">{link.title}</span>
                       <ArrowRight size={14} className="text-slate-500 group-hover:text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                  ))}
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
                onClick={() => navigate(activeCarouselItem.type === 'case' ? `/case/${activeCarouselItem.slug}` : `/news/${activeCarouselItem.slug}`)}
              >
                <img 
                  src={activeCarouselItem.coverImageUrl} 
                  alt={activeCarouselItem.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
                
                <div className="absolute top-0 left-0 right-0 p-6 flex flex-col items-start z-10">
                  <h3 className="text-2xl md:text-4xl font-medium tracking-tight text-white leading-tight mb-3 pr-4">{activeCarouselItem.title}</h3>
                  
                  <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed mb-5 max-w-sm line-clamp-2">
                    {activeCarouselItem.subtitle}
                  </p>
                  
                  <div className="flex items-center gap-3">
                     {activeCarouselItem.tags[0] && (
                       <button className="px-4 py-1.5 rounded-full border border-white/30 text-white text-[10px] font-semibold tracking-wider hover:bg-white/10 hover:border-white transition-all backdrop-blur-md">
                         {activeCarouselItem.tags[0]}
                       </button>
                     )}

                     <button className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-primary-400 transition-colors group/btn">
                       {t('learnMore')} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Right Column: Static List */}
            <div className="flex flex-col">
              {staticNewsItems.map((item, index) => (
                <div key={item.slug} className={`py-4 ${index > 0 ? 'border-t border-slate-800' : ''}`}>
                   <div className="flex justify-between items-start gap-5 group cursor-pointer" onClick={() => navigate(item.type === 'case' ? `/case/${item.slug}` : `/news/${item.slug}`)}>
                     <div className="flex-grow pt-1">
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

      {/* 4. Capabilities Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-medium text-white mb-16 tracking-tight">{t('capabilitiesTitle')}</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Shared Gradient Defs */}
          <svg className="absolute w-0 h-0" aria-hidden="true">
            <defs>
              <linearGradient id="geminiShapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4285F4" />
                <stop offset="50%" stopColor="#A142F4" />
                <stop offset="100%" stopColor="#F4B400" />
              </linearGradient>
            </defs>
          </svg>

          {/* Diagnose: Hexagon (SVG) */}
          <div className="flex flex-col items-center group">
            <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
              {/* Back Glow */}
              <div className="absolute inset-0 bg-gemini-ultra/20 blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
              
              {/* SVG Shape */}
              <svg width="176" height="176" viewBox="0 0 176 176" fill="none" className="relative z-10 w-full h-full">
                <path 
                  d={hexagonPath} 
                  stroke="url(#geminiShapeGrad)" 
                  strokeWidth="1.5" 
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_10px_rgba(66,133,244,0.3)]"
                  fill="rgba(5,5,5,0.8)"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white tracking-wide mb-3">{t('diagnoseTitle')}</h3>
            <p className="text-slate-400 max-w-xs font-normal">{t('diagnoseDesc')}</p>
          </div>

          {/* Design: Triangle (SVG) */}
          <div className="flex flex-col items-center group">
            <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
              {/* Back Glow */}
              <div className="absolute inset-0 bg-gemini-pro/20 blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
              
              {/* SVG Shape */}
              <svg width="176" height="176" viewBox="0 0 176 176" fill="none" className="relative z-10 w-full h-full">
                <path 
                  d={trianglePathSafe} 
                  stroke="url(#geminiShapeGrad)" 
                  strokeWidth="1.5" 
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_10px_rgba(161,66,244,0.3)]"
                  fill="rgba(5,5,5,0.8)"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white tracking-wide mb-3">{t('designTitle')}</h3>
            <p className="text-slate-400 max-w-xs font-normal">{t('designDesc')}</p>
          </div>

          {/* Operate: Circle (SVG) */}
          <div className="flex flex-col items-center group">
            <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
              {/* Back Glow */}
              <div className="absolute inset-0 bg-gemini-nano/20 blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
              
              {/* SVG Shape */}
              <svg width="176" height="176" viewBox="0 0 176 176" fill="none" className="relative z-10 w-full h-full">
                <circle 
                  cx="88" 
                  cy="88" 
                  r="78" 
                  stroke="url(#geminiShapeGrad)" 
                  strokeWidth="1.5" 
                  className="drop-shadow-[0_0_10px_rgba(244,180,0,0.3)]"
                  fill="rgba(5,5,5,0.8)"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white tracking-wide mb-3">{t('operateTitle')}</h3>
            <p className="text-slate-400 max-w-xs font-normal">{t('operateDesc')}</p>
          </div>

        </div>
      </section>

      {/* 5. Multimodal Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-6">{t('multimodalTitle')}</h2>
          <p className="text-lg md:text-xl text-slate-400 font-normal max-w-2xl mx-auto">{t('codeGenTitle')}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 max-w-5xl mx-auto relative">
          
          {/* Left Card: Business Problem */}
          <div className="relative w-full max-w-[320px] h-[580px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" 
              alt="Office Chaos" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[2px] scale-110 transition-transform duration-700 group-hover:scale-125" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
            
            <div className="absolute bottom-10 left-6 right-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg animate-fade-in">
                <p className="text-white text-lg font-normal leading-snug tracking-wide">
                  {lang === 'cn' 
                    ? "我们的内容生产流程太慢且不统一。如何用 AI 将其重构为可扩展的系统？" 
                    : "Our content production is slow and inconsistent. How can we redesign this workflow with AI?"}
                </p>
              </div>
            </div>
          </div>

          {/* Transition Arrow */}
          <div className="text-slate-500 md:rotate-0 rotate-90 flex-shrink-0">
            <ArrowRight size={32} strokeWidth={1.5} />
          </div>

          {/* Right Card: AI Way of Working */}
          <div className="relative w-full max-w-[320px] h-[580px] rounded-[2.5rem] bg-[#050505] border border-slate-800 shadow-2xl flex flex-col p-6 overflow-hidden">
              <div className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] bg-gemini-ultra/20 blur-[80px] pointer-events-none" />

              <div className="mb-6 relative z-10">
                <p className="text-white text-lg font-normal leading-snug">
                  {lang === 'cn'
                    ? "我设计了一个 Agent 编排系统。多个智能体现在协同处理研究、起草与合规检查。"
                    : "I architected an Agent Orchestration system. Multiple agents now collaborate on research, drafting, and compliance."}
                </p>
              </div>

              <div className="relative w-full h-40 bg-[#a8c7fa] rounded-2xl mb-4 overflow-hidden border border-white/5 flex-shrink-0 group">
                 {/* Interactive Boids Area */}
                 <BoidCanvas />
                 <div className="absolute bottom-2 right-2 bg-black/20 backdrop-blur-md px-2 py-1 rounded text-[10px] text-black font-mono font-bold uppercase pointer-events-none">
                    Running...
                 </div>
              </div>

              <div className="flex-grow bg-[#141414] rounded-2xl p-4 border border-white/5 relative overflow-hidden font-mono text-xs leading-relaxed text-slate-400">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gemini-ultra via-gemini-pro to-transparent opacity-50" />
                 <div className="overflow-y-auto h-full scrollbar-none">
                    <p><span className="text-purple-400">const</span> <span className="text-blue-300">workflow</span> = <span className="text-purple-400">new</span> <span className="text-yellow-200">Orchestrator</span>({'{'}</p>
                    <p className="pl-4">objective: <span className="text-green-400">'Content_Supply_Chain'</span>,</p>
                    <p className="pl-4">agents: [</p>
                    <p className="pl-8"><span className="text-purple-400">new</span> <span className="text-yellow-200">Agent</span>(<span className="text-green-400">'Research'</span>),</p>
                    <p className="pl-8"><span className="text-purple-400">new</span> <span className="text-yellow-200">Agent</span>(<span className="text-green-400">'Drafting'</span>),</p>
                    <p className="pl-8"><span className="text-purple-400">new</span> <span className="text-yellow-200">Agent</span>(<span className="text-green-400">'Compliance'</span>)</p>
                    <p className="pl-4">],</p>
                 </div>
              </div>
          </div>

        </div>
      </section>

      {/* 8. CTA */}
      <section className="max-w-4xl mx-auto px-4 mb-32 text-center">
         <div className="relative p-12 md:p-20 rounded-3xl overflow-hidden border border-white/10 bg-navy-900/50">
           <div className="absolute inset-0 bg-glow-radial opacity-30 pointer-events-none" />
           <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 relative z-10">{t('ctaTitle')}</h2>
           <Button onClick={() => navigate('/gate')} variant="gemini" size="lg" className="text-lg px-12 relative z-10 font-medium">
             {t('ctaButton')}
           </Button>
         </div>
      </section>

    </div>
  );
};

export default Homepage;