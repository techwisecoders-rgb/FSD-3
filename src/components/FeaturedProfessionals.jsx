import React from 'react';
import { PROFESSIONALS } from '../data/professionals';
import { MapPin, Briefcase, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export default function FeaturedProfessionals({ onOpenModal }) {
  return (
    <section
      id="featured-pros"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Featured illustrative professional profiles"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#A8D5A8] text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-4">
            <span>06 — People Behind the Craft</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1B5E20]">
            Meet the People Behind Great Work.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#1B5E20]/80 max-w-2xl leading-relaxed">
            Illustrative sample profiles showcasing specialized craftsmen and local trade experts ready to collaborate.
          </p>
        </div>

        <div className="text-xs text-[#1B5E20]/70 bg-[#FFFFFF] border border-[#A8D5A8] px-3.5 py-1.5 rounded-full font-medium">
          All profiles are illustrative demonstrations
        </div>
      </div>

      {/* Grid of Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROFESSIONALS.map((pro) => (
          <div
            key={pro.id}
            className="uiverse-card p-6 flex flex-col justify-between group"
          >
            <div>
              {/* Header with Avatar Monogram & Trade Badge */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1B5E20] text-[#FFFFFF] font-extrabold text-base flex items-center justify-center shadow-md border border-[#66BB6A] group-hover:scale-105 transition-transform">
                    {pro.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B5E20] leading-snug">
                      {pro.name}
                    </h3>
                    <span className="text-xs font-semibold text-[#66BB6A] block">
                      {pro.role}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E7F4E8] text-[#1B5E20] px-2.5 py-1 rounded-full border border-[#A8D5A8]">
                  Sample Profile
                </span>
              </div>

              {/* Specialty & Location */}
              <div className="space-y-1.5 py-3 border-y border-[#E7F4E8] mb-4 text-xs text-[#1B5E20]/80">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#66BB6A] flex-shrink-0" />
                  <span className="font-semibold text-[#1B5E20]">{pro.specialty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#1B5E20]/60 flex-shrink-0" />
                  <span>{pro.serviceArea}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#1B5E20]/60 flex-shrink-0" />
                  <span>{pro.experienceLevel}</span>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-sm text-[#1B5E20]/80 leading-relaxed mb-6">
                {pro.bio}
              </p>
            </div>

            {/* Connect CTA opens modal with this pro preselected */}
            <button
              onClick={() => onOpenModal('client', pro)}
              className="uiverse-btn-secondary w-full py-2.5 text-xs font-bold justify-center"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Connect with {pro.name.split(' ')[0]}</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
