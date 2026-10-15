import React from 'react';
import { UserCheck, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ValueProposition({ onOpenModal }) {
  const customerBenefits = [
    'Discover relevant local services tailored to residential needs.',
    'Explore different types of skilled trade professionals.',
    'Find transparent service information and scope in one place.',
    'Make direct connections with craftspeople without middlemen.',
  ];

  const proBenefits = [
    'Showcase specialized skills, experience, and trade portfolios.',
    'Present specific capabilities to an engaged regional audience.',
    'Become significantly easier for local property owners to discover.',
    'Create lasting professional connections within the community network.',
  ];

  return (
    <section
      id="value-proposition"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#A8D5A8]/50"
      aria-label="Value proposition and trust"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#A8D5A8] text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-4">
          <span>07 — Dual Ecosystem</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1B5E20]">
          Built Around People. Driven by Trust.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#1B5E20]/80 leading-relaxed">
          A balanced platform engineered to serve both those who seek skilled work and those whose livelihood is great craftsmanship.
        </p>
      </div>

      {/* Sophisticated Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* For Customers Column */}
        <div className="bg-[#FFFFFF] rounded-3xl border-2 border-[#A8D5A8] p-8 md:p-10 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-[#66BB6A] transition-colors">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F4E8] text-[#1B5E20] border border-[#A8D5A8] flex items-center justify-center mb-6">
              <UserCheck className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#66BB6A]">
              For Homeowners & Clients
            </span>
            <h3 className="text-2xl font-bold text-[#1B5E20] mt-1 mb-6">
              Finding the Right Hands for Your Space
            </h3>

            <div className="space-y-4 mb-8">
              {customerBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#66BB6A] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#1B5E20]/85 font-medium leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenModal('client')}
            className="relative z-10 uiverse-btn-primary w-full justify-center text-xs py-3"
          >
            <span>Explore Local Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* For Professionals Column */}
        <div className="bg-[#E7F4E8] rounded-3xl border-2 border-[#66BB6A] p-8 md:p-10 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-[#1B5E20] transition-colors">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#1B5E20] text-[#FFFFFF] border border-[#66BB6A] flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
              For Independent Trades & Craftsmen
            </span>
            <h3 className="text-2xl font-bold text-[#1B5E20] mt-1 mb-6">
              Growing Your Local Trade Network
            </h3>

            <div className="space-y-4 mb-8">
              {proBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1B5E20] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#1B5E20]/85 font-medium leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenModal('pro')}
            className="relative z-10 uiverse-btn-secondary w-full justify-center text-xs py-3 font-bold"
          >
            <span>Apply as a Professional</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
