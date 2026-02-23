// HPI 1.5-V
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
{/* ... keep existing code (Image import removed) */}
import { BaseCrudService } from '@/integrations';
import { ContentSubmissions } from '@/entities';
import { ArrowRight, Clock, Eye, ShieldAlert, Zap, Globe, Lock, Maximize2, Minimize2 } from 'lucide-react';
import { Image } from '@/components/ui/image';

// --- Utility Components for Motion & Layout ---

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ... keep existing code (ParallaxImage component removed)

const RevealText: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
};

// --- Main Component ---

export default function HomePage() {
  const navigate = useNavigate();
  const [currentContent, setCurrentContent] = useState<ContentSubmissions | null>(null);
  const [recentContent, setRecentContent] = useState<ContentSubmissions[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeVisitors, setActiveVisitors] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // --- Data Fidelity Protocol: Preservation of Logic ---
  useEffect(() => {
    loadCurrentContent();
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Remove current content and load next
          if (currentContent) {
            BaseCrudService.delete('contentsubmissions', currentContent._id);
          }
          loadCurrentContent();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentContent]);

  // --- Real-time Visitor Counter ---
  useEffect(() => {
    // Generate random initial visitor count between 15 and 150
    setActiveVisitors(Math.floor(Math.random() * 135) + 15);

    // Simulate visitor count changes every 3-8 seconds
    const visitorInterval = setInterval(() => {
      setActiveVisitors((prev) => {
        const change = Math.floor(Math.random() * 7) - 2; // -2 to +4
        const newCount = Math.max(5, prev + change); // Minimum 5 visitors
        return newCount;
      });
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(visitorInterval);
  }, []);

  const loadCurrentContent = async () => {
    const { items } = await BaseCrudService.getAll<ContentSubmissions>('contentsubmissions');
    
    // Sort by submission date (oldest first for queue)
    const sortByDate = (a: ContentSubmissions, b: ContentSubmissions) => {
      const dateA = new Date(a.submissionDate || 0).getTime();
      const dateB = new Date(b.submissionDate || 0).getTime();
      return dateA - dateB;
    };
    
    items.sort(sortByDate);
    
    if (items.length > 0) {
      const nextContent = items[0];
      if (nextContent) {
        setCurrentContent(nextContent);
      }
      setRecentContent(items.slice(0, 4)); 
    } else {
      setCurrentContent(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = async () => {
    if (!stageRef.current) return;
    
    try {
      if (!isFullscreen) {
        if (stageRef.current.requestFullscreen) {
          await stageRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-soft-white selection:bg-primary selection:text-white overflow-x-clip">
      {/* Global Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left" style={{ scaleX }} />
      <Header />
      <main className="relative">
        {/* --- HERO SECTION: The Stage --- */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
          {/* Dynamic Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://static.wixstatic.com/media/5ad9e7_300b9cdea7c545e3ab2860a137a85b6c~mv2.png?originWidth=1152&originHeight=768')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          </div>

          <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
            
            {/* Left Column: The Timer & Manifesto */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-12">
              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-3 text-primary font-paragraph tracking-widest uppercase text-sm"
                >
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Live Broadcast
                </motion.div>
                
                <div className="relative">
                  <h1 className="font-heading text-[12rem] leading-[0.8] text-soft-white mix-blend-difference tracking-tighter">
                    {formatTime(timeRemaining)}
                  </h1>

                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => navigate('/purchase')}
                  className="bg-primary hover:bg-primary/90 text-white font-paragraph text-lg px-10 py-8 rounded-none border-l-4 border-white/20 transition-all hover:border-white"
                >{"Comprar - $3"}</Button>

                {/* Real-time Visitor Counter */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-center gap-2 text-soft-white/80 font-paragraph text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span>{activeVisitors} personas conectadas</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Column: The Content Stage */}
            <div className="lg:col-span-7 relative h-[60vh] lg:h-[80vh] w-full rounded-none my-[50px] mx-0 mt-[50px] mr-0 mb-[99px] ml-0 p-0">
              <div 
                ref={stageRef}
                className="absolute inset-0 bg-soft-white/5 backdrop-blur-sm overflow-hidden group cursor-pointer hover:border-soft-white/30 transition-colors border border-solid border-[#f0f0f01a] py-[7px] px-0 mt-0 mr-0 mb-0.5 ml-0 flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  {!currentContent ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col items-center text-center p-12 justify-center"
                    >
                      <h3 className="font-heading text-5xl text-soft-white/40">El escenario está vacío</h3>
                      <p className="font-paragraph text-lg text-soft-white/30 mt-4">Sube tu contenido para que aparezca aquí</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={currentContent._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {currentContent.contentType === 'image' ? (
                        <Image src={currentContent.submittedContent || ''} alt="Submitted content" className="w-full h-full object-contain" />
                      ) : (
                        <video
                          src={currentContent.submittedContent}
                          controls
                          className="w-full h-full object-contain opacity-[0.97]"
                          autoPlay
                          muted
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Stage UI Elements */}
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded hover:bg-soft-white/10 transition-colors"
                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5 text-soft-white" />
                    ) : (
                      <Maximize2 className="w-5 h-5 text-soft-white" />
                    )}
                  </button>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 border-l border-b border-primary/30" />

            </div>
          </div>
        </section>
        {/* --- MARQUEE SECTION --- */}
        {/* --- MANIFESTO SECTION --- */}
        <div className="w-full bg-soft-white text-background py-4 overflow-hidden border-y border-primary mt-24">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="flex whitespace-nowrap font-heading text-4xl md:text-5xl uppercase tracking-tighter items-center"
          >
            {Array(10).fill("").map((_, i) => (
              <React.Fragment key={i}>
                <span className="mx-8">1 Minuto</span>
                <span className="mx-8 text-primary">●</span>
                <span className="mx-8">Ephemeral</span>
                <span className="mx-8 text-primary">●</span>
                <span className="mx-8">Uncensored Art</span>
                <span className="mx-8 text-primary">●</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* --- RECENT HISTORY (Data Driven) --- */}
        {/* --- ATMOSPHERIC BREAK --- */}
        {/* --- CTA & LEGAL --- */}
      </main>
      <Footer />
      {/* Custom Styles for specific effects */}
      <style>{`
        .font-heading { font-family: 'Cormorant Garamond', serif; }
        .font-paragraph { font-family: 'Sora', sans-serif; }
        ::selection { background-color: #8B0000; color: white; }
      `}</style>
    </div>
  );
}
