import React from 'react';
import { Sparkles, Wifi, Search, Star, Utensils } from 'lucide-react';
import type { Restaurant } from '../../types';

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
  return (
    <header className="relative w-full overflow-hidden bg-slate-950 border-b border-slate-800/80">
      {/* Hero Cover Banner with Parallax Gradient */}
      <div className="relative h-44 sm:h-56 w-full overflow-hidden">
        <img
          src={restaurant.cover_url}
          alt={restaurant.name}
          className="w-full h-full object-cover object-center filter brightness-65 scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        
        {/* Floating Table Badge */}
        {tableNumber && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-orange-500/90 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md border border-orange-400/40 animate-pulse-subtle">
            <Utensils className="w-3.5 h-3.5" />
            <span>Mesa {tableNumber}</span>
          </div>
        )}

        {/* WebAR Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md text-slate-200 text-xs px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span className="font-medium">Cardápio 3D & WebAR</span>
        </div>
      </div>

      {/* Restaurant Info Profile Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-14 relative z-20 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 justify-between">
          
          <div className="flex items-end gap-4">
            {/* Restaurant Logo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-3 border-slate-900 bg-slate-800 shadow-2xl flex-shrink-0">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
            </div>

            {/* Title & Tagline */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                {restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 mt-0.5">
                {restaurant.tagline}
              </p>
            </div>
          </div>

          {/* Quick Info Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            {restaurant.wifi_name && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300" title={`Senha: ${restaurant.wifi_password}`}>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wi-Fi: <strong className="text-slate-200">{restaurant.wifi_name}</strong></span>
              </div>
            )}
            
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-amber-300 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 (420+ avaliações)</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar pratos, ingredientes, drinks, sobremesas..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-2 py-0.5 rounded-md"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
