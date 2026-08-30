import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Sparkles, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import type { Dish } from '../../types';

interface ARPromptModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  restaurantSlug?: string;
}

export const ARPromptModal: React.FC<ARPromptModalProps> = ({
  dish,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !dish) return null;

  // Direct AR URL for mobile devices
  const currentOrigin = window.location.origin;
  const currentPath = window.location.pathname;
  const directARUrl = `${currentOrigin}${currentPath}?dishId=${dish.id}&ar=true`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directARUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors z-20 border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/15 border border-orange-500/40 text-orange-400 mb-2 shadow-inner">
            <Smartphone className="w-7 h-7 animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <h3 className="text-xl font-extrabold text-white font-heading">
            Projetar Prato em Realidade Aumentada
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Aponte a câmera do seu celular para o QR Code abaixo para projetar o <strong className="text-orange-300 font-semibold">{dish.name}</strong> em escala real 1:1 na sua mesa!
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center mx-auto max-w-[220px] border-4 border-orange-500/30">
          <QRCodeSVG
            value={directARUrl}
            size={180}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: dish.image_url,
              x: undefined,
              y: undefined,
              height: 36,
              width: 36,
              excavate: true,
            }}
          />
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-slate-900">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>Aponte a Câmera do Celular</span>
          </div>
        </div>

        {/* Instructions Steps */}
        <div className="mt-5 space-y-2 bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <p className="text-xs text-slate-300">Abra a câmera do celular (iPhone ou Android) e mire no QR Code.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <p className="text-xs text-slate-300">Toque no link que surgir para abrir no navegador.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <p className="text-xs text-slate-300">Aponte a câmera para a mesa física para ver o modelo em 3D real!</p>
          </div>
        </div>

        {/* Copy Link Action */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Link do Prato Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copiar Link Direto do Prato</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => window.open(directARUrl, '_blank')}
            className="p-2.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 rounded-xl flex items-center justify-center transition-colors"
            title="Abrir link em nova aba"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
