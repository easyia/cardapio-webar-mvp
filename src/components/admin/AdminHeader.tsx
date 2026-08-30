import React from 'react';
import { 
  Sparkles, 
  Utensils, 
  Layers, 
  QrCode, 
  Store, 
  Eye, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import type { Restaurant } from '../../types';
import { storeService } from '../../services/storeService';

export type AdminTab = 'dishes' | 'categories' | 'profile' | 'qrcodes';

interface AdminHeaderProps {
  restaurant: Restaurant;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onSwitchToClient: () => void;
  dishesCount: number;
  categoriesCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  restaurant,
  activeTab,
  onTabChange,
  onSwitchToClient,
  dishesCount,
  categoriesCount,
}) => {
  const arStats = storeService.getARStats();

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white">
      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-heading tracking-tight text-white">
                AuraMenu Admin
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
                WebAR MVP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Painel de Controle • {restaurant.name}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (confirm('Deseja restaurar os dados de demonstração padrão?')) {
                storeService.resetToDefaults();
              }
            }}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Resetar dados para padrão de demonstração"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Restaurar Demo</span>
          </button>

          <button
            onClick={onSwitchToClient}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-orange-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all transform active:scale-98"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Cardápio do Cliente</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <div className="border-t border-slate-900 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Visualizações WebAR</span>
              <strong className="text-sm font-extrabold text-white">{arStats.total} interações</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Pratos Ativos</span>
              <strong className="text-sm font-extrabold text-white">{dishesCount} itens</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Categorias</span>
              <strong className="text-sm font-extrabold text-white">{categoriesCount} cadastradas</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Mesas com QR</span>
              <strong className="text-sm font-extrabold text-white">{restaurant.tables_count} mesas ativas</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => onTabChange('dishes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'dishes'
                ? 'bg-slate-800 text-orange-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Gestão de Pratos & 3D</span>
          </button>

          <button
            onClick={() => onTabChange('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'categories'
                ? 'bg-slate-800 text-orange-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categorias</span>
          </button>

          <button
            onClick={() => onTabChange('qrcodes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'qrcodes'
                ? 'bg-slate-800 text-orange-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Gerador de QR Code</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'bg-slate-800 text-orange-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Identidade & Marca</span>
          </button>
        </div>
      </div>
    </header>
  );
};
