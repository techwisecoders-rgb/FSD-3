import React from 'react';
import { ArrowUpRight, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';
import SplitText from './reactbits/SplitText';
import BlurText from './reactbits/BlurText';
import WorkflowScene from './three/WorkflowScene';

export default function Hero({ onOpenModal }) {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        
        {/* Left Column: Expressive Typography & CTAs */}
        <div className="lg:col-span-7 flex flex-col z-10">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#A8D5A8] shadow-sm w-fit mb-6">
            <span className="uiverse-status-dot" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
              The Skilled Service Marketplace
            </span>
          </div>

          {/* Editorial Headline with ReactBits SplitText animation */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1B5E20] leading-[1.1] mb-6">
            <SplitText
              text="Great Work Starts With the Right Connection."
              delay={35}
              className="text-[#1B5E20]"
            />
          </h1>

          {/* Supporting Copy with BlurText animation */}
          <p className="text-base sm:text-lg md:text-xl text-[#1B5E20]/85 font-medium leading-relaxed max-w-2xl mb-8">
            <BlurText
              text="Find skilled local professionals, connect with the right people, and bring your next project to life."
              delay={15}
            />
          </p>

          {/* Interactive CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
            <button
              onClick={() => onOpenModal('client')}
              className="uiverse-btn-primary group"
            >
              <span>Find a Professional</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={() => onOpenModal('pro')}
              className="uiverse-btn-secondary"
            >
              <span>Join as a Professional</span>
            </button>
          </div>

          {/* Supporting Statement & Trust Badges */}
          <div className="pt-6 border-t border-[#A8D5A8]/60 flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-medium text-[#1B5E20]/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#66BB6A]" />
              <span>Connecting people with skills, services, and opportunities.</span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#A8D5A8]" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#66BB6A]" />
              <span>Direct regional network</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Canvas Scene & Depth Card */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[500px] rounded-3xl bg-[#FFFFFF]/70 backdrop-blur-sm border-2 border-[#A8D5A8] shadow-2xl overflow-hidden p-2">
            
            {/* Three.js Interactive Service Network Scene */}
            <WorkflowScene className="w-full h-full rounded-2xl" />

            {/* Floating Info Pill inside 3D Canvas */}
            <div className="absolute top-4 left-4 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#A8D5A8] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-[#66BB6A]" />
              <span className="text-[11px] font-bold text-[#1B5E20] uppercase tracking-wider">
                Interactive 3D Node Mesh
              </span>
            </div>

            {/* Bottom floating hint */}
            <div className="absolute bottom-4 right-4 bg-[#E7F4E8]/90 backdrop-blur-md border border-[#A8D5A8] px-3 py-1 rounded-full text-[10px] text-[#1B5E20] font-semibold pointer-events-none">
              Drag to explore network
            </div>
          </div>
        </div>

      </div>

      {/* Hero Bottom Scroll Cue Indicator */}
      <div className="pt-8 flex justify-center">
        <a
          href="#cinematic-experience"
          aria-label="Scroll down to cinematic experience"
          className="flex flex-col items-center gap-2 text-[#1B5E20]/75 hover:text-[#1B5E20] transition-colors group cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B5E20]/60 group-hover:text-[#1B5E20]">
            Explore Cinematic Sequence
          </span>
          <div className="w-8 h-12 rounded-full border-2 border-[#A8D5A8] flex items-start justify-center p-1.5 group-hover:border-[#1B5E20] transition-colors">
            <span className="w-1.5 h-3 bg-[#66BB6A] rounded-full animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
