import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Box, 
  AlertCircle,
  Wand2
} from 'lucide-react';
import type { Dish, Category } from '../../types';
import { storeService } from '../../services/storeService';
import { DishFormModal } from './DishFormModal';
import { AI3DScannerModal } from './AI3DScannerModal';
import type { AI3DTaskResult } from '../../services/ai3DService';

interface DishesManagerProps {
  dishes: Dish[];
  categories: Category[];
  restaurantId: string;
  onPreviewDish: (dish: Dish) => void;
}

export const DishesManager: React.FC<DishesManagerProps> = ({
  dishes,
  categories,
  restaurantId,
  onPreviewDish,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isAIScannerOpen, setIsAIScannerOpen] = useState(false);

  const categoriesMap = new Map(categories.map(c => [c.id, c.name]));

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dish.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingDish(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dish: Dish) => {
    setEditingDish(dish);
    setIsModalOpen(true);
  };

  const handleSaveDish = (dishData: Omit<Dish, 'id' | 'created_at'>, dishId?: string) => {
    if (dishId) {
      storeService.updateDish(dishId, dishData);
    } else {
      storeService.addDish(dishData);
    }
  };

  const handleToggleActive = (dishId: string) => {
    storeService.toggleDishActive(dishId);
  };

  const handleDeleteDish = (dishId: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir "${name}" do cardápio?`)) {
      storeService.deleteDish(dishId);
    }
  };

  const handleQuickAI3DApply = (result: AI3DTaskResult) => {
    const newDishData: Omit<Dish, 'id' | 'created_at'> = {
      restaurant_id: restaurantId,
      category_id: categories[0]?.id || 'cat-01',
      name: result.dishSuggestion?.name || 'Novo Prato 3D por IA',
      description: result.dishSuggestion?.description || 'Prato cadastrado automaticamente com modelo 3D por IA.',
      price: result.dishSuggestion?.estimatedPrice || 22.00,
      image_url: result.previewImageUrl,
      model_3d_url: result.modelGlbUrl,
      usdz_url: result.modelUsdzUrl,
      portion_size: '200g / 220ml',
      preparation_time: '5 min',
      calories: 180,
      ingredients: result.dishSuggestion?.ingredients || ['Ingredientes frescos'],
      is_active: true,
      is_featured: true,
      is_chef_special: true,
    };

    storeService.addDish(newDishData);
    alert('Prato 3D gerado e publicado no cardápio com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Search, Category Filter & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar pratos ou cafés..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Category Select & Buttons */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-orange-500"
          >
            <option value="all">Todas Categorias</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>

          {/* AI 3D Scanner Button */}
          <button
            onClick={() => setIsAIScannerOpen(true)}
            className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-lg shadow-orange-500/25 transition-all flex-shrink-0"
            title="Tirar foto do produto e gerar 3D com IA"
          >
            <Wand2 className="w-4 h-4 animate-pulse" />
            <span className="hidden md:inline">Foto ➔ 3D IA</span>
            <span className="md:hidden">IA 3D</span>
          </button>

          {/* Manual New Dish Button */}
          <button
            onClick={handleOpenAddModal}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 border border-slate-700 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo</span>
          </button>
        </div>
      </div>

      {/* Dishes List Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDishes.map((dish) => {
          const categoryName = categoriesMap.get(dish.category_id) || 'Geral';
          const formattedPrice = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(dish.price);

          return (
            <div
              key={dish.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-all ${
                dish.is_active ? 'border-slate-800' : 'border-slate-800/50 opacity-65 bg-slate-950'
              }`}
            >
              <div>
                {/* Image & Quick Info */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />

                  {/* 3D Indicator */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-orange-500/40 text-orange-400 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    <span>3D & AR</span>
                  </div>

                  {/* Active / Paused Pill */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleToggleActive(dish.id)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border ${
                        dish.is_active
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {dish.is_active ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Ativo</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Pausado</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
                      {categoryName}
                    </span>
                    <span className="text-sm font-extrabold text-white">
                      {formattedPrice}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-heading line-clamp-1">
                    {dish.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onPreviewDish(dish)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Box className="w-3.5 h-3.5 text-orange-400" />
                  <span>Preview 3D</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(dish)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white transition-colors"
                    title="Editar Prato"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteDish(dish.id, dish.name)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                    title="Excluir Prato"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDishes.length === 0 && (
        <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
          <AlertCircle className="w-10 h-10 mx-auto text-slate-500" />
          <p className="text-sm font-semibold text-slate-300">Nenhum prato encontrado com esse filtro</p>
          <p className="text-xs text-slate-500">Cadastre um novo prato ou limpe a busca.</p>
        </div>
      )}

      {/* Modal for Add / Edit */}
      <DishFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDish}
        dishToEdit={editingDish}
        categories={categories}
        restaurantId={restaurantId}
      />

      {/* Quick AI 3D Scanner Modal */}
      <AI3DScannerModal
        isOpen={isAIScannerOpen}
        onClose={() => setIsAIScannerOpen(false)}
        onApply3DModel={handleQuickAI3DApply}
      />
    </div>
  );
};
