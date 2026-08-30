import React, { useState } from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';
import type { Category } from '../../types';
import { storeService } from '../../services/storeService';

interface CategoriesManagerProps {
  categories: Category[];
  dishesCountByCategory: Record<string, number>;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  dishesCountByCategory,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🍽️');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    storeService.addCategory(newCatName.trim(), newCatIcon);
    setNewCatName('');
  };

  const handleDeleteCategory = (cat: Category) => {
    const count = dishesCountByCategory[cat.id] || 0;
    if (count > 0) {
      alert(`Esta categoria possui ${count} pratos associados. Mova ou exclua os pratos antes de excluir a categoria.`);
      return;
    }
    if (confirm(`Excluir a categoria "${cat.name}"?`)) {
      storeService.deleteCategory(cat.id);
    }
  };

  const quickIcons = ['🍔', '🥩', '🥑', '🍰', '🍸', '🍕', '🍣', '🥗', '☕', '⭐'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Create Category Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white font-heading mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-orange-400" />
          <span>Nova Categoria</span>
        </h3>

        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Icon picker / input */}
            <div className="w-24">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Ícone / Emoji
              </label>
              <input
                type="text"
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                maxLength={4}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-center text-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Category Name */}
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Nome da Categoria *
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Ex: Massas Artesanais, Pizzas Especiais..."
                required
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Add Button */}
            <div className="sm:self-end">
              <button
                type="submit"
                className="w-full sm:w-auto py-2 px-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-orange-500 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>

          {/* Quick Icons Strip */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400">Sugestões:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickIcons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setNewCatIcon(ic)}
                  className={`px-2 py-1 rounded-lg text-sm transition-transform hover:scale-110 ${
                    newCatIcon === ic ? 'bg-orange-500/20 border border-orange-500/40' : 'bg-slate-950 border border-slate-800'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Existing Categories List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        <h4 className="text-sm font-bold text-white font-heading mb-2">
          Categorias Ativas ({categories.length})
        </h4>

        <div className="space-y-2">
          {categories.map((cat) => {
            const count = dishesCountByCategory[cat.id] || 0;

            return (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {cat.icon || '🍴'}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      {cat.name}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {count} {count === 1 ? 'prato vinculado' : 'pratos vinculados'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
                    title="Excluir Categoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
