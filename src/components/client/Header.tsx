import React from 'react';
import { Sparkles, Wifi, Search, Star, Utensils } from 'lucide-react';
import type { Restaurant } from '../../types';
import { i18n } from '../../services/i18n';

interface HeaderProps {
  restaurant: Restaurant;
  tableNumber?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart?: () => void;
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  restaurant,
  tableNumber,
  searchQuery,
  onSearchChange,
}) => {
  const t = i18n.t();

  return (
    <header className="relative w-full overflow-hidden bg-[#0C0B0A] border-b border-[#1E1B18]">
      {/* Hero Cover Banner with Parallax Gradient */}
      <div className="relative h-44 sm:h-56 w-full overflow-hidden">
        <img
          src={restaurant.cover_url}
          alt={restaurant.name}
          className="w-full h-full object-cover object-center filter brightness-60 scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/65 to-transparent" />
        
        {/* Floating Table Badge */}
        {tableNumber && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xl backdrop-blur-md border border-amber-400/40">
            <Utensils className="w-3.5 h-3.5" />
            <span>{t.tableNumberLabel} {tableNumber}</span>
          </div>
        )}

        {/* WebAR Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-[#161412]/90 backdrop-blur-md text-amber-200 text-xs px-3.5 py-1.5 rounded-full border border-amber-500/30 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold tracking-wide">WebAR 1:1 Atelier</span>
        </div>
      </div>

      {/* Restaurant Info Profile Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-14 relative z-20 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 justify-between">
          
          <div className="flex items-end gap-4">
            {/* Restaurant Logo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-[#161412] shadow-2xl flex-shrink-0">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Tagline */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#FAF8F5] tracking-tight font-heading">
                {restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#A39E93] line-clamp-1 mt-0.5 font-light">
                {restaurant.tagline}
              </p>
            </div>
          </div>

          {/* Quick Info Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#A39E93]">
            {restaurant.wifi_name && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#161412] border border-[#1E1B18]" title={`Senha: ${restaurant.wifi_password}`}>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wi-Fi: <strong className="text-white">{restaurant.wifi_name}</strong></span>
              </div>
            )}
            
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#161412] border border-[#1E1B18] text-amber-300 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 (420+ avaliações)</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-[#716B61] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 bg-[#161412] border border-[#1E1B18] rounded-2xl text-sm text-[#FAF8F5] placeholder-[#716B61] focus:outline-none focus:border-amber-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A39E93] hover:text-white bg-[#1E1B18] px-2.5 py-1 rounded-lg"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
