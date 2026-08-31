import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Box, 
  ImageIcon, 
  Check,
  Wand2,
  Sliders
} from 'lucide-react';
import type { Dish, Category } from '../../types';
import { ModelViewer3D } from '../ar/ModelViewer3D';
import { AI3DScannerModal } from './AI3DScannerModal';
import type { AI3DTaskResult } from '../../services/ai3DService';

interface DishFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dishData: Omit<Dish, 'id' | 'created_at'>, dishId?: string) => void;
  dishToEdit?: Dish | null;
  categories: Category[];
  restaurantId: string;
}

export const DishFormModal: React.FC<DishFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dishToEdit,
  categories,
  restaurantId,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [model3dUrl, setModel3dUrl] = useState('');
  const [usdzUrl, setUsdzUrl] = useState('');
  const [scale, setScale] = useState<number>(0.35);
  const [portionSize, setPortionSize] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [calories, setCalories] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  
  // Toggles
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);

  // AI Scanner Studio Modal
  const [isAIScannerOpen, setIsAIScannerOpen] = useState(false);

  useEffect(() => {
    if (dishToEdit) {
      setName(dishToEdit.name);
      setCategoryId(dishToEdit.category_id);
      setPrice(dishToEdit.price.toString());
      setOriginalPrice(dishToEdit.original_price ? dishToEdit.original_price.toString() : '');
      setDescription(dishToEdit.description);
      setImageUrl(dishToEdit.image_url);
      setModel3dUrl(dishToEdit.model_3d_url);
      setUsdzUrl(dishToEdit.usdz_url || '');
      setScale(dishToEdit.scale || 0.35);
      setPortionSize(dishToEdit.portion_size || '');
      setPreparationTime(dishToEdit.preparation_time || '');
      setCalories(dishToEdit.calories ? dishToEdit.calories.toString() : '');
      setIngredientsText(dishToEdit.ingredients ? dishToEdit.ingredients.join(', ') : '');
      setIsActive(dishToEdit.is_active);
      setIsFeatured(dishToEdit.is_featured || false);
      setIsChefSpecial(dishToEdit.is_chef_special || false);
      setIsVegetarian(dishToEdit.is_vegetarian || false);
      setIsGlutenFree(dishToEdit.is_gluten_free || false);
    } else {
      // Default new dish values
      setName('');
      setCategoryId(categories[0]?.id || '');
      setPrice('22.00');
      setOriginalPrice('');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80');
      setModel3dUrl('https://modelviewer.dev/shared-assets/models/shishkebab.glb');
      setUsdzUrl('https://modelviewer.dev/shared-assets/models/shishkebab.usdz');
      setScale(0.35);
      setPortionSize('220ml');
      setPreparationTime('5 min');
      setCalories('150');
      setIngredientsText('Café 100% Arábica, Leite vaporizado, Canela');
      setIsActive(true);
      setIsFeatured(false);
      setIsChefSpecial(false);
      setIsVegetarian(false);
      setIsGlutenFree(false);
    }
  }, [dishToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleModelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModel3dUrl(url);
    }
  };

  const handleApplyAIResult = (result: AI3DTaskResult) => {
    setImageUrl(result.previewImageUrl);
    setModel3dUrl(result.modelGlbUrl);
    setUsdzUrl(result.modelUsdzUrl);

    if (result.dishSuggestion) {
      if (!name) setName(result.dishSuggestion.name);
      if (!description) setDescription(result.dishSuggestion.description);
      if (!price) setPrice(result.dishSuggestion.estimatedPrice.toString());
      if (result.dishSuggestion.ingredients?.length) {
        setIngredientsText(result.dishSuggestion.ingredients.join(', '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      alert('Por favor, preencha o Nome, Categoria e Preço do prato.');
      return;
    }

    const ingredients = ingredientsText
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);

    const dishPayload: Omit<Dish, 'id' | 'created_at'> = {
      restaurant_id: restaurantId,
      category_id: categoryId,
      name,
      description,
      price: parseFloat(price.replace(',', '.')) || 0,
      original_price: originalPrice ? parseFloat(originalPrice.replace(',', '.')) : undefined,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80',
      model_3d_url: model3dUrl || 'https://modelviewer.dev/shared-assets/models/shishkebab.glb',
      usdz_url: usdzUrl || 'https://modelviewer.dev/shared-assets/models/shishkebab.usdz',
      ar_ready: true,
      scale: scale || 0.35,
      portion_size: portionSize,
      preparation_time: preparationTime,
      calories: calories ? parseInt(calories, 10) : undefined,
      ingredients,
      is_active: isActive,
      is_featured: isFeatured,
      is_chef_special: isChefSpecial,
      is_vegetarian: isVegetarian,
      is_gluten_free: isGlutenFree,
    };

    onSave(dishPayload, dishToEdit?.id);
    onClose();
  };

  // Dummy dish representation for live 3D preview
  const previewDish: Dish = {
    id: dishToEdit?.id || 'preview-dish',
    category_id: categoryId,
    restaurant_id: restaurantId,
    name: name || 'Pré-visualização do Prato',
    description: description || 'Descrição do modelo 3D em tempo real.',
    price: parseFloat(price.replace(',', '.')) || 0,
    image_url: imageUrl,
    model_3d_url: model3dUrl,
    usdz_url: usdzUrl,
    scale: scale,
    is_active: isActive,
    created_at: new Date().toISOString(),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#161412] border border-[#1E1B18] rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0C0B0A] border-b border-[#1E1B18] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-heading">
                {dishToEdit ? 'Editar Prato & Modelo 3D' : 'Cadastrar Novo Prato com WebAR'}
              </h3>
              <p className="text-xs text-[#A39E93]">
                Gere o modelo 3D com IA a partir de fotos ou faça upload direto
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#1E1B18] text-[#A39E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Generator Hero Banner inside Form */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-[#0C0B0A] border-b border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Wand2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white font-heading">
                Automatizar com IA: Foto do Celular ➔ Modelo 3D
              </h4>
              <p className="text-xs text-slate-300">
                Tire fotos do café ou doce e nossa IA gera a malha 3D e texturas automaticamente
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAIScannerOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all transform active:scale-98 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Abrir Estúdio IA 3D</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Basic Info & Medias (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Dish Name */}
              <div>
                <label className="block text-xs font-bold text-[#A39E93] uppercase tracking-wider mb-1">
                  Nome do Prato / Bebida *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Cappuccino Italiano com Canela"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0C0B0A] border border-[#1E1B18] rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category & Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#A39E93] uppercase tracking-wider mb-1">
                    Categoria *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0C0B0A] border border-[#1E1B18] rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A39E93] uppercase tracking-wider mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="18.90"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#0C0B0A] border border-[#1E1B18] rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A39E93] uppercase tracking-wider mb-1">
                    De (R$ Riscado)
                  </label>
                  <input
                    type="text"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="22.00"
                    className="w-full px-3.5 py-2.5 bg-[#0C0B0A] border border-[#1E1B18] rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#A39E93] uppercase tracking-wider mb-1">
                  Descrição Sensorial
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o sabor, grãos, textura da espuma ou ingredientes nobres..."
                  className="w-full px-3.5 py-2.5 bg-[#0C0B0A] border border-[#1E1B18] rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 3D Scale Slider Control */}
              <div className="p-4 rounded-2xl bg-[#0C0B0A] border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" />
                    <span>Ajuste da Escala 3D na Mesa</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-[#161412] px-2.5 py-0.5 rounded-lg border border-[#2B2723]">
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

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScale(0.25)}
                    className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                      scale === 0.25 ? 'bg-amber-600 text-white border-amber-400' : 'bg-[#161412] text-[#A39E93] border-[#1E1B18]'
                    }`}
                  >
                    ☕ Xícara (25%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScale(0.35)}
                    className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                      scale === 0.35 ? 'bg-amber-600 text-white border-amber-400' : 'bg-[#161412] text-[#A39E93] border-[#1E1B18]'
                    }`}
                  >
                    🥐 Doce (35%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScale(0.55)}
                    className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                      scale === 0.55 ? 'bg-amber-600 text-white border-amber-400' : 'bg-[#161412] text-[#A39E93] border-[#1E1B18]'
                    }`}
                  >
                    🍽️ Prato (55%)
                  </button>
                </div>
              </div>

              {/* 3D Model Sources (GLB & USDZ) */}
              <div className="p-4 rounded-2xl bg-[#0C0B0A] border border-[#1E1B18] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Modelos 3D para WebAR (Android & iOS)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Dual Engine 1:1</span>
                </div>

                <div>
                  <label className="block text-[11px] text-[#A39E93] mb-1 font-mono">
                    Arquivo .GLB (Android Scene Viewer)
                  </label>
                  <input
                    type="text"
                    value={model3dUrl}
                    onChange={(e) => setModel3dUrl(e.target.value)}
                    placeholder="https://.../cappuccino.glb"
                    className="w-full px-3.5 py-2 bg-[#161412] border border-[#1E1B18] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#A39E93] mb-1 font-mono">
                    Arquivo .USDZ (Apple iOS Quick Look)
                  </label>
                  <input
                    type="text"
                    value={usdzUrl}
                    onChange={(e) => setUsdzUrl(e.target.value)}
                    placeholder="https://.../cappuccino.usdz"
                    className="w-full px-3.5 py-2 bg-[#161412] border border-[#1E1B18] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <label className="flex-1 cursor-pointer py-2 px-3 rounded-xl bg-[#161412] hover:bg-[#1E1B18] border border-[#2B2723] text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload de arquivo .GLB local</span>
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      onChange={handleModelFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 2D Photo Source */}
              <div className="p-4 rounded-2xl bg-[#0C0B0A] border border-[#1E1B18] space-y-3">
                <span className="text-xs font-bold text-[#A39E93] uppercase tracking-wider block">
                  Foto de Capa 2D
                </span>

                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL da foto (ex: https://images.unsplash.com/...)"
                  className="w-full px-3.5 py-2 bg-[#161412] border border-[#1E1B18] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />

                <label className="cursor-pointer py-2 px-3 rounded-xl bg-[#161412] hover:bg-[#1E1B18] border border-[#2B2723] text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Upload de Foto do Celular/Computador</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Additional specs (Portion, Prep time, Calories, Ingredients) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#A39E93] uppercase tracking-wider mb-1">
                    Porção
                  </label>
                  <input
                    type="text"
                    value={portionSize}
                    onChange={(e) => setPortionSize(e.target.value)}
                    placeholder="Ex: 220ml"
                    className="w-full px-3 py-2 bg-[#0C0B0A] border border-[#1E1B18] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#A39E93] uppercase tracking-wider mb-1">
                    Tempo de Preparo
                  </label>
                  <input
                    type="text"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    placeholder="Ex: 5 min"
                    className="w-full px-3 py-2 bg-[#0C0B0A] border border-[#1E1B18] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#A39E93] uppercase tracking-wider mb-1">
                    Calorias (kcal)
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="Ex: 145"
                    className="w-full px-3 py-2 bg-[#0C0B0A] border border-[#1E1B18] rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Ingredients comma separated */}
              <div>
                <label className="block text-[11px] font-bold text-[#A39E93] uppercase tracking-wider mb-1">
                  Ingredientes & Notas Sensoriais
                </label>
                <input
                  type="text"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  placeholder="Café arábica bourbon amarelo, Leite vaporizado, Canela do Ceilão..."
                  className="w-full px-3 py-2 bg-[#0C0B0A] border border-[#1E1B18] rounded-xl text-xs text-white"
                />
              </div>

              {/* Badges Toggles */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-[#0C0B0A] text-[#716B61] border-[#1E1B18]'
                  }`}
                >
                  {isActive ? '✓ Disponível no Cardápio' : '✕ Pausado / Esgotado'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsChefSpecial(!isChefSpecial)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    isChefSpecial ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-[#0C0B0A] text-[#716B61] border-[#1E1B18]'
                  }`}
                >
                  ⭐ Especialidade da Casa
                </button>

                <button
                  type="button"
                  onClick={() => setIsVegetarian(!isVegetarian)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    isVegetarian ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-[#0C0B0A] text-[#716B61] border-[#1E1B18]'
                  }`}
                >
                  🌱 Vegetariano
                </button>

                <button
                  type="button"
                  onClick={() => setIsGlutenFree(!isGlutenFree)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    isGlutenFree ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' : 'bg-[#0C0B0A] text-[#716B61] border-[#1E1B18]'
                  }`}
                >
                  🌾 Sem Glúten
                </button>
              </div>
            </div>

            {/* Right Column: Live 3D WebAR Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-[#0C0B0A] border border-[#1E1B18] rounded-2xl p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Preview 3D na Escala Real
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#161412] text-[#A39E93] font-mono">
                    {Math.round(scale * 100)}%
                  </span>
                </div>

                <div className="flex-1 min-h-[280px] relative rounded-xl overflow-hidden border border-[#1E1B18] bg-[#161412]">
                  <ModelViewer3D
                    dish={previewDish}
                    className="w-full h-full"
                    showControls={true}
                    initialScale={scale}
                    onScaleChange={setScale}
                  />
                </div>

                <div className="mt-3 p-3 rounded-xl bg-[#161412] border border-[#1E1B18] text-[11px] text-[#A39E93] space-y-1">
                  💡 <strong className="text-white">Escala na Mesa:</strong> Use o controle para ajustar o tamanho proporcional do objeto. O valor é salvo no prato e respeitado no celular do cliente.
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#1E1B18] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-[#1E1B18] hover:bg-[#2B2723] text-slate-300 text-xs font-bold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black shadow-lg shadow-amber-600/25 transition-all transform active:scale-98 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{dishToEdit ? 'Salvar Alterações' : 'Publicar no Cardápio'}</span>
            </button>
          </div>
        </form>

        {/* AI 3D Scanner Modal */}
        <AI3DScannerModal
          isOpen={isAIScannerOpen}
          onClose={() => setIsAIScannerOpen(false)}
          onApply3DModel={handleApplyAIResult}
        />
      </div>
    </div>
  );
};
