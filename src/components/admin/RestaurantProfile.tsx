import React, { useState, useEffect } from 'react';
import { Store, Upload, Check, Wifi, Palette, Globe } from 'lucide-react';
import type { Restaurant } from '../../types';
import { storeService } from '../../services/storeService';

interface RestaurantProfileProps {
  restaurant: Restaurant;
}

export const RestaurantProfile: React.FC<RestaurantProfileProps> = ({ restaurant }) => {
  const [formData, setFormData] = useState<Restaurant>(restaurant);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(restaurant);
  }, [restaurant]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, logo_url: url });
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, cover_url: url });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storeService.saveRestaurant(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const colorPalettes = [
    { name: 'Laranja Gourmet', hex: '#f97316' },
    { name: 'Âmbar Dourado', hex: '#f59e0b' },
    { name: 'Vinho & Rubi', hex: '#e11d48' },
    { name: 'Esmeralda', hex: '#10b981' },
    { name: 'Azul Real', hex: '#3b82f6' },
    { name: 'Roxo Imperial', hex: '#8b5cf6' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-heading">
                Identidade do Restaurante
              </h3>
              <p className="text-xs text-slate-400">
                Personalize nome, cores, banner e configurações de acesso
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Salvo com Sucesso!</span>
            </div>
          )}
        </div>

        {/* Basic Brand Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Nome do Estabelecimento *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Slug da URL (/r/[slug])</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Slogan / Subtítulo
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Media (Logo & Cover Banner) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Logo */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={formData.logo_url}
                alt="Logo Preview"
                className="w-14 h-14 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <span className="text-xs font-bold text-white block">Logo da Marca</span>
                <label className="cursor-pointer text-[11px] text-orange-400 hover:text-orange-300 font-semibold mt-1 inline-flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Substituir Logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>
            <input
              type="text"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              placeholder="URL do Logo"
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono"
            />
          </div>

          {/* Cover Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={formData.cover_url}
                alt="Cover Preview"
                className="w-20 h-14 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <span className="text-xs font-bold text-white block">Banner de Capa</span>
                <label className="cursor-pointer text-[11px] text-orange-400 hover:text-orange-300 font-semibold mt-1 inline-flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Substituir Capa</span>
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                </label>
              </div>
            </div>
            <input
              type="text"
              value={formData.cover_url}
              onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
              placeholder="URL da Imagem de Capa"
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono"
            />
          </div>
        </div>

        {/* Theme Palette */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-orange-400" />
            <span>Cor Primária da Marca</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {colorPalettes.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setFormData({ ...formData, primary_color: c.hex })}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  formData.primary_color === c.hex
                    ? 'border-white bg-slate-800 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Operational details (Tables count, Wi-Fi) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Quantidade de Mesas
            </label>
            <input
              type="number"
              value={formData.tables_count}
              onChange={(e) => setFormData({ ...formData, tables_count: parseInt(e.target.value, 10) || 1 })}
              min={1}
              max={100}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <span>Nome do Wi-Fi</span>
            </label>
            <input
              type="text"
              value={formData.wifi_name || ''}
              onChange={(e) => setFormData({ ...formData, wifi_name: e.target.value })}
              placeholder="Ex: LeBistro_Guest"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Senha do Wi-Fi
            </label>
            <input
              type="text"
              value={formData.wifi_password || ''}
              onChange={(e) => setFormData({ ...formData, wifi_password: e.target.value })}
              placeholder="Ex: bistro2026"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-orange-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all transform active:scale-98 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Salvar Informações da Marca</span>
          </button>
        </div>

      </form>
    </div>
  );
};
