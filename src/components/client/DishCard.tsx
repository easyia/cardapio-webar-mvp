import React from 'react';
import { Sparkles, Plus, Star, Clock, Leaf } from 'lucide-react';
import type { Dish } from '../../types';

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
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(dish.price);

  const formattedOriginalPrice = dish.original_price
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(dish.original_price)
    : null;

  return (
    <div
      onClick={() => onOpenDetail(dish)}
      className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-orange-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-orange-500/10 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={dish.image_url}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* AR Available Badge */}
          <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md border border-orange-500/40 text-orange-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
            <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
            <span>3D & AR</span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1">
            {dish.is_chef_special && (
              <span className="bg-amber-500/90 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
                ⭐ CHEF
              </span>
            )}
            {dish.is_vegetarian && (
              <span className="bg-emerald-500/90 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                <Leaf className="w-2.5 h-2.5" /> VEG
              </span>
            )}
          </div>
        </div>

        {/* Rating and Prep Time bottom bar over image */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-300 font-medium">
          {dish.rating && (
            <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-800">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{dish.rating.toFixed(1)}</span>
            </div>
          )}
          {dish.preparation_time && (
            <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-800 text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{dish.preparation_time}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1 font-heading">
            {dish.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Action Buttons & Price */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
          
          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              {formattedOriginalPrice && (
                <span className="text-[11px] text-slate-500 line-through block leading-none">
                  {formattedOriginalPrice}
                </span>
              )}
              <span className="text-lg font-extrabold text-white">
                {formattedPrice}
              </span>
            </div>

            <button
              onClick={(e) => onAddToCart(dish, e)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-orange-500 text-slate-200 hover:text-white transition-colors border border-slate-700 hover:border-orange-500 shadow-sm flex items-center gap-1 text-xs font-semibold"
              title="Adicionar ao pedido"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>

          {/* Direct "Ver na Mesa" AR Trigger Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAR(dish);
            }}
            className="w-full py-2 px-3 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300 hover:text-orange-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm group/ar"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400 group-hover/ar:rotate-12 transition-transform" />
            <span>Ver na Mesa em 3D / AR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
