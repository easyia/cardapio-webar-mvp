import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  Sparkles, 
  Utensils
} from 'lucide-react';
import type { Restaurant } from '../../types';
import { getAccessibleUrl } from '../../utils/urlHelper';

interface QRCodeGeneratorProps {
  restaurant: Restaurant;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ restaurant }) => {
  const [selectedTable, setSelectedTable] = useState('01');
  const [isGeneralMenu, setIsGeneralMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const path = window.location.pathname;
  const qrUrl = isGeneralMenu
    ? getAccessibleUrl(`${path}?r=${restaurant.slug}`)
    : getAccessibleUrl(`${path}?r=${restaurant.slug}&mesa=${selectedTable}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('table-qr-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `QRCode-${restaurant.slug}-${isGeneralMenu ? 'Geral' : `Mesa-${selectedTable}`}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const tables = Array.from({ length: restaurant.tables_count || 20 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return num;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Settings Box (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Configurar QR Code
              </h3>
              <p className="text-xs text-slate-400">
                Gere displays para mesas ou cardápio geral
              </p>
            </div>
          </div>

          {/* Mode Selector (Mesa Específica vs Geral) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Destino do QR Code
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsGeneralMenu(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  !isGeneralMenu
                    ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Mesa Específica
              </button>

              <button
                type="button"
                onClick={() => setIsGeneralMenu(true)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  isGeneralMenu
                    ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Cardápio Geral
              </button>
            </div>
          </div>

          {/* Table Selector Grid */}
          {!isGeneralMenu && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Selecione a Mesa
              </label>
              <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-950 rounded-2xl border border-slate-800">
                {tables.map((tbl) => (
                  <button
                    key={tbl}
                    onClick={() => setSelectedTable(tbl)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedTable === tbl
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Mesa {tbl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* URL preview & Copy */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              URL de Destino
            </label>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
              <span className="text-xs text-slate-300 font-mono truncate">
                {qrUrl}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex-shrink-0 transition-colors"
                title="Copiar Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleDownloadSVG}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-orange-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Baixar QR Code Vetorial (.SVG)</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Display de Mesa</span>
            </button>
          </div>
        </div>

        {/* Right Print Ready Display Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950/60 p-6 rounded-3xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Pré-visualização do Display de Mesa (Acrílico / Papel)
          </span>

          {/* High-end Restaurant Table Card Ready for Print */}
          <div 
            ref={printRef}
            className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-black p-6 rounded-3xl border-2 border-orange-500/30 shadow-2xl text-center flex flex-col items-center justify-between relative overflow-hidden"
          >
            {/* Ambient Back Glow */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Restaurant Logo & Table Title */}
            <div className="flex flex-col items-center space-y-2">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500/50 shadow-lg"
              />
              <div>
                <h4 className="text-lg font-black text-white font-heading">
                  {restaurant.name}
                </h4>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-extrabold mt-1">
                  <Utensils className="w-3 h-3" />
                  <span>{isGeneralMenu ? 'Cardápio Digital' : `MESA ${selectedTable}`}</span>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="my-5 p-4 bg-white rounded-2xl shadow-2xl border-4 border-slate-800 max-w-[210px]">
              <QRCodeSVG
                id="table-qr-svg"
                value={qrUrl}
                size={170}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: restaurant.logo_url,
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  excavate: true,
                }}
              />
            </div>

            {/* Instructions */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cardápio em Realidade Aumentada</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Aponte a câmera do seu celular para ver os pratos em 3D sobre a sua mesa e faça seu pedido instantâneo.
              </p>
            </div>

            {/* Wi-Fi footer */}
            {restaurant.wifi_name && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 w-full text-[10px] text-slate-400 flex items-center justify-center gap-3">
                <span>Wi-Fi: <strong className="text-slate-200">{restaurant.wifi_name}</strong></span>
                <span>•</span>
                <span>Senha: <strong className="text-slate-200">{restaurant.wifi_password}</strong></span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
