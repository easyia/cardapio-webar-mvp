import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Check, 
  QrCode, 
  CreditCard, 
  Users, 
  HeartHandshake, 
  Clock, 
  Copy, 
  CheckCircle, 
  Loader2,
  UtensilsCrossed,
  ChefHat,
  Smile
} from 'lucide-react';
import type { CartItem, Restaurant, TableOrder } from '../../types';
import { storeService } from '../../services/storeService';
import { i18n } from '../../services/i18n';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  tableNumber: string;
  restaurant: Restaurant;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  tableNumber,
  restaurant,
  onOrderCompleted,
}) => {
  const t = i18n.t();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [splitCount, setSplitCount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'mercadopago' | 'card' | 'waiter'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Order Placement & Live Tracking State
  const [createdOrder, setCreatedOrder] = useState<TableOrder | null>(null);
  const [orderStep, setOrderStep] = useState<'form' | 'tracking'>('form');

  if (!isOpen || items.length === 0) return null;

  const subtotal = items.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
  const tipAmount = (subtotal * tipPercent) / 100;
  const total = subtotal + tipAmount;
  const pricePerPerson = total / splitCount;

  // Pix mock payload
  const mockPixCode = `00020126580014br.gov.bcb.pix0136auramenu-${restaurant.slug}-${Date.now()}520400005303986540${total.toFixed(2)}5802BR5913${restaurant.name.slice(0, 13)}6009SAO PAULO62070503***6304${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: TableOrder = {
        id: `ord-${Date.now()}`,
        table_number: tableNumber,
        items: [...items],
        total: total,
        status: 'enviado',
        created_at: new Date().toISOString(),
      };

      storeService.createOrder(newOrder);
      setCreatedOrder(newOrder);
      setIsProcessing(false);
      setOrderStep('tracking');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#fbbf24', '#10b981', '#ffffff'],
        });
      } catch (err) {
        console.warn('Confetti trigger:', err);
      }

      onOrderCompleted();
    }, 1200);
  };

  // Simulate Kitchen progress over time
  const currentStatus = createdOrder ? (storeService.getOrders().find(o => o.id === createdOrder.id)?.status || createdOrder.status) : 'enviado';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-heading">
                {orderStep === 'form' ? t.checkoutTitle : t.trackOrderBtn}
              </h3>
              <p className="text-xs text-slate-400">
                {restaurant.name} • {t.tableNumberLabel} {tableNumber}
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

        {/* ========================================================================= */}
        {/* VIEW 1: CHECKOUT FORM                                                     */}
        {/* ========================================================================= */}
        {orderStep === 'form' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Customer Identification */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {t.customerNameLabel}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.customerNamePlaceholder}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Tip Selection */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-orange-400" />
                  <span>{t.tipLabel}</span>
                </span>
                <span className="text-xs font-bold text-orange-400">
                  +{i18n.formatCurrency(tipAmount)}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[0, 10, 12, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTipPercent(pct)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      tipPercent === pct
                        ? 'bg-orange-500 text-white border-orange-400 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {pct === 0 ? t.noTip : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Bill */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>{t.splitBillTitle}</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {i18n.formatCurrency(pricePerPerson)} / pessoa
                </span>
              </div>

              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSplitCount(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      splitCount === num
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {num} {t.splitPersons.slice(0, 1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Radio Cards */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t.paymentMethodTitle}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Pix / QR */}
                <div
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'pix'
                      ? 'bg-orange-500/15 border-orange-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 flex-shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold block text-white">{t.payPix}</strong>
                    <span className="text-[10px] text-slate-400">{t.payPixDesc}</span>
                  </div>
                </div>

                {/* Card Machine at Table */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'card'
                      ? 'bg-orange-500/15 border-orange-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 flex-shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold block text-white">{t.payCard}</strong>
                    <span className="text-[10px] text-slate-400">{t.payCardDesc}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pix Dynamic QR Simulator (if selected) */}
            {paymentMethod === 'pix' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-orange-500/30 space-y-3 animate-fade-in text-center">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold text-orange-400 uppercase tracking-wider">{t.payPix}</span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{t.pixExpiresIn} 15:00</span>
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl max-w-[150px] mx-auto shadow-md">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mockPixCode)}`}
                    alt="QR Code Pix"
                    className="w-full h-full object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedPix ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">{t.pixCopied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-orange-400" />
                      <span>{t.pixCopyCode}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Total Summary */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({items.length} itens):</span>
                <span>{i18n.formatCurrency(subtotal)}</span>
              </div>
              {tipPercent > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Gorjeta ({tipPercent}%):</span>
                  <span className="text-orange-400">+{i18n.formatCurrency(tipAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-black text-white">
                <span>{t.totalOrder}:</span>
                <span className="text-orange-400">{i18n.formatCurrency(total)}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enviando para a Cozinha...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{t.confirmPaymentBtn} • {i18n.formatCurrency(total)}</span>
                </>
              )}
            </button>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: LIVE ORDER TRACKING TIMELINE                                      */}
        {/* ========================================================================= */}
        {orderStep === 'tracking' && createdOrder && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 text-center animate-fade-in">
            
            {/* Success Banner */}
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <ChefHat className="w-8 h-8 animate-bounce" />
              </div>
              <h4 className="text-xl font-extrabold text-white font-heading">
                {t.orderSuccessTitle}
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                {t.orderSuccessDesc}
              </p>
            </div>

            {/* Status Steps Tracker */}
            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center relative">
                
                {/* Connecting Line */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0" />
                <div 
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-orange-500 to-amber-500 z-0 transition-all duration-700"
                  style={{
                    width: currentStatus === 'enviado' ? '0%' : currentStatus === 'em_preparo' ? '50%' : '100%',
                  }}
                />

                {/* Step 1: Enviado */}
                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-orange-300">{t.orderStatusSent}</span>
                </div>

                {/* Step 2: Em Preparo */}
                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    currentStatus === 'em_preparo' || currentStatus === 'entregue' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold ${
                    currentStatus === 'em_preparo' ? 'text-amber-300 font-extrabold' : 'text-slate-500'
                  }`}>{t.orderStatusPrep}</span>
                </div>

                {/* Step 3: Entregue */}
                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    currentStatus === 'entregue' ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <Smile className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold ${
                    currentStatus === 'entregue' ? 'text-emerald-300 font-extrabold' : 'text-slate-500'
                  }`}>{t.orderStatusDelivered}</span>
                </div>

              </div>
            </div>

            {/* Order Items Recap */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                Comanda Mesa {tableNumber} • {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
              <div className="space-y-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span>{item.quantity}x {item.dish.name}</span>
                    <span className="font-mono">{i18n.formatCurrency(item.dish.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                <span>Total Pago:</span>
                <span className="text-orange-400">{i18n.formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              Voltar ao Cardápio
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
