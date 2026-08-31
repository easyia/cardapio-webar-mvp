import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Box, 
  Clock, 
  Flame, 
  Minus, 
  Plus, 
  Check, 
  UtensilsCrossed, 
  Leaf,
  MessageSquare
} from 'lucide-react';
import type { Dish } from '../../types';
import { ModelViewer3D } from '../ar/ModelViewer3D';
import { i18n } from '../../services/i18n';

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: Dish, quantity: number, notes?: string) => void;
  onOpenARPrompt: (dish: Dish) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  isOpen,
  onClose,
  onAddToCart,
  onOpenARPrompt,
}) => {
  const t = i18n.t();
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!isOpen || !dish) return null;

  const formattedPrice = i18n.formatCurrency(dish.price * quantity);

  const handleAdd = () => {
    onAddToCart(dish, quantity, notes.trim() || undefined);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
      setQuantity(1);
      setNotes('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#161412] border border-[#1E1B18] rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-[#0C0B0A]/85 text-[#A39E93] hover:text-white border border-[#1E1B18] transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Top Container (3D Model / 2D Photo Switcher) */}
        <div className="relative w-full h-80 sm:h-96 bg-[#0C0B0A] flex-shrink-0">
          
          {viewMode === '3d' ? (
            <ModelViewer3D
              dish={dish}
              className="w-full h-full rounded-none border-none"
              onOpenARModal={() => onOpenARPrompt(dish)}
            />
          ) : (
            <div className="w-full h-full relative">
              <img
                src={dish.image_url}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-black/40" />
            </div>
          )}

          {/* Toggle 3D vs Foto */}
          <div className="absolute top-4 left-4 z-30 flex items-center bg-[#0C0B0A]/90 backdrop-blur-md p-1 rounded-2xl border border-amber-500/30 shadow-xl">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'text-[#A39E93] hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{viewMode === '3d' ? 'Visualizador 3D' : '3D'}</span>
            </button>

            <button
              onClick={() => setViewMode('photo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'photo'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'text-[#A39E93] hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Foto HD</span>
            </button>
          </div>
        </div>

        {/* Scrollable Information Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Header Title & Tags */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {dish.is_chef_special && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                  ⭐ {t.chefSpecial}
                </span>
              )}
              {dish.is_vegetarian && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> {t.vegetarian}
                </span>
              )}
              {dish.is_gluten_free && (
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                  {t.glutenFree}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#FAF8F5] font-heading">
              {dish.name}
            </h2>
            <p className="text-sm text-[#A39E93] mt-2 leading-relaxed font-light">
              {dish.description}
            </p>
          </div>

          {/* Quick Metrics (Portion, Calories, Prep Time, Rating) */}
          <div className="grid grid-cols-3 gap-2.5 bg-[#0C0B0A] p-3.5 rounded-2xl border border-[#1E1B18] text-center">
            {dish.portion_size && (
              <div className="p-1">
                <UtensilsCrossed className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                <span className="text-[10px] text-[#716B61] block">{t.portionLabel}</span>
                <span className="text-xs font-bold text-white font-mono">{dish.portion_size}</span>
              </div>
            )}
            {dish.preparation_time && (
              <div className="p-1 border-x border-[#1E1B18]">
                <Clock className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                <span className="text-[10px] text-[#716B61] block">{t.prepTimeLabel}</span>
                <span className="text-xs font-bold text-white font-mono">{dish.preparation_time}</span>
              </div>
            )}
            {dish.calories && (
              <div className="p-1">
                <Flame className="w-4 h-4 mx-auto text-rose-400 mb-1" />
                <span className="text-[10px] text-[#716B61] block">{t.caloriesLabel}</span>
                <span className="text-xs font-bold text-white font-mono">~{dish.calories} kcal</span>
              </div>
            )}
          </div>

          {/* Ingredients List */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#A39E93] uppercase tracking-wider mb-2">
                Ingredientes & Notas Sensoriais
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {dish.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-[#0C0B0A] border border-[#1E1B18] text-xs text-slate-300"
                  >
                    • {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom Notes */}
          <div>
            <label className="text-xs font-bold text-[#A39E93] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Observações para a cozinha</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.kitchenNotesPlaceholder}
              className="w-full px-4 py-3 bg-[#0C0B0A] border border-[#1E1B18] rounded-2xl text-xs text-[#FAF8F5] placeholder-[#716B61] focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer Order Bar */}
        <div className="p-5 bg-[#0C0B0A] border-t border-[#1E1B18] flex items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center gap-3 bg-[#161412] border border-[#1E1B18] p-1.5 rounded-2xl">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-[#1E1B18] hover:bg-[#2B2723] text-slate-300 flex items-center justify-center transition-colors disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-sm text-white w-4 text-center font-mono">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-[#1E1B18] hover:bg-[#2B2723] text-slate-300 flex items-center justify-center transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className={`flex-1 py-4 px-5 rounded-2xl font-extrabold text-sm flex items-center justify-between transition-all transform active:scale-98 shadow-xl ${
              addedAnimation
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-500/25 border border-amber-400/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>{t.addedToCart}</span>
                </>
              ) : (
                <>
                  <span>{t.addToCart}</span>
                </>
              )}
            </div>
            <span className="bg-black/30 px-3 py-1 rounded-xl text-xs font-black font-mono">
              {formattedPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
