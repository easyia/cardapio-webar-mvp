import React, { useState } from 'react';
import { 
  Sparkles, 
  Smartphone, 
  TrendingUp, 
  CheckCircle, 
  Camera, 
  Play, 
  Calculator, 
  CreditCard, 
  ChevronRight,
  Store
} from 'lucide-react';
import { i18n } from '../../services/i18n';
import type { Language } from '../../types/i18n';
import { ModelViewer3D } from '../ar/ModelViewer3D';
import { INITIAL_DISHES } from '../../data/mockData';

interface LandingPageProps {
  onOpenClientDemo: () => void;
  onOpenAdminDemo: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenClientDemo,
  onOpenAdminDemo,
  currentLang,
  onLanguageChange,
}) => {
  const t = i18n.t();

  // ROI Calculator States
  const [tablesCount, setTablesCount] = useState<number>(18);
  const [avgTicket, setAvgTicket] = useState<number>(currentLang === 'es-AR' ? 12000 : 45);

  // Daily customers per table turnover approx 3.2 turns/day
  const dailyCustomers = tablesCount * 2.5 * 3.2;
  const monthlyRevenue = dailyCustomers * avgTicket * 30;
  const estimatedExtraMonthly = monthlyRevenue * 0.34;
  const estimatedExtraYearly = estimatedExtraMonthly * 12;

  const heroDish = INITIAL_DISHES[0];

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] selection:bg-amber-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* Top Sticky Luxury Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0C0B0A]/90 backdrop-blur-xl border-b border-[#1E1B18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-600/20 border border-amber-400/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-heading block leading-none">
                AuraMenu<span className="text-amber-500 font-sans text-lg"> 3D</span>
              </span>
              <span className="text-[10px] text-[#A39E93] font-semibold tracking-widest uppercase">
                Atelier Spatial Gastronomy
              </span>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider uppercase text-[#A39E93]">
            <a href="#como-funciona" className="hover:text-amber-400 transition-colors">Como Funciona</a>
            <a href="#recursos" className="hover:text-amber-400 transition-colors">Recursos</a>
            <a href="#calculadora" className="hover:text-amber-400 transition-colors">Calculadora ROI</a>
            <a href="#precos" className="hover:text-amber-400 transition-colors">Planos</a>
          </nav>

          {/* Language Switcher & CTAs */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-[#161412] border border-[#1E1B18] rounded-xl p-1 text-xs font-bold">
              <button
                onClick={() => onLanguageChange('pt-BR')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentLang === 'pt-BR' ? 'bg-amber-600 text-white shadow-sm' : 'text-[#A39E93] hover:text-white'
                }`}
                title="Português (Brasil)"
              >
                <span>🇧🇷</span>
                <span className="hidden sm:inline">PT</span>
              </button>
              <button
                onClick={() => onLanguageChange('es-AR')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentLang === 'es-AR' ? 'bg-amber-600 text-white shadow-sm' : 'text-[#A39E93] hover:text-white'
                }`}
                title="Español (Argentina / Castellano)"
              >
                <span>🇦🇷</span>
                <span className="hidden sm:inline">ES</span>
              </button>
            </div>

            {/* Quick Demo CTA */}
            <button
              onClick={onOpenClientDemo}
              className="hidden sm:flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#161412] hover:bg-[#1E1B18] text-white text-xs font-bold border border-[#2B2723] transition-all shadow-sm"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>{t.clientView}</span>
            </button>

            <button
              onClick={onOpenAdminDemo}
              className="py-2.5 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-600/25 transition-all transform active:scale-98 flex items-center gap-1.5 border border-amber-400/30"
            >
              <Store className="w-4 h-4" />
              <span>{t.adminView}</span>
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.heroBadge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#FAF8F5] tracking-tight font-heading leading-[1.15]">
                {t.heroTitle.split('38%')[0]}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent italic font-serif">
                  38%
                </span>
                {t.heroTitle.split('38%')[1]}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#A39E93] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onOpenClientDemo}
                  className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-base shadow-2xl shadow-amber-600/30 flex items-center justify-center gap-3 transition-all transform active:scale-98 border border-amber-400/40"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{t.heroCtaDemo}</span>
                </button>

                <button
                  onClick={onOpenAdminDemo}
                  className="w-full sm:w-auto py-4 px-7 rounded-2xl bg-[#161412] hover:bg-[#1E1B18] text-[#FAF8F5] font-bold text-sm border border-[#2B2723] shadow-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Camera className="w-5 h-5 text-amber-400" />
                  <span>{t.heroCtaAdmin}</span>
                </button>
              </div>

              {/* Metrics Row */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-[#1E1B18] max-w-xl mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                    {t.heroMetric1Value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#A39E93] leading-tight mt-0.5 font-light">
                    {t.heroMetric1Label}
                  </div>
                </div>

                <div className="text-center lg:text-left border-x border-[#1E1B18] px-3">
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {t.heroMetric2Value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#A39E93] leading-tight mt-0.5 font-light">
                    {t.heroMetric2Label}
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                    {t.heroMetric3Value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#A39E93] leading-tight mt-0.5 font-light">
                    {t.heroMetric3Label}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Interactive 3D Card (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md rounded-3xl p-1 bg-gradient-to-b from-amber-500/30 via-[#1E1B18] to-[#0C0B0A] shadow-2xl shadow-amber-600/15">
                <div className="rounded-[22px] overflow-hidden bg-[#161412] border border-[#2B2723] p-4 space-y-4">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-[#FAF8F5] tracking-wider uppercase font-mono">
                        WebAR Spatial 1:1
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      Gire em 360°
                    </span>
                  </div>

                  {/* 3D Model Interactive Viewport */}
                  <div className="h-72 w-full rounded-2xl overflow-hidden bg-[#0C0B0A] relative border border-[#1E1B18]">
                    <ModelViewer3D
                      dish={heroDish}
                      className="w-full h-full"
                      showControls={true}
                    />
                  </div>

                  {/* Dish Info Card */}
                  <div className="p-3.5 bg-[#0C0B0A] rounded-2xl border border-[#1E1B18] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">
                        {heroDish.name}
                      </h4>
                      <p className="text-xs text-[#A39E93] font-mono">
                        {i18n.formatCurrency(heroDish.price)} • {heroDish.portion_size}
                      </p>
                    </div>

                    <button
                      onClick={onOpenClientDemo}
                      className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-md"
                    >
                      <span>Projetar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="como-funciona" className="py-20 bg-[#161412]/50 border-y border-[#1E1B18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
              {t.howItWorksTitle}
            </h2>
            <p className="text-base text-[#A39E93] font-light">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-[#161412] border border-[#1E1B18] rounded-3xl p-8 space-y-4 hover:border-amber-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform font-mono">
                1
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                {t.step1Title}
              </h3>
              <p className="text-sm text-[#A39E93] leading-relaxed font-light">
                {t.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#161412] border border-amber-500/40 rounded-3xl p-8 space-y-4 shadow-xl shadow-amber-600/10 relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform font-mono">
                2
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                {t.step2Title}
              </h3>
              <p className="text-sm text-[#FAF8F5] leading-relaxed font-light">
                {t.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#161412] border border-[#1E1B18] rounded-3xl p-8 space-y-4 hover:border-amber-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform font-mono">
                3
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                {t.step3Title}
              </h3>
              <p className="text-sm text-[#A39E93] leading-relaxed font-light">
                {t.step3Desc}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="recursos" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
              {t.featuresTitle}
            </h2>
            <p className="text-base text-[#A39E93] font-light">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-[#161412] border border-[#1E1B18] p-8 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.feature1Title}</h3>
              <p className="text-sm text-[#A39E93] leading-relaxed font-light">{t.feature1Desc}</p>
            </div>

            <div className="bg-[#161412] border border-[#1E1B18] p-8 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.feature2Title}</h3>
              <p className="text-sm text-[#A39E93] leading-relaxed font-light">{t.feature2Desc}</p>
            </div>

            <div className="bg-[#161412] border border-[#1E1B18] p-8 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.feature3Title}</h3>
              <p className="text-sm text-[#A39E93] leading-relaxed font-light">{t.feature3Desc}</p>
            </div>

            <div className="bg-[#161412] border border-[#1E1B18] p-8 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.feature4Title}</h3>
              <p className="text-sm text-[#A39E93] leading-relaxed font-light">{t.feature4Desc}</p>
            </div>

          </div>

        </div>
      </section>

      {/* ROI CALCULATOR SECTION */}
      <section id="calculadora" className="py-20 bg-[#161412]/60 border-t border-[#1E1B18]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Calculator className="w-4 h-4" />
              <span>Simulador Financeiro</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
              {t.roiTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#A39E93] max-w-xl mx-auto font-light">
              {t.roiSubtitle}
            </p>
          </div>

          <div className="bg-[#0C0B0A] border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tables Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{t.roiTablesLabel}</span>
                  <span className="text-amber-400 font-mono text-sm">{tablesCount} mesas</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="60"
                  value={tablesCount}
                  onChange={(e) => setTablesCount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Average Ticket Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{t.roiTicketLabel}</span>
                  <span className="text-amber-400 font-mono text-sm">{i18n.formatCurrency(avgTicket)}</span>
                </div>
                <input
                  type="range"
                  min={currentLang === 'es-AR' ? 3000 : 15}
                  max={currentLang === 'es-AR' ? 40000 : 180}
                  step={currentLang === 'es-AR' ? 500 : 5}
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#1E1B18]">
              <div className="p-5 rounded-2xl bg-[#161412] border border-[#1E1B18] text-center space-y-1">
                <span className="text-xs text-[#A39E93]">{t.roiExtraMonthly}</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  +{i18n.formatCurrency(estimatedExtraMonthly)}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                <span className="text-xs text-amber-200">{t.roiExtraYearly}</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  +{i18n.formatCurrency(estimatedExtraYearly)}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="precos" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
              {t.pricingTitle}
            </h2>
            <p className="text-base text-[#A39E93] font-light">
              {t.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Starter Plan */}
            <div className="bg-[#161412] border border-[#1E1B18] rounded-3xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white font-heading">{t.planStarterName}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white font-mono">{t.planStarterPrice}</span>
                  <span className="text-sm text-[#A39E93]">{t.planMonthly}</span>
                </div>
                <p className="text-xs text-[#A39E93] leading-relaxed font-light">{t.planStarterDesc}</p>
                <ul className="text-xs text-slate-300 space-y-2 pt-4 border-t border-[#1E1B18]">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Até 15 pratos em 3D / WebAR</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> QR Codes para todas as mesas</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Apple Quick Look & Android Scene Viewer</li>
                </ul>
              </div>

              <button
                onClick={onOpenClientDemo}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1E1B18] hover:bg-[#2B2723] text-white font-bold text-xs transition-colors"
              >
                {t.planCta}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#161412] border-2 border-amber-500 rounded-3xl p-8 flex flex-col justify-between space-y-6 shadow-2xl shadow-amber-600/15 relative">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white font-heading">{t.planProName}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-amber-400 font-mono">{t.planProPrice}</span>
                  <span className="text-sm text-[#A39E93]">{t.planMonthly}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-light">{t.planProDesc}</p>
                <ul className="text-xs text-slate-200 space-y-2 pt-4 border-t border-[#1E1B18]">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400" /> Pratos 3D Ilimitados com IA</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400" /> Pedidos na Mesa + Pix & Mercado Pago</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400" /> KDS Cozinha em Tempo Real</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400" /> Analytics de Conversão e Vendas</li>
                </ul>
              </div>

              <button
                onClick={onOpenAdminDemo}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/25 transition-all transform active:scale-98"
              >
                {t.planCta}
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#161412] border border-[#1E1B18] rounded-3xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white font-heading">{t.planEnterpriseName}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white font-mono">{t.planEnterprisePrice}</span>
                  <span className="text-sm text-[#A39E93]">{t.planMonthly}</span>
                </div>
                <p className="text-xs text-[#A39E93] leading-relaxed font-light">{t.planEnterpriseDesc}</p>
                <ul className="text-xs text-slate-300 space-y-2 pt-4 border-t border-[#1E1B18]">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Múltiplas Unidades / Franquias</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Integração com PDV / ERP</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Gerente de Conta Dedicado</li>
                </ul>
              </div>

              <button
                onClick={onOpenAdminDemo}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1E1B18] hover:bg-[#2B2723] text-white font-bold text-xs transition-colors"
              >
                Falar com Consultor
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#0C0B0A] border-t border-[#1E1B18] text-xs text-[#716B61]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-300 font-heading">AuraMenu 3D • Versão 3.0 Atelier Spatial</span>
          </div>

          <div className="flex items-center gap-6 font-mono">
            <span>Brasil 🇧🇷 & Argentina 🇦🇷</span>
            <span>WebAR 1:1 Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
