import React, { useState } from 'react';
import { SERVICES } from '../data/services';
import {
  Wrench,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Truck,
  ArrowRight,
  CheckCircle,
  Filter,
} from 'lucide-react';

const ICON_MAP = {
  Wrench,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Truck,
};

export default function ServicesSection({ onOpenModal }) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Structural', 'Systems', 'Finishes', 'Logistics'];

  const filteredServices = SERVICES.filter((service) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Structural') return service.category.includes('Structural') || service.category.includes('Woodcraft');
    if (selectedFilter === 'Systems') return service.category.includes('Systems') || service.category.includes('Water');
    if (selectedFilter === 'Finishes') return service.category.includes('Finishes');
    if (selectedFilter === 'Logistics') return service.category.includes('Logistics');
    return true;
  });

  return (
    <section
      id="services"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Service categories discovery"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#A8D5A8] text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-4">
            <span>04 — Service Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1B5E20]">
            The Right Skills. Right When You Need Them.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#1B5E20]/80 max-w-2xl leading-relaxed">
            Explore focused trade specialties designed to handle residential upgrades, structural repairs, and routine maintenance with craftsmanship.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#FFFFFF] p-1.5 rounded-full border border-[#A8D5A8] shadow-sm self-start overflow-x-auto max-w-full">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === f
                  ? 'bg-[#1B5E20] text-[#FFFFFF]'
                  : 'text-[#1B5E20]/75 hover:text-[#1B5E20] hover:bg-[#E7F4E8]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const IconComponent = ICON_MAP[service.icon] || Wrench;
          return (
            <div
              key={service.id}
              className="uiverse-card p-6 md:p-8 flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Icon & Category Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#E7F4E8] border border-[#A8D5A8] flex items-center justify-center text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-[#FFFFFF] transition-colors duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B5E20]/60 bg-[#E7F4E8] px-2.5 py-1 rounded-full border border-[#A8D5A8]/50">
                    {service.category}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-[#1B5E20] mb-2 group-hover:text-[#66BB6A] transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-[#1B5E20]/80 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Capabilities list */}
                <div className="space-y-2 mb-6">
                  {service.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-2 text-xs text-[#1B5E20]/85 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-[#66BB6A] flex-shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link to open request modal */}
              <button
                onClick={() => onOpenModal('client')}
                className="w-full pt-4 border-t border-[#A8D5A8]/50 flex items-center justify-between text-xs font-bold text-[#1B5E20] group-hover:text-[#66BB6A] transition-colors cursor-pointer"
              >
                <span>Request {service.title}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Illustrative Notice */}
      <div className="mt-8 text-center text-xs text-[#1B5E20]/60 font-medium">
        Illustrative service categories representing regional craft offerings.
      </div>
    </section>
  );
}
