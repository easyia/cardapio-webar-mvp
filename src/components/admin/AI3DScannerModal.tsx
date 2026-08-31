import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Sparkles, 
  Check, 
  Loader2, 
  Box, 
  RotateCw, 
  ArrowRight, 
  Info, 
  Key 
} from 'lucide-react';
import { ai3DService } from '../../services/ai3DService';
import type { AI3DTaskResult } from '../../services/ai3DService';
import { ModelViewer3D } from '../ar/ModelViewer3D';
import type { Dish } from '../../types';

interface AI3DScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply3DModel: (result: AI3DTaskResult) => void;
}

export const AI3DScannerModal: React.FC<AI3DScannerModalProps> = ({
  isOpen,
  onClose,
  onApply3DModel,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [generatedResult, setGeneratedResult] = useState<AI3DTaskResult | null>(null);
  const [apiKey, setApiKey] = useState(ai3DService.getApiKey());
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setGeneratedResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartGeneration = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setProgress(5);
    setStatusText('Iniciando IA Generativa 3D...');

    try {
      const result = await ai3DService.generate3DFromImage(selectedImage, (p, text) => {
        setProgress(p);
        setStatusText(text);
      });

      setGeneratedResult(result);
      setIsGenerating(false);
    } catch (err: any) {
      alert(`Erro na geração 3D: ${err.message || 'Tente novamente com outra foto.'}`);
      setIsGenerating(false);
    }
  };

  const handleSaveApiKey = () => {
    ai3DService.setApiKey(apiKey.trim());
    setShowApiKeySettings(false);
    alert('Chave de API salva com sucesso!');
  };

  // Sample dummy dish for inspecting generated 3D model
  const inspectionDish: Dish | null = generatedResult ? {
    id: 'generated-temp',
    category_id: 'cat-01',
    restaurant_id: 'rest-01',
    name: 'Modelo 3D Gerado por IA',
    description: 'Visualização 3D gerada automaticamente a partir da foto do produto.',
    price: 25.00,
    image_url: generatedResult.previewImageUrl,
    model_3d_url: generatedResult.modelGlbUrl,
    usdz_url: generatedResult.modelUsdzUrl,
    is_active: true,
    created_at: new Date().toISOString(),
  } : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-orange-500/30 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/25">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-heading">
                  Estúdio IA: Foto ➔ Modelo 3D & WebAR
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  v1.0 Produção
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tire uma foto do café/prato para gerar a malha 3D volumétrica em segundos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApiKeySettings(!showApiKeySettings)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Configurar Chave de API de IA (Tripo3D / Meshy)"
            >
              <Key className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Modal Drawer */}
        {showApiKeySettings && (
          <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-orange-400" />
                <span>Configuração de API de IA 3D (Opcional)</span>
              </span>
              <span className="text-[10px] text-emerald-400">Sandbox Ativa</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              O sistema possui um cluster neural embutido para testes imediatos. Se desejar usar sua própria conta da <strong>Tripo3D</strong> ou <strong>Meshy.ai</strong>, insira sua API Key abaixo:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Insira sua Tripo3D API Key (ex: tripo_sk_...)"
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSaveApiKey}
                className="py-2 px-4 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Salvar Chave
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Capture or Select Photo */}
          {!generatedResult && !isGenerating && (
            <div className="space-y-5">
              
              {/* Photo Preview or Upload Zone */}
              {selectedImage ? (
                <div className="relative aspect-video max-h-72 w-full rounded-2xl overflow-hidden border-2 border-orange-500/40 shadow-xl bg-slate-950">
                  <img
                    src={selectedImage}
                    alt="Foto selecionada"
                    className="w-full h-full object-contain"
                  />

                  {/* Reticle Guide Overlay */}
                  <div className="absolute inset-0 border border-orange-500/20 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-dashed border-orange-400/40 rounded-full animate-pulse-subtle flex items-center justify-center">
                      <span className="text-[10px] bg-slate-950/80 px-2 py-0.5 rounded-full text-orange-300 font-bold">
                        Ângulo 45° Ideal
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 shadow-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Trocar Foto</span>
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video max-h-64 w-full rounded-2xl border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-950/60 hover:bg-slate-950 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    Tire uma Foto ou Faça Upload do Produto
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Toque para abrir a câmera do smartphone ou selecionar uma foto da galeria
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-900 text-[11px] font-semibold text-slate-300 rounded-lg border border-slate-800">
                      ☕ Xícaras & Cafés
                    </span>
                    <span className="px-3 py-1 bg-slate-900 text-[11px] font-semibold text-slate-300 rounded-lg border border-slate-800">
                      🥐 Doces & Pratos
                    </span>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Photography Pro Tips */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>Dicas para Máxima Fidelidade 3D:</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Tire a foto em um ângulo de <strong>45 graus</strong> (mostrando a parte de cima e a lateral da xícara/prato).</li>
                  <li>Prefira locais com <strong>boa iluminação natural</strong> sobre a mesa.</li>
                  <li>Evite fundos muito poluídos para facilitar o corte automático da IA.</li>
                </ul>
              </div>

            </div>
          )}

          {/* STEP 2: Processing Live Animation */}
          {isGenerating && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Box className="w-10 h-10 text-orange-400 animate-bounce" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h4 className="text-base font-extrabold text-white font-heading">
                  {statusText}
                </h4>
                <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {progress}% concluído • Reconstrução Neural 3D
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Generated 3D Result Inspection */}
          {generatedResult && inspectionDish && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Check className="w-4 h-4" />
                  <span>Modelo 3D Gerado com Sucesso!</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Pronto para WebAR (GLB + USDZ)</span>
              </div>

              {/* 3D Interactive Inspection Viewport */}
              <div className="h-72 w-full rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-slate-950">
                <ModelViewer3D
                  dish={inspectionDish}
                  className="w-full h-full"
                  showControls={true}
                />
              </div>

              {/* Specs and AI suggestions */}
              {generatedResult.dishSuggestion && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2">
                  <span className="font-bold text-white block">Sugestão de Cardápio por IA:</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div><strong>Nome sugerido:</strong> {generatedResult.dishSuggestion.name}</div>
                    <div><strong>Preço sugerido:</strong> R$ {generatedResult.dishSuggestion.estimatedPrice.toFixed(2)}</div>
                  </div>
                  <p className="text-slate-400">{generatedResult.dishSuggestion.description}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Cancelar
          </button>

          {!generatedResult ? (
            <button
              onClick={handleStartGeneration}
              disabled={!selectedImage || isGenerating}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all transform active:scale-98 disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando 3D...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Modelo 3D com IA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                onApply3DModel(generatedResult);
                onClose();
              }}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all transform active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>Aplicar este Modelo 3D ao Prato</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
