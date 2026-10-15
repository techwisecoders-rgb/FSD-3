import React from 'react';
import { ArrowUpRight, Sparkles, Shield, Award } from 'lucide-react';

export default function ProfessionalCTA({ onOpenModal }) {
  return (
    <section
      id="for-professionals"
      className="relative w-full bg-[#1B5E20] text-[#FFFFFF] py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-label="Professional recruitment"
    >
      {/* Decorative Geometric Vector Lines in #66BB6A and #A8D5A8 */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pro" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#A8D5A8" strokeWidth="0.8" />
              <circle cx="24" cy="24" r="1.5" fill="#66BB6A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pro)" />
        </svg>
      </div>

      {/* Ambient Radial Glow in #66BB6A */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#66BB6A]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#A8D5A8]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF]/10 border border-[#A8D5A8]/30 text-xs font-bold uppercase tracking-wider text-[#A8D5A8] mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#66BB6A]" />
          <span>Professional Network Access</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#FFFFFF] leading-[1.15] max-w-3xl mb-6">
          Your Skills Deserve to Be Discovered.
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-[#E7F4E8]/90 max-w-2xl font-medium leading-relaxed mb-10">
          Showcase your work, connect with customers, and make your professional skills easier to discover.
        </p>

        {/* Main CTA Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
          <button
            onClick={() => onOpenModal('pro')}
            className="px-8 py-4 rounded-full font-bold text-sm bg-[#FFFFFF] text-[#1B5E20] hover:bg-[#66BB6A] hover:text-[#FFFFFF] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <span>Join Workflow Connect</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Pillars / Accents */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-10 border-t border-[#A8D5A8]/20 text-left">
          <div className="bg-[#FFFFFF]/5 backdrop-blur-sm border border-[#A8D5A8]/20 p-5 rounded-2xl">
            <span className="text-[#66BB6A] font-bold text-xs uppercase tracking-wider block mb-1">
              Direct Inquiries
            </span>
            <p className="text-xs text-[#E7F4E8]/80 leading-relaxed">
              Connect directly with residential clients actively seeking your specific trade capabilities.
            </p>
          </div>

          <div className="bg-[#FFFFFF]/5 backdrop-blur-sm border border-[#A8D5A8]/20 p-5 rounded-2xl">
            <span className="text-[#66BB6A] font-bold text-xs uppercase tracking-wider block mb-1">
              Zero Intermediary Cut
            </span>
            <p className="text-xs text-[#E7F4E8]/80 leading-relaxed">
              Maintain full pricing autonomy and keep 100% of the project agreements you establish.
            </p>
          </div>

          <div className="bg-[#FFFFFF]/5 backdrop-blur-sm border border-[#A8D5A8]/20 p-5 rounded-2xl">
            <span className="text-[#66BB6A] font-bold text-xs uppercase tracking-wider block mb-1">
              Regional Visibility
            </span>
            <p className="text-xs text-[#E7F4E8]/80 leading-relaxed">
              Anchor your reputation within your immediate neighborhood and adjacent service districts.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
