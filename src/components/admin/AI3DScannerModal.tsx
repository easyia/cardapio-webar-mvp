import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Sparkles, 
  Check, 
  Loader2, 
  Box, 
  ArrowRight, 
  Info, 
  Key, 
  ShoppingBag, 
  Sliders,
  Layers,
  Plus,
  Trash2
} from 'lucide-react';
import { ai3DService } from '../../services/ai3DService';
import type { AI3DTaskResult } from '../../services/ai3DService';
import { ModelViewer3D } from '../ar/ModelViewer3D';
import type { Dish, Category } from '../../types';
import { storeService } from '../../services/storeService';

interface AI3DScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply3DModel?: (result: AI3DTaskResult) => void;
}

export const AI3DScannerModal: React.FC<AI3DScannerModalProps> = ({
  isOpen,
  onClose,
  onApply3DModel,
}) => {
  // Photos state (1 to 4 photos)
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [generatedResult, setGeneratedResult] = useState<AI3DTaskResult | null>(null);
  const [apiKey, setApiKey] = useState(ai3DService.getApiKey());
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);

  // Scale state (default: 0.35)
  const [scale, setScale] = useState<number>(0.35);

  // Quick publish form fields inside the modal (Auto-identified by AI)
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('28.00');
  const [dishCategory, setDishCategory] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories: Category[] = storeService.getCategories();

  if (!isOpen) return null;

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prev => {
          if (prev.length >= 4) return prev;
          return [...prev, reader.result as string];
        });
        setGeneratedResult(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setGeneratedResult(null);
  };

  const handleStartGeneration = async () => {
    if (!images.length) return;

    setIsGenerating(true);
    setProgress(5);
    setStatusText(images.length === 1 
      ? 'Iniciando reconstrução 3D a partir da foto...' 
      : 'Iniciando reconstrução 3D multi-angular...'
    );

    try {
      const result = await ai3DService.generate3DFromMultipleImages(images, (p, text) => {
        setProgress(p);
        setStatusText(text);
      });

      setGeneratedResult(result);
      if (result.dishSuggestion) {
        setDishName(dishName || result.dishSuggestion.name);
        setDishPrice(dishPrice || result.dishSuggestion.estimatedPrice.toString());
        setDishDescription(dishDescription || result.dishSuggestion.description);
        setDishCategory(categories[0]?.id || 'cat-01');
        if (result.dishSuggestion.suggestedScale) {
          setScale(result.dishSuggestion.suggestedScale);
        }
      }
      setIsGenerating(false);
    } catch (err: any) {
      alert(`Erro na geração 3D: ${err.message || 'Tente novamente com uma foto mais nítida a 45°.'}`);
      setIsGenerating(false);
    }
  };

  const handleSaveApiKey = () => {
    ai3DService.setApiKey(apiKey.trim());
    setShowApiKeySettings(false);
    alert('Chave de API salva com sucesso!');
  };

  // 1-Click Direct Publish to Menu
  const handleDirectPublish = () => {
    if (!generatedResult || !images.length) return;

    const newDish: Omit<Dish, 'id' | 'created_at'> = {
      restaurant_id: storeService.getRestaurant().id,
      category_id: dishCategory || categories[0]?.id || 'cat-01',
      name: dishName.trim() || 'Prato Especial em 3D',
      description: dishDescription.trim() || 'Modelo 3D gerado a partir da foto com suporte a Realidade Aumentada.',
      price: parseFloat(dishPrice.replace(',', '.')) || 28.00,
      image_url: generatedResult.previewImageUrl || images[0],
      model_3d_url: generatedResult.modelGlbUrl,
      usdz_url: generatedResult.modelUsdzUrl,
      scale: scale || 0.35,
      is_active: true,
      is_featured: true,
      is_chef_special: true,
      ar_ready: true,
      portion_size: 'Porção Individual',
      preparation_time: '12 min',
      calories: 220,
      ingredients: generatedResult.dishSuggestion?.ingredients || ['Ingredientes selecionados'],
    };

    storeService.addDish(newDish);
    setPublishedSuccess(true);

    if (onApply3DModel) {
      onApply3DModel(generatedResult);
    }

    setTimeout(() => {
      setPublishedSuccess(false);
      onClose();
    }, 1200);
  };

  // Sample dummy dish for inspecting generated 3D model
  const inspectionDish: Dish | null = generatedResult ? {
    id: 'generated-temp',
    category_id: dishCategory || 'cat-01',
    restaurant_id: 'rest-01',
    name: dishName || 'Modelo 3D Gerado',
    description: dishDescription || 'Visualização 3D gerada a partir da foto.',
    price: parseFloat(dishPrice.replace(',', '.')) || 28.00,
    image_url: generatedResult.previewImageUrl || images[0],
    model_3d_url: generatedResult.modelGlbUrl,
    usdz_url: generatedResult.modelUsdzUrl,
    scale: scale,
    is_active: true,
    ar_ready: true,
    created_at: new Date().toISOString(),
  } : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#161412] border-2 border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0C0B0A] border-b border-[#1E1B18] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-lg shadow-amber-600/25">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-heading">
                  Estúdio IA: Foto ➔ Modelo 3D & WebAR
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  1 a 4 Fotos
                </span>
              </div>
              <p className="text-xs text-[#A39E93]">
                Envie de 1 a 4 fotos (1 foto já é suficiente, fotos extras trazem visão 360°)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApiKeySettings(!showApiKeySettings)}
              className="p-2 rounded-xl bg-[#1E1B18] hover:bg-[#2B2723] text-[#A39E93] hover:text-white transition-colors"
              title="Configurar Chave de API de IA"
            >
              <Key className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#1E1B18] text-[#A39E93] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Modal Drawer */}
        {showApiKeySettings && (
          <div className="p-4 bg-[#0C0B0A] border-b border-[#1E1B18] space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Chave Tripo3D API</span>
              </span>
              <span className="text-[10px] text-emerald-400">Serverless Ativo</span>
            </div>
            <p className="text-[11px] text-[#A39E93] leading-relaxed">
              Você pode configurar a chave <code>TRIPO_API_KEY</code> diretamente na Vercel ou colar sua chave da Tripo3D abaixo:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Insira sua Tripo3D API Key (ex: tripo_sk_...)"
                className="flex-1 px-3 py-2 bg-[#161412] border border-[#1E1B18] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSaveApiKey}
                className="py-2 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Salvar Chave
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Select 1 to 4 Photos */}
          {!generatedResult && !isGenerating && (
            <div className="space-y-5">
              
              {/* Photo Upload Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#FAF8F5] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Fotos do Produto ({images.length}/4)</span>
                  </label>
                  <span className="text-[11px] text-amber-400 font-bold">
                    {images.length === 0 ? 'Tire 1 foto a 45°' : `${images.length} foto(s) pronta(s)`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-[#0C0B0A] group">
                      <img src={img} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#0C0B0A]/85 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        {index === 0 ? 'Foto Principal' : `Ângulo ${index + 1}`}
                      </div>
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-950/90 text-rose-300 hover:text-white border border-rose-600 transition-colors shadow-md"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {images.length < 4 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-[#2B2723] hover:border-amber-500 bg-[#0C0B0A]/60 hover:bg-[#0C0B0A] flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                        {images.length === 0 ? <Camera className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                      <span className="text-[11px] font-bold text-white leading-tight">
                        {images.length === 0 ? 'Tirar Foto' : '+ Outro Ângulo'}
                      </span>
                      <span className="text-[9px] text-[#A39E93] mt-0.5">
                        {images.length === 0 ? 'Frente a 45°' : 'Opcional 360°'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleAddPhotos}
                className="hidden"
              />

              {/* Guidance Box */}
              <div className="p-4 bg-[#0C0B0A] border border-[#1E1B18] rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>Dica para melhor resultado 3D:</span>
                </div>
                <p className="text-xs text-[#A39E93] leading-relaxed">
                  Tire a foto a <strong>45 graus</strong> centralizando o prato ou a xícara inteira. A IA identifica o item e reconstrói o modelo fiel à foto.
                </p>
              </div>

            </div>
          )}

          {/* STEP 2: Processing Animation */}
          {isGenerating && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Box className="w-10 h-10 text-amber-400 animate-bounce" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h4 className="text-base font-extrabold text-white font-heading">
                  {statusText}
                </h4>
                <div className="w-full bg-[#0C0B0A] rounded-full h-3 border border-[#1E1B18] overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-[#A39E93] font-mono">
                  {progress}% concluído • Processamento 3D
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Generated 3D Result Inspection & Quick Publish */}
          {generatedResult && inspectionDish && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Check className="w-4 h-4" />
                  <span>Modelo 3D Gerado com Sucesso!</span>
                </div>
                <span className="text-[10px] text-[#A39E93] font-mono">Dual AR Ready</span>
              </div>

              {/* 3D Interactive Inspection Viewport */}
              <div className="h-64 w-full rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl bg-[#0C0B0A]">
                <ModelViewer3D
                  dish={inspectionDish}
                  className="w-full h-full"
                  showControls={true}
                  initialScale={scale}
                  onScaleChange={setScale}
                />
              </div>

              {/* Scale Control */}
              <div className="p-4 bg-[#0C0B0A] border border-amber-500/30 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#FAF8F5]">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Sliders className="w-4 h-4" />
                    <span>Ajustar Tamanho na Mesa Física:</span>
                  </span>
                  <span className="font-mono bg-[#161412] px-2 py-0.5 rounded-md border border-[#2B2723]">
                    {Math.round(scale * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="1.2"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-[#161412] rounded-lg"
                />

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setScale(0.25)}
                    className={`py-1 rounded-lg text-[10px] font-bold border ${scale === 0.25 ? 'bg-amber-600 text-white' : 'bg-[#161412] text-[#A39E93]'}`}
                  >
                    25% (Café)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScale(0.35)}
                    className={`py-1 rounded-lg text-[10px] font-bold border ${scale === 0.35 ? 'bg-amber-600 text-white' : 'bg-[#161412] text-[#A39E93]'}`}
                  >
                    35% (Prato)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScale(0.50)}
                    className={`py-1 rounded-lg text-[10px] font-bold border ${scale === 0.50 ? 'bg-amber-600 text-white' : 'bg-[#161412] text-[#A39E93]'}`}
                  >
                    50% (Pizza)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScale(0.75)}
                    className={`py-1 rounded-lg text-[10px] font-bold border ${scale === 0.75 ? 'bg-amber-600 text-white' : 'bg-[#161412] text-[#A39E93]'}`}
                  >
                    75% (Grande)
                  </button>
                </div>
              </div>

              {/* Quick Details Editor for 1-Click Publishing (Pre-filled by AI) */}
              <div className="p-4 bg-[#0C0B0A] border border-[#1E1B18] rounded-2xl space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Informações Identificadas para o Cardápio:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-[#A39E93] uppercase mb-1">Nome do Prato</label>
                    <input
                      type="text"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      placeholder="Ex: Tapioca Especial da Casa"
                      className="w-full px-3 py-2 bg-[#161412] border border-[#1E1B18] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#A39E93] uppercase mb-1">Preço (R$)</label>
                    <input
                      type="text"
                      value={dishPrice}
                      onChange={(e) => setDishPrice(e.target.value)}
                      placeholder="28.00"
                      className="w-full px-3 py-2 bg-[#161412] border border-[#1E1B18] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#A39E93] uppercase mb-1">Categoria</label>
                    <select
                      value={dishCategory}
                      onChange={(e) => setDishCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-[#161412] border border-[#1E1B18] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#A39E93] uppercase mb-1">Descrição</label>
                    <input
                      type="text"
                      value={dishDescription}
                      onChange={(e) => setDishDescription(e.target.value)}
                      placeholder="Descrição dos sabores e ingredientes..."
                      className="w-full px-3 py-2 bg-[#161412] border border-[#1E1B18] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-[#0C0B0A] border-t border-[#1E1B18] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-[#1E1B18] hover:bg-[#2B2723] text-[#A39E93] text-xs font-bold transition-colors"
          >
            Cancelar
          </button>

          {!generatedResult ? (
            <button
              onClick={handleStartGeneration}
              disabled={!images.length || isGenerating}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/25 flex items-center gap-2 transition-all transform active:scale-98 disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando Modelo 3D...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Modelo 3D ({images.length} {images.length === 1 ? 'Foto' : 'Fotos'})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDirectPublish}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all transform active:scale-98"
            >
              {publishedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Publicado no Cardápio!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Publicar no Cardápio Agora</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
