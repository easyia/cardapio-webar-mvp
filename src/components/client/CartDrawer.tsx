import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Utensils, 
  CheckCircle2, 
  Send
} from 'lucide-react';
import type { CartItem, Restaurant } from '../../types';
import { storeService } from '../../services/storeService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  tableNumber: string;
  restaurant?: Restaurant;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  tableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderSent, setOrderSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(total);

  const handleSendOrder = () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      // Create local order
      storeService.createOrder({
        id: `ord-${Date.now()}`,
        table_number: tableNumber || 'Balcão',
        items: [...items],
        total,
        status: 'enviado',
        created_at: new Date().toISOString(),
      });

      setIsSubmitting(false);
      setOrderSent(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fbbf24', '#34d399', '#38bdf8'],
      });
    }, 800);
  };

  const handleFinish = () => {
    setOrderSent(false);
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
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
                Comanda da Mesa
              </h3>
              <p className="text-xs text-slate-400">
                {tableNumber ? `Mesa ${tableNumber}` : 'Consumo no Local'} • {items.length} {items.length === 1 ? 'item' : 'itens'}
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

        {/* Order Sent Success State */}
        {orderSent ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-white font-heading">
                Pedido Enviado para a Cozinha!
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Seu pedido foi registrado para a <strong className="text-orange-400">Mesa {tableNumber || '01'}</strong> e os pratos já estão sendo preparados com carinho.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 w-full text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-amber-400 font-semibold">👨‍🍳 Em Preparo</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tempo estimado:</span>
                <span className="text-slate-200 font-semibold">15 - 25 min</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>Total:</span>
                <span className="text-orange-400 font-bold text-sm">{formattedTotal}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Continuar Olhando o Cardápio
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Utensils className="w-12 h-12 stroke-1 mb-3 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-300">Sua comanda está vazia</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore os pratos no cardápio e toque em "Adicionar" para montar seu pedido.
                  </p>
                </div>
              ) : (
                items.map((item) => {
                  const itemTotal = item.dish.price * item.quantity;
                  const formattedItemTotal = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(itemTotal);

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
                          {formattedItemTotal}
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
                    <span className="text-slate-200">{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de serviço (opcional)</span>
                    <span className="text-emerald-400">R$ 0,00</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>Total da Comanda:</span>
                    <span className="text-orange-400 font-heading text-lg">{formattedTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleSendOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Enviando para a cozinha...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Pedido para Cozinha</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
