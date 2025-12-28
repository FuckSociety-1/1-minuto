// HPI 1.5-V
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { ContentSubmissions } from '@/entities';
import { ArrowRight, Clock, Eye, ShieldAlert, Zap, Globe, Lock } from 'lucide-react';

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

const ParallaxImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%]">
        <Image src={src} alt={alt} width={1200} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  );
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // --- Data Fidelity Protocol: Preservation of Logic ---
  useEffect(() => {
    loadCurrentContent();
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          loadCurrentContent();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadCurrentContent = async () => {
    const { items } = await BaseCrudService.getAll<ContentSubmissions>('contentsubmissions');
    const approvedContent = items.filter(item => item.reviewStatus === 'approved');
    
    // Preserve original random selection logic
    if (approvedContent.length > 0) {
      const randomContent = approvedContent[Math.floor(Math.random() * approvedContent.length)];
      setCurrentContent(randomContent);
      // Utilize data for new section: Recent History
      setRecentContent(approvedContent.slice(0, 4)); 
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
                  <p className="font-paragraph text-xl text-soft-white/60 mt-4 max-w-md">
                    Sixty seconds of absolute visibility. <br/>
                    One image. One world. One minute.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button
                  onClick={() => navigate('/purchase')}
                  className="bg-primary hover:bg-primary/90 text-white font-paragraph text-lg px-10 py-8 rounded-none border-l-4 border-white/20 transition-all hover:border-white"
                >{"Comprar - $3"}</Button>
                <div className="flex items-center gap-4 text-soft-white/40 font-paragraph text-sm">
                  <Eye className="w-5 h-5" />
                  <span>Visto por todos los visitantes ahora</span>
                </div>
              </div>
            </div>

            {/* Right Column: The Content Stage */}
            <div className="lg:col-span-7 relative h-[60vh] lg:h-[80vh] w-full">
              <div className="absolute inset-0 border border-soft-white/10 bg-soft-white/5 backdrop-blur-sm overflow-hidden">
                <AnimatePresence mode="wait">
                  {currentContent?.submittedContent ? (
                    <motion.div
                      key={currentContent._id}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5 }}
                      className="w-full h-full"
                    >
                      <Image 
                        src={currentContent.submittedContent} 
                        alt="Contenido actual en vivo"
                        width={1600}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center text-center p-12"
                    >
                      <div className="w-24 h-24 border border-soft-white/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <div className="w-2 h-2 bg-soft-white rounded-full" />
                      </div>
                      <h3 className="font-heading text-4xl text-soft-white/40 mb-2">El escenario está vacío</h3>
                      <p className="font-paragraph text-soft-white/30">Sé el primero en reclamar este minuto.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Stage UI Elements */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <div className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-xs font-paragraph uppercase tracking-wider text-white/70">
                    Live Feed
                  </div>
                  <div className="px-3 py-1 bg-primary/80 backdrop-blur-md text-xs font-paragraph uppercase tracking-wider text-white">
                    Global
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 border-l border-b border-primary/30" />
              <div className="absolute -top-6 -right-6 w-24 h-24 border-r border-t border-primary/30" />
            </div>
          </div>
        </section>

        {/* --- MARQUEE SECTION --- */}
        <div className="w-full bg-soft-white text-background py-4 overflow-hidden border-y border-primary">
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

        {/* --- MANIFESTO SECTION --- */}
        <section className="py-32 px-6 md:px-12 max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
            <div className="sticky top-32">
              <FadeIn>
                <h2 className="font-heading text-6xl md:text-8xl text-soft-white leading-[0.9] mb-8">
                  The Rules <br/>
                  <span className="text-primary italic">of the Void.</span>
                </h2>
                <p className="font-paragraph text-xl text-soft-white/60 max-w-md leading-relaxed">
                  En un mundo de permanencia digital, ofrecemos lo contrario. 
                  Un espacio donde el contenido vive, respira y muere en 60 segundos.
                </p>
              </FadeIn>
            </div>

            <div className="space-y-24 pt-12">
              {[
                {
                  icon: Clock,
                  title: "Temporalidad Absoluta",
                  desc: "Tu imagen o video se muestra durante exactamente 60 segundos. Ni uno más. Después, desaparece en el éter digital para siempre."
                },
                {
                  icon: Globe,
                  title: "Audiencia Global",
                  desc: "Durante tu minuto, eres el dueño exclusivo de la pantalla principal. Cada visitante, en cualquier parte del mundo, ve lo que tú decides mostrar."
                },
                {
                  icon: Lock,
                  title: "Exclusividad +18",
                  desc: "Este es un espacio adulto. Requerimos madurez y responsabilidad. Cero tolerancia con contenido ilegal. Nosotros ponemos el escenario, tú pones los límites."
                }
              ].map((item, idx) => (
                <FadeIn key={idx} delay={idx * 0.2} className="group">
                  <div className="flex items-start gap-6 border-t border-soft-white/10 pt-8 transition-colors hover:border-primary/50">
                    <div className="p-4 bg-soft-white/5 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      <item.icon size={32} strokeWidth={1} />
                    </div>
                    <div>
                      <h3 className="font-heading text-4xl text-soft-white mb-4 group-hover:translate-x-2 transition-transform duration-500">
                        {item.title}
                      </h3>
                      <p className="font-paragraph text-lg text-soft-white/50 leading-relaxed max-w-lg">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* --- RECENT HISTORY (Data Driven) --- */}
        <section className="py-32 bg-soft-white/5 border-y border-soft-white/5">
          <div className="max-w-[120rem] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <h2 className="font-heading text-5xl md:text-6xl text-soft-white mb-4">
                  Ecos Recientes
                </h2>
                <p className="font-paragraph text-soft-white/50">
                  Momentos que ya han pasado a la historia.
                </p>
              </div>
              <Button variant="outline" className="border-soft-white/20 text-soft-white hover:bg-soft-white hover:text-background rounded-none px-8">
                Ver Archivo Completo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
              {recentContent.length > 0 ? (
                recentContent.map((item, idx) => (
                  <FadeIn key={item._id || idx} delay={idx * 0.1} className="aspect-[4/5] relative group overflow-hidden bg-black">
                    {item.submittedContent && (
                      <Image 
                        src={item.submittedContent} 
                        alt="Recent submission" 
                        width={600}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      <span className="font-heading text-2xl text-white">Minuto #{idx + 420}</span>
                      <span className="font-paragraph text-xs text-white/60 uppercase tracking-widest">Expirado</span>
                    </div>
                  </FadeIn>
                ))
              ) : (
                // Fallback placeholders if no data yet
                ([1, 2, 3, 4].map((_, idx) => (
                  <FadeIn key={idx} delay={idx * 0.1} className="aspect-[4/5] relative group overflow-hidden bg-black border border-soft-white/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-soft-white/5 animate-pulse" />
                      <span className="absolute font-heading text-soft-white/20 text-4xl">?</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-6 border-t border-soft-white/10 bg-black/50 backdrop-blur-sm">
                      <p className="font-paragraph text-xs text-soft-white/40 uppercase">Espacio Disponible</p>
                    </div>
                  </FadeIn>
                )))
              )}
            </div>
          </div>
        </section>

        {/* --- ATMOSPHERIC BREAK --- */}
        <section className="h-[80vh] flex items-center justify-center relative overflow-hidden">
          <ParallaxImage 
            src="https://static.wixstatic.com/media/5ad9e7_09e73ccca17c425682dadf2590a0fefb~mv2.png?originWidth=1152&originHeight=960" 
            alt="Atmosphere" 
            className="absolute inset-0 w-full h-full opacity-40"
          />
          <div className="relative z-10 text-center max-w-4xl px-6">
            <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl text-soft-white leading-tight mix-blend-overlay">
              "El tiempo es la única moneda <br/> que realmente posees."
            </h2>
          </div>
        </section>

        {/* --- CTA & LEGAL --- */}
        <section className="py-32 px-6 md:px-12 max-w-[100rem] mx-auto relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-primary" />
          
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-paragraph uppercase tracking-widest">
              <Zap size={14} />
              <span>Espacio Limitado</span>
            </div>
            
            <h2 className="font-heading text-6xl md:text-7xl text-soft-white">
              ¿Qué mostrarás al mundo?
            </h2>
            
            <p className="font-paragraph text-xl text-soft-white/60">
              Solo cuesta $3. Solo dura 60 segundos. <br/>
              Pero la impresión puede durar para siempre.
            </p>

            <div className="pt-8">
              <Button
                onClick={() => navigate('/purchase')}
                className="bg-primary hover:bg-primary/90 text-white font-paragraph text-xl px-16 py-10 rounded-none transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(139,0,0,0.5)]"
              >
                Comprar 1 Minuto
                <ArrowRight className="ml-4 w-6 h-6" />
              </Button>
            </div>

            {/* Legal Warning Box */}
            <div className="mt-24 p-8 border border-soft-white/10 bg-soft-white/5 backdrop-blur-sm text-left max-w-2xl mx-auto relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors" />
              <div className="flex items-start gap-4">
                <ShieldAlert className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div className="space-y-4">
                  <h3 className="font-heading text-2xl text-soft-white">Advertencia Legal Obligatoria</h3>
                  <div className="font-paragraph text-sm text-soft-white/60 space-y-2 leading-relaxed">
                    <p>• Al usar este servicio, confirmas que tienes más de 18 años.</p>
                    <p>• Todo el contenido es revisado manualmente antes de su publicación.</p>
                    <p>• Política de Cero Tolerancia: Cualquier contenido ilegal, violento o que involucre menores será reportado inmediatamente a las autoridades pertinentes.</p>
                    <p>• El pago de $3 es una tarifa de servicio no reembolsable.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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