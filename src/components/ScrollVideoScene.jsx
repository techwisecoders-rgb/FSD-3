import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Layers, Compass, Network, Sparkles, CheckCircle2 } from 'lucide-react';

const STAGES = [
  {
    id: 1,
    title: 'Discovery',
    subtitle: 'The Core Ecosystem',
    description: 'A clean, craft-centered environment introduces the Workflow Connect foundation.',
    range: [0.0, 0.20],
    icon: Compass,
  },
  {
    id: 2,
    title: 'Skills Emerge',
    subtitle: 'Diverse Trade Nodes',
    description: 'Visual representations of specialized service trades appear across the district.',
    range: [0.20, 0.45],
    icon: Layers,
  },
  {
    id: 3,
    title: 'Connection',
    subtitle: 'Active Linkages',
    description: 'Dynamic pathways and pulses bridge local homeowners with verified craftspeople.',
    range: [0.45, 0.70],
    icon: Sparkles,
  },
  {
    id: 4,
    title: 'Network',
    subtitle: 'Synchronized Web',
    description: 'Individual professionals form an integrated, resilient service constellation.',
    range: [0.70, 0.90],
    icon: Network,
  },
  {
    id: 5,
    title: 'Resolution',
    subtitle: 'One Unified Place',
    description: 'One place. Many skills. Better connections.',
    range: [0.90, 1.00],
    icon: CheckCircle2,
  },
];

export default function ScrollVideoScene() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const isSeekingRef = useRef(false);
  const rafIdRef = useRef(null);
  const lastTargetTimeRef = useRef(0);

  // Jump to specific stage on click
  const scrollToStage = (stageIdx) => {
    if (!containerRef.current) return;
    const stage = STAGES[stageIdx];
    const targetProgress = (stage.range[0] + stage.range[1]) / 2;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const scrollDistance = containerRef.current.scrollHeight - window.innerHeight;
    const targetY = containerTop + targetProgress * scrollDistance;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  // Video metadata loaded
  const handleLoadedMetadata = () => {
    setVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0.01;
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  // Scroll seek loop
  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      rafIdRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;

        // Current scroll progress through this pinned container
        const currentProgress = Math.min(1, Math.max(0, -rect.top / totalHeight));
        setProgress(currentProgress);

        // Determine active stage
        const stageIndex = STAGES.findIndex(
          (s) => currentProgress >= s.range[0] && currentProgress <= s.range[1]
        );
        if (stageIndex !== -1) {
          setActiveStage(stageIndex);
        } else if (currentProgress > 0.9) {
          setActiveStage(4);
        }

        // Scrub video to matching timestamp
        const video = videoRef.current;
        if (video && video.duration && !video.seeking) {
          const targetTime = currentProgress * video.duration;
          lastTargetTimeRef.current = targetTime;

          // Only seek if change exceeds 0.04s threshold
          if (Math.abs(video.currentTime - targetTime) > 0.04) {
            video.currentTime = targetTime;
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const currentStageInfo = STAGES[activeStage] || STAGES[0];
  const StageIcon = currentStageInfo.icon;

  return (
    <section
      ref={containerRef}
      id="cinematic-experience"
      className="relative w-full h-[320vh] bg-[#E7F4E8] text-[#1B5E20]"
      aria-label="Scroll-driven cinematic storytelling sequence"
    >
      {/* Sticky Fullscreen Experience Viewport */}
      <div className="sticky top-0 w-full h-screen flex flex-col justify-between overflow-hidden">
        
        {/* Top Floating Header & Stage Selector */}
        <header className="relative z-20 px-4 md:px-10 pt-6 md:pt-8 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1B5E20] text-[#FFFFFF] text-xs font-bold">
              03
            </span>
            <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-[#1B5E20]">
              Cinematic Interactive Sequence
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
            <span className="hidden sm:inline-block text-xs text-[#1B5E20]/70">
              Scroll forward & backward to scrub
            </span>
          </div>

          {/* 5-Stage Stepper Pill Tabs */}
          <nav
            aria-label="Cinematic narrative stages"
            className="flex items-center gap-1.5 bg-[#FFFFFF]/80 backdrop-blur-md p-1.5 rounded-full border border-[#A8D5A8] shadow-sm max-w-full overflow-x-auto"
          >
            {STAGES.map((s, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToStage(idx)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#1B5E20] text-[#FFFFFF] shadow-sm font-semibold'
                      : 'text-[#1B5E20]/80 hover:text-[#1B5E20] hover:bg-[#A8D5A8]/30'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span className="hidden sm:inline mr-1 opacity-70">0{s.id}</span>
                  {s.title}
                </button>
              );
            })}
          </nav>
        </header>

        {/* Center: Cinematic Video & Interactive Overlays */}
        <main className="relative flex-1 w-full max-w-6xl mx-auto px-4 my-2 flex items-center justify-center">
          <div className="relative w-full h-[65vh] max-h-[580px] rounded-3xl overflow-hidden border-2 border-[#A8D5A8] shadow-2xl bg-[#E7F4E8] flex items-center justify-center">
            
            {/* HTML5 Video Element scrubbing to scroll progress */}
            <video
              ref={videoRef}
              src="/videos/workflow-connect-hero.mp4"
              poster="/images/workflow-connect-poster.webp"
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={handleLoadedMetadata}
              onError={handleVideoError}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              aria-label="Workflow Connect cinematic progression video"
            />

            {/* Fallback poster overlay if error or waiting */}
            {videoError && (
              <img
                src="/images/workflow-connect-poster.webp"
                alt="Workflow Connect Connected Network Visual"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Subtle Brand Tint Overlay strictly in authorized colors */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/30 via-transparent to-[#E7F4E8]/20 pointer-events-none" />

            {/* Dynamic Stage Narrative Card (Asymmetrical Floating Box) */}
            <article
              key={activeStage}
              className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-md bg-[#FFFFFF]/90 backdrop-blur-md border border-[#A8D5A8] p-5 md:p-6 rounded-2xl shadow-xl transition-all duration-500 ease-out z-10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#66BB6A] bg-[#E7F4E8] px-2.5 py-1 rounded-full border border-[#A8D5A8]">
                  <StageIcon className="w-3.5 h-3.5" />
                  Stage 0{currentStageInfo.id} — {currentStageInfo.title}
                </span>
                <span className="text-xs font-mono text-[#1B5E20]/60">
                  {Math.round(progress * 100)}%
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#1B5E20]">
                {currentStageInfo.subtitle}
              </h3>
              <p className="mt-1 text-sm text-[#1B5E20]/80 leading-relaxed">
                {currentStageInfo.description}
              </p>
            </article>

            {/* Central Badge at Stage 5 Resolution */}
            {activeStage === 4 && (
              <div className="absolute top-8 right-8 hidden md:flex items-center gap-2 bg-[#1B5E20] text-[#FFFFFF] px-4 py-2 rounded-full shadow-lg border border-[#66BB6A] animate-bounce">
                <Sparkles className="w-4 h-4 text-[#66BB6A]" />
                <span className="text-xs font-bold">Network Fully Connected</span>
              </div>
            )}
          </div>
        </main>

        {/* Bottom Timeline Scrub Indicator & Mobile Hint */}
        <footer className="relative z-20 px-4 md:px-10 pb-6 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Real-time scrub progress bar */}
          <div className="w-full md:w-2/3 flex items-center gap-4">
            <span className="text-xs font-mono font-semibold text-[#1B5E20] min-w-[3rem]">
              0.00s
            </span>
            <div className="relative flex-1 h-2 bg-[#A8D5A8]/50 rounded-full overflow-hidden border border-[#A8D5A8]">
              <div
                className="absolute top-0 bottom-0 left-0 bg-[#1B5E20] rounded-full transition-all duration-75"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-semibold text-[#1B5E20] min-w-[3rem] text-right">
              4.00s
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#1B5E20]/75">
            <span className="inline-block w-2 h-2 rounded-full bg-[#66BB6A] animate-ping" />
            <span>Interactive timeline scrubbing linked to scroll</span>
          </div>
        </footer>

      </div>
    </section>
  );
}
