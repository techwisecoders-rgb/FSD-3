import React from 'react';
import { Search, MessageSquare, CheckSquare, ArrowUpRight } from 'lucide-react';

export default function HowItWorks({ onOpenModal }) {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      headline: 'Explore Service Categories',
      description: 'Explore service categories and find professionals relevant to your needs across local districts.',
      icon: Search,
      details: ['Filter by trade specialty', 'Review regional coverage', 'Inspect capabilities & scope'],
    },
    {
      number: '02',
      title: 'Connect',
      headline: 'Direct Professional Contact',
      description: 'Review service information and contact the right professional with zero intermediary friction.',
      icon: MessageSquare,
      details: ['Direct message coordination', 'Share project dimensions', 'Establish expectations early'],
    },
    {
      number: '03',
      title: 'Get It Done',
      headline: 'Execute With Confidence',
      description: 'Coordinate the work and move forward with confidence from inception to final quality walkthrough.',
      icon: CheckSquare,
      details: ['On-site craftsmanship', 'Transparent milestone updates', 'Verified project completion'],
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#A8D5A8]/50"
      aria-label="How Workflow Connect works"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#A8D5A8] text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-4">
          <span>05 — Process</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1B5E20]">
          From Finding to Finished.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#1B5E20]/80 leading-relaxed">
          A transparent, direct workflow structured to connect project needs with skilled hands without convoluted steps.
        </p>
      </div>

      {/* Connected 3-Step Editorial Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        
        {/* Background Connecting Line on Desktop */}
        <div className="hidden md:block absolute top-1/4 left-16 right-16 h-0.5 bg-gradient-to-r from-[#A8D5A8] via-[#66BB6A] to-[#A8D5A8] -z-0" />

        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          return (
            <div
              key={step.number}
              className="relative z-10 bg-[#FFFFFF] border border-[#A8D5A8] rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-[#66BB6A] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-[#1B5E20] group-hover:text-[#66BB6A] transition-colors">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#E7F4E8] border border-[#A8D5A8] flex items-center justify-center text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-[#FFFFFF] transition-colors">
                    <StepIcon className="w-6 h-6" />
                  </div>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-[#66BB6A]">
                  Step {step.number} — {step.title}
                </span>
                <h3 className="text-xl font-bold text-[#1B5E20] mt-1 mb-3">
                  {step.headline}
                </h3>
                <p className="text-sm text-[#1B5E20]/80 leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Micro bullets */}
                <ul className="space-y-2 border-t border-[#E7F4E8] pt-4 mb-6">
                  {step.details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-xs text-[#1B5E20]/75 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action trigger */}
              <button
                onClick={() => onOpenModal('client')}
                className="w-full pt-4 border-t border-[#A8D5A8]/50 flex items-center justify-between text-xs font-bold text-[#1B5E20] group-hover:text-[#66BB6A] transition-colors cursor-pointer"
              >
                <span>Start with {step.title}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
