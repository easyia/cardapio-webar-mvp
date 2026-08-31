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
  Plus, 
  Trash2, 
  Layers, 
  ShoppingBag, 
  Sliders,
  Wand2,
  Cpu
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
  // Multiple images state (1 to 4 angles)
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [generatedResult, setGeneratedResult] = useState<AI3DTaskResult | null>(null);
  const [apiKey, setApiKey] = useState(ai3DService.getApiKey());
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);

  // Quality Engine Mode
  const [qualityMode, setQualityMode] = useState<'ultra' | 'standard'>('ultra');

  // Scale state (default: 0.35)
  const [scale, setScale] = useState<number>(0.35);

  // Quick publish form fields inside the modal
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('24.00');
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
      ? 'Iniciando IA Neural v2.5 Ultra HD a partir da sua foto...' 
      : 'Iniciando Reconstrução Multi-Angular v2.5...'
    );

    try {
      const result = await ai3DService.generate3DFromMultipleImages(
        images, 
        (p, text) => {
          setProgress(p);
          setStatusText(text);
        },
        qualityMode
      );

      setGeneratedResult(result);
      if (result.dishSuggestion) {
        setDishName(result.dishSuggestion.name);
        setDishPrice(result.dishSuggestion.estimatedPrice.toString());
        setDishDescription(result.dishSuggestion.description);
        setDishCategory(categories[0]?.id || 'cat-01');
      }
      setIsGenerating(false);
    } catch (err: any) {
      alert(`Erro na geração 3D: ${err.message || 'Tente novamente com fotos mais nítidas.'}`);
      setIsGenerating(false);
    }
  };

  const handleSuperRefine = async () => {
    if (!generatedResult || !generatedResult.taskId) return;

    setIsRefining(true);
    setProgress(10);
    setStatusText('Iniciando Super Refinamento Neural HD...');

    try {
      const refined = await ai3DService.refine3DModel(
        generatedResult.taskId,
        (p, text) => {
          setProgress(p);
          setStatusText(text);
        }
      );

      setGeneratedResult({
        ...generatedResult,
        modelGlbUrl: refined.modelGlbUrl,
        modelUsdzUrl: refined.modelUsdzUrl,
        isRefined: true,
      });
      setIsRefining(false);
    } catch (err: any) {
      alert(`Aviso de refinamento: ${err.message || 'O modelo base foi preservado.'}`);
      setIsRefining(false);
    }
  };

  const handleSaveApiKey = () => {
    ai3DService.setApiKey(apiKey.trim());
    setShowApiKeySettings(false);
    alert('Chave de API salva com sucesso!');
  };

  // 1-Click Direct Publish to Menu
  const handleDirectPublish = () => {
    if (!generatedResult) return;

    const newDish: Omit<Dish, 'id' | 'created_at'> = {
      restaurant_id: storeService.getRestaurant().id,
      category_id: dishCategory || categories[0]?.id || 'cat-01',
      name: dishName.trim() || 'Item Escaneado em 3D',
      description: dishDescription.trim() || 'Modelo 3D foto-realista gerado por IA com suporte a Realidade Aumentada.',
      price: parseFloat(dishPrice.replace(',', '.')) || 24.00,
      image_url: generatedResult.previewImageUrl,
      model_3d_url: generatedResult.modelGlbUrl,
      usdz_url: generatedResult.modelUsdzUrl,
      scale: scale || 0.35,
      is_active: true,
      is_featured: true,
      is_chef_special: true,
      ar_ready: true,
      portion_size: 'Item Único',
      preparation_time: 'Pronto',
      calories: 0,
      ingredients: generatedResult.dishSuggestion?.ingredients || ['Acabamento de Alta Definição'],
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
    name: dishName || 'Modelo 3D Gerado por IA',
    description: dishDescription || 'Visualização 3D gerada automaticamente a partir das fotos do produto.',
    price: parseFloat(dishPrice.replace(',', '.')) || 24.00,
    image_url: generatedResult.previewImageUrl,
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
                  Estúdio IA 3D v2.5 Ultra HD
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  PBR 2K Engine
                </span>
              </div>
              <p className="text-xs text-[#A39E93]">
                Digitalize qualquer objeto (cafés, pratos, bonés, eletrônicos, garrafas) em 3D de alta fidelidade
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
          
          {/* STEP 1: Capture Photos & Setup */}
          {!generatedResult && !isGenerating && (
            <div className="space-y-5">
              
              {/* Quality Preset Toggle */}
              <div className="p-3 bg-[#0C0B0A] rounded-2xl border border-[#1E1B18] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">Modo de Fidelidade:</span>
                </div>
                <div className="flex items-center bg-[#161412] p-1 rounded-xl border border-[#2B2723] text-xs">
                  <button
                    type="button"
                    onClick={() => setQualityMode('ultra')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      qualityMode === 'ultra' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'text-[#A39E93]'
                    }`}
                  >
                    🌟 Ultra HD (50k polígonos + 2K PBR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQualityMode('standard')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      qualityMode === 'standard' ? 'bg-[#1E1B18] text-white' : 'text-[#A39E93]'
                    }`}
                  >
                    ⚡ Rápido
                  </button>
                </div>
              </div>

              {/* Photo Angles Grid (Up to 4 angles) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-[#FAF8F5] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Fotos Selecionadas ({images.length}/4)</span>
                  </label>
                  <span className="text-[11px] text-amber-400 font-bold">
                    {images.length === 0 ? 'Tire ou envie 1 foto' : `${images.length} foto(s) carregada(s)`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Render Uploaded Photos */}
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

                  {/* Add More Photos Slot */}
                  {images.length < 4 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-[#2B2723] hover:border-amber-500 bg-[#0C0B0A]/60 hover:bg-[#0C0B0A] flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                        {images.length === 0 ? <Camera className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                      <span className="text-[11px] font-bold text-white leading-tight">
                        {images.length === 0 ? 'Tirar ou Enviar Foto' : `+ Outro Ângulo (Opcional)`}
                      </span>
                      <span className="text-[9px] text-[#A39E93] mt-0.5">
                        {images.length === 0 ? 'Câmera do celular' : 'Lateral ou Topo'}
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

              {/* Specialized Scanning Guide for Complex Objects (Caps, Drones, Bottles, Dishes) */}
              <div className="p-4 bg-[#0C0B0A] border border-[#1E1B18] rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>Como escanear objetos complexos (Bonés, Drones, Eletrônicos) sem bugar:</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#A39E93]">
                  <div className="bg-[#161412] p-2.5 rounded-xl border border-[#1E1B18]">
                    <strong className="text-amber-300 block mb-0.5">1. Fundo Limpo e Neutro</strong>
                    Coloque o boné ou drone sobre uma mesa clara ou folha lisa, sem objetos ao redor.
                  </div>
                  <div className="bg-[#161412] p-2.5 rounded-xl border border-[#1E1B18]">
                    <strong className="text-amber-300 block mb-0.5">2. Iluminação Homogênea</strong>
                    Evite sombras duras ou reflexos de flash forte para que a IA entenda as bordas.
                  </div>
                  <div className="bg-[#161412] p-2.5 rounded-xl border border-[#1E1B18]">
                    <strong className="text-amber-300 block mb-0.5">3. 2 a 3 Fotos (Frente + Topo)</strong>
                    Para partes finas (hélices, aba do boné), envie 2 ou 3 ângulos para dar profundidade real.
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Processing Live Animation */}
          {(isGenerating || isRefining) && (
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
                  {progress}% concluído • Cluster Neural Tripo3D v2.5 PBR
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Generated 3D Result Inspection, Super Refine & Instant Publish */}
          {generatedResult && inspectionDish && !isRefining && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Check className="w-4 h-4" />
                  <span>Modelo 3D Foto-Realista Gerado com Sucesso!</span>
                </div>
                {generatedResult.isRefined ? (
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                    ✨ Super Refinado 2K
                  </span>
                ) : (
                  <span className="text-[10px] text-[#A39E93] font-mono">Dual AR Ready</span>
                )}
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

              {/* Super Refine CTA Banner */}
              {!generatedResult.isRefined && (
                <div className="p-3.5 bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-[#0C0B0A] border border-amber-500/40 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Wand2 className="w-5 h-5 text-amber-400 animate-pulse flex-shrink-0" />
                    <div>
                      <h5 className="text-xs font-black text-white">Deseja polir ainda mais os detalhes?</h5>
                      <p className="text-[10px] text-[#A39E93]">Executa o refinador neural para alisar imperfeições e sintetizar reflexos 2K.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSuperRefine}
                    className="py-2 px-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Polir em Super HD</span>
                  </button>
                </div>
              )}

              {/* Scale Control for Studio */}
              <div className="p-4 bg-[#0C0B0A] border border-amber-500/30 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#FAF8F5]">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Sliders className="w-4 h-4" />
                    <span>Ajustar Escala na Mesa do Cliente:</span>
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
                    25% (Xícara)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScale(0.38)}
                    className={`py-1 rounded-lg text-[10px] font-bold border ${scale === 0.38 ? 'bg-amber-600 text-white' : 'bg-[#161412] text-[#A39E93]'}`}
                  >
                    38% (Boné/Doce)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScale(0.55)}
                    className={`py-1 rounded-lg text-[10px] font-bold border ${scale === 0.55 ? 'bg-amber-600 text-white' : 'bg-[#161412] text-[#A39E93]'}`}
                  >
                    55% (Drone/Prato)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScale(0.85)}
                    className={`py-1 rounded-lg text-[10px] font-bold border ${scale === 0.85 ? 'bg-amber-600 text-white' : 'bg-[#161412] text-[#A39E93]'}`}
                  >
                    85% (Grande)
                  </button>
                </div>
              </div>

              {/* Quick Details Editor for 1-Click Publishing */}
              <div className="p-4 bg-[#0C0B0A] border border-[#1E1B18] rounded-2xl space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Informações para Publicação no Cardápio:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-[#A39E93] uppercase mb-1">Nome do Item</label>
                    <input
                      type="text"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      placeholder="Ex: Drone Quadcopter 4K ou Boné Trucker"
                      className="w-full px-3 py-2 bg-[#161412] border border-[#1E1B18] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#A39E93] uppercase mb-1">Preço (R$)</label>
                    <input
                      type="text"
                      value={dishPrice}
                      onChange={(e) => setDishPrice(e.target.value)}
                      placeholder="89.00"
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
                      placeholder="Descrição breve do item..."
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
                  <span>Processando Neural v2.5...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar em Ultra HD ({images.length} {images.length === 1 ? 'Foto' : 'Fotos'})</span>
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
