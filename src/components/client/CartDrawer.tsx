import React, { useState } from 'react';
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Utensils, 
  ArrowRight,
  CreditCard
} from 'lucide-react';
import type { CartItem, Restaurant } from '../../types';
import { i18n } from '../../services/i18n';
import { CheckoutModal } from './CheckoutModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  tableNumber: string;
  restaurant: Restaurant;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  tableNumber,
  restaurant,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const t = i18n.t();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const total = items.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);

  if (!isOpen) return null;

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = () => {
    onClearCart();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
        <div 
          className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  {t.myOrder}
                </h3>
                <p className="text-xs text-slate-400">
                  {tableNumber ? `${t.tableNumberLabel} ${tableNumber}` : 'Consumo no Local'} • {items.length} {items.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Utensils className="w-12 h-12 stroke-1 mb-3 text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">{t.emptyCart}</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {t.emptyCartSub}
                </p>
              </div>
            ) : (
              items.map((item) => {
                const itemTotal = item.dish.price * item.quantity;

                return (
                  <div
                    key={item.dish.id}
                    className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex gap-3 items-center justify-between"
                  >
                    <img
                      src={item.dish.image_url}
                      alt={item.dish.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {item.dish.name}
                      </h4>
                      <p className="text-xs text-orange-400 font-semibold mt-0.5">
                        {i18n.formatCurrency(itemTotal)}
                      </p>
                      {item.notes && (
                        <p className="text-[11px] text-slate-400 italic truncate mt-0.5">
                          Obs: {item.notes}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            onRemoveItem(item.dish.id);
                          } else {
                            onUpdateQuantity(item.dish.id, item.quantity - 1);
                          }
                        }}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.dish.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Action */}
          {items.length > 0 && (
            <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-200">{i18n.formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>{t.totalOrder}:</span>
                  <span className="text-orange-400 font-heading text-lg">{i18n.formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handleOpenCheckout}
                className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <CreditCard className="w-4 h-4" />
                <span>{t.checkoutBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Silicon Valley Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={items}
        tableNumber={tableNumber}
        restaurant={restaurant}
        onOrderCompleted={handleOrderCompleted}
      />
    </>
  );
};
