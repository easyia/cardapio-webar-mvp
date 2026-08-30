import React from 'react';
import type { Category } from '../../types';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  dishesCountByCategory: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  dishesCountByCategory,
}) => {
  return (
    <nav className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          
          {/* "Todos" pill */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              selectedCategoryId === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>🍽️</span>
            <span>Todos os Pratos</span>
          </button>

          {/* Category items */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const count = dishesCountByCategory[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{cat.icon || '🍴'}</span>
                <span>{cat.name}</span>
                {count > 0 && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
