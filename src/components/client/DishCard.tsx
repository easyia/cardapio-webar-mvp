import React from 'react';
import { Sparkles, Plus, Star, Clock, Leaf } from 'lucide-react';
import type { Dish } from '../../types';
import { i18n } from '../../services/i18n';

interface DishCardProps {
  dish: Dish;
  onOpenDetail: (dish: Dish) => void;
  onOpenAR: (dish: Dish) => void;
  onAddToCart: (dish: Dish, e: React.MouseEvent) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  onOpenDetail,
  onOpenAR,
  onAddToCart,
}) => {
  const t = i18n.t();
  const formattedPrice = i18n.formatCurrency(dish.price);
  const formattedOriginalPrice = dish.original_price
    ? i18n.formatCurrency(dish.original_price)
    : null;

  return (
    <div
      onClick={() => onOpenDetail(dish)}
      className="group relative bg-[#161412] hover:bg-[#1A1815] border border-[#1E1B18] hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0C0B0A]">
        <img
          src={dish.image_url}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* AR Available Badge */}
          <div className="flex items-center gap-1.5 bg-[#0C0B0A]/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>3D & AR</span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1">
            {dish.is_chef_special && (
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-[#0C0B0A] text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">
                ⭐ CHEF
              </span>
            )}
            {dish.is_vegetarian && (
              <span className="bg-emerald-500/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                <Leaf className="w-2.5 h-2.5" /> VEG
              </span>
            )}
          </div>
        </div>

        {/* Rating and Prep Time bottom bar over image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-[#FAF8F5] font-medium">
          {dish.rating && (
            <div className="flex items-center gap-1 bg-[#0C0B0A]/85 backdrop-blur-xs px-2 py-0.5 rounded-lg border border-[#1E1B18]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-mono text-xs">{dish.rating.toFixed(1)}</span>
            </div>
          )}
          {dish.preparation_time && (
            <div className="flex items-center gap-1 bg-[#0C0B0A]/85 backdrop-blur-xs px-2 py-0.5 rounded-lg border border-[#1E1B18] text-[#A39E93]">
              <Clock className="w-3 h-3" />
              <span>{dish.preparation_time}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-black text-[#FAF8F5] group-hover:text-amber-400 transition-colors line-clamp-1 font-heading">
            {dish.name}
          </h3>
          <p className="text-xs text-[#A39E93] line-clamp-2 mt-1 leading-relaxed font-light">
            {dish.description}
          </p>
        </div>

        {/* Action Buttons & Price */}
        <div className="pt-3 border-t border-[#1E1B18] flex flex-col gap-3">
          
          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              {formattedOriginalPrice && (
                <span className="text-[11px] text-[#716B61] line-through block leading-none font-mono">
                  {formattedOriginalPrice}
                </span>
              )}
              <span className="text-xl font-black text-[#FAF8F5] font-mono tracking-tight">
                {formattedPrice}
              </span>
            </div>

            <button
              onClick={(e) => onAddToCart(dish, e)}
              className="p-2.5 rounded-xl bg-[#1E1B18] hover:bg-amber-600 text-slate-200 hover:text-white transition-all border border-[#2B2723] hover:border-amber-500 shadow-sm flex items-center gap-1.5 text-xs font-bold"
              title={t.addToCart}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t.addToCart.split(' ')[0]}</span>
            </button>
          </div>

          {/* Direct "Ver na Mesa" AR Trigger Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAR(dish);
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm group/ar"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover/ar:rotate-12 transition-transform" />
            <span>{t.viewInAR.toLowerCase().includes('mesa') ? 'Projetar na Mesa em 3D / AR' : 'Ver en la Mesa en 3D / AR'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
