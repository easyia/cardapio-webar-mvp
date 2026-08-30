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
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!isOpen || !dish) return null;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(dish.price * quantity);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700/80 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Top Container (3D Model / 2D Photo Switcher) */}
        <div className="relative w-full h-80 sm:h-96 bg-slate-950 flex-shrink-0">
          
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />
            </div>
          )}

          {/* Toggle 3D vs Foto */}
          <div className="absolute top-4 left-4 z-30 flex items-center bg-slate-950/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-lg">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Visualizador 3D</span>
            </button>

            <button
              onClick={() => setViewMode('photo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'photo'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
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
            <div className="flex items-center gap-2 mb-1.5">
              {dish.is_chef_special && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                  ⭐ ESCOLHA DO CHEF
                </span>
              )}
              {dish.is_vegetarian && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> VEGETARIANO
                </span>
              )}
              {dish.is_gluten_free && (
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                  SEM GLÚTEN
                </span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-white font-heading">
              {dish.name}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Quick Metrics (Portion, Calories, Prep Time, Rating) */}
          <div className="grid grid-cols-3 gap-2.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            {dish.portion_size && (
              <div className="p-1">
                <UtensilsCrossed className="w-4 h-4 mx-auto text-orange-400 mb-1" />
                <span className="text-[10px] text-slate-400 block">Porção</span>
                <span className="text-xs font-bold text-slate-200">{dish.portion_size}</span>
              </div>
            )}
            {dish.preparation_time && (
              <div className="p-1 border-x border-slate-800">
                <Clock className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                <span className="text-[10px] text-slate-400 block">Preparo</span>
                <span className="text-xs font-bold text-slate-200">{dish.preparation_time}</span>
              </div>
            )}
            {dish.calories && (
              <div className="p-1">
                <Flame className="w-4 h-4 mx-auto text-rose-400 mb-1" />
                <span className="text-[10px] text-slate-400 block">Calorias</span>
                <span className="text-xs font-bold text-slate-200">~{dish.calories} kcal</span>
              </div>
            )}
          </div>

          {/* Ingredients List */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Ingredientes Selecionados
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {dish.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300"
                  >
                    • {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom Notes */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Observações para a cozinha (opcional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Ponto da carne bem passado, sem molho..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Footer Order Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-sm text-white w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-between transition-all transform active:scale-98 shadow-lg ${
              addedAnimation
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-orange-500/25'
            }`}
          >
            <div className="flex items-center gap-2">
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Adicionado ao Pedido!</span>
                </>
              ) : (
                <>
                  <span>Adicionar ao Pedido</span>
                </>
              )}
            </div>
            <span className="bg-black/20 px-2.5 py-1 rounded-xl text-xs font-black">
              {formattedPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
