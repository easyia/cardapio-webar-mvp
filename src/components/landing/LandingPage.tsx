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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Top Sticky Silicon Valley Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 border border-orange-400/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-heading block leading-none">
                AuraMenu<span className="text-orange-500">3D</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                WebAR Gastro Platform
              </span>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#como-funciona" className="hover:text-orange-400 transition-colors">Como Funciona</a>
            <a href="#recursos" className="hover:text-orange-400 transition-colors">Recursos</a>
            <a href="#calculadora" className="hover:text-orange-400 transition-colors">Calculadora ROI</a>
            <a href="#precos" className="hover:text-orange-400 transition-colors">Planos</a>
          </nav>

          {/* Language Switcher & CTAs */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-bold">
              <button
                onClick={() => onLanguageChange('pt-BR')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentLang === 'pt-BR' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Português (Brasil)"
              >
                <span>🇧🇷</span>
                <span className="hidden sm:inline">PT</span>
              </button>
              <button
                onClick={() => onLanguageChange('es-AR')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentLang === 'es-AR' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
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
              className="hidden sm:flex items-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700/80 transition-all shadow-sm"
            >
              <Smartphone className="w-4 h-4 text-orange-400" />
              <span>{t.clientView}</span>
            </button>

            <button
              onClick={onOpenAdminDemo}
              className="py-2.5 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-orange-500/25 transition-all transform active:scale-98 flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              <span>{t.adminView}</span>
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-orange-600/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-extrabold uppercase tracking-wider shadow-inner">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>{t.heroBadge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-heading leading-[1.1]">
                {t.heroTitle.split('38%')[0]}
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  38%
                </span>
                {t.heroTitle.split('38%')[1]}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onOpenClientDemo}
                  className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-black text-base shadow-2xl shadow-orange-500/35 flex items-center justify-center gap-3 transition-all transform active:scale-98 border border-orange-400/40"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{t.heroCtaDemo}</span>
                </button>

                <button
                  onClick={onOpenAdminDemo}
                  className="w-full sm:w-auto py-4 px-7 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700/90 shadow-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Camera className="w-5 h-5 text-orange-400" />
                  <span>{t.heroCtaAdmin}</span>
                </button>
              </div>

              {/* Silicon Valley Metrics Row */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-black text-orange-400 font-heading">
                    {t.heroMetric1Value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">
                    {t.heroMetric1Label}
                  </div>
                </div>

                <div className="text-center lg:text-left border-x border-slate-800/80 px-3">
                  <div className="text-2xl sm:text-3xl font-black text-white font-heading">
                    {t.heroMetric2Value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">
                    {t.heroMetric2Label}
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 font-heading">
                    {t.heroMetric3Value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">
                    {t.heroMetric3Label}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Interactive 3D Card (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md rounded-3xl p-1 bg-gradient-to-b from-orange-500/40 via-amber-500/20 to-slate-800 shadow-2xl shadow-orange-500/20">
                <div className="rounded-[22px] overflow-hidden bg-slate-900 border border-slate-800 p-4 space-y-4">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        WebAR 1:1 Live Canvas
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-orange-400 bg-orange-500/15 px-2.5 py-1 rounded-full border border-orange-500/30">
                      Gire em 360°
                    </span>
                  </div>

                  {/* 3D Model Interactive Viewport */}
                  <div className="h-72 w-full rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-800">
                    <ModelViewer3D
                      dish={heroDish}
                      className="w-full h-full"
                      showControls={true}
                    />
                  </div>

                  {/* Dish Info Card */}
                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-white font-heading">
                        {heroDish.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {i18n.formatCurrency(heroDish.price)} • {heroDish.portion_size}
                      </p>
                    </div>

                    <button
                      onClick={onOpenClientDemo}
                      className="py-2 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-extrabold text-xs flex items-center gap-1 transition-all shadow-md"
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
      <section id="como-funciona" className="py-20 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
              {t.howItWorksTitle}
            </h2>
            <p className="text-base text-slate-400">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-orange-500/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                {t.step1Title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-orange-500/40 rounded-3xl p-8 space-y-4 shadow-xl shadow-orange-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 bg-orange-500/20 text-orange-300 text-[10px] font-extrabold uppercase tracking-wider rounded-bl-2xl border-l border-b border-orange-500/40">
                Experiência Mágica
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                {t.step2Title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-orange-500/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                {t.step3Title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
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
            <p className="text-base text-slate-400">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center border border-orange-500/30">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.feature1Title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t.feature1Desc}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.feature2Title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t.feature2Desc}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.feature3Title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t.feature3Desc}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{t.feature4Title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t.feature4Desc}</p>
            </div>

          </div>

        </div>
      </section>

      {/* ROI CALCULATOR SECTION */}
      <section id="calculadora" className="py-20 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Calculator className="w-4 h-4" />
              <span>Calculadora de Impacto Financeiro</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
              {t.roiTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              {t.roiSubtitle}
            </p>
          </div>

          <div className="bg-slate-950 border-2 border-orange-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tables Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{t.roiTablesLabel}</span>
                  <span className="text-orange-400 font-mono text-sm">{tablesCount} mesas</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="60"
                  value={tablesCount}
                  onChange={(e) => setTablesCount(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Average Ticket Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{t.roiTicketLabel}</span>
                  <span className="text-orange-400 font-mono text-sm">{i18n.formatCurrency(avgTicket)}</span>
                </div>
                <input
                  type="range"
                  min={currentLang === 'es-AR' ? 3000 : 15}
                  max={currentLang === 'es-AR' ? 40000 : 180}
                  step={currentLang === 'es-AR' ? 500 : 5}
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400">{t.roiExtraMonthly}</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">
                  +{i18n.formatCurrency(estimatedExtraMonthly)}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-center space-y-1">
                <span className="text-xs text-orange-200">{t.roiExtraYearly}</span>
                <div className="text-2xl sm:text-3xl font-black text-orange-400 font-heading">
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
            <p className="text-base text-slate-400">
              {t.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Starter Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white font-heading">{t.planStarterName}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white font-heading">{t.planStarterPrice}</span>
                  <span className="text-sm text-slate-400">{t.planMonthly}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{t.planStarterDesc}</p>
                <ul className="text-xs text-slate-300 space-y-2 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Até 15 pratos em 3D / WebAR</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> QR Codes para todas as mesas</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Visualizador Apple Quick Look & Android</li>
                </ul>
              </div>

              <button
                onClick={onOpenClientDemo}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                {t.planCta}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 border-2 border-orange-500 rounded-3xl p-8 flex flex-col justify-between space-y-6 shadow-2xl shadow-orange-500/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                {t.popularBadge}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white font-heading">{t.planProName}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-orange-400 font-heading">{t.planProPrice}</span>
                  <span className="text-sm text-slate-400">{t.planMonthly}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{t.planProDesc}</p>
                <ul className="text-xs text-slate-200 space-y-2 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-400" /> Pratos 3D Ilimitados com IA</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-400" /> Pedidos na Mesa + Pagamento Pix/Cartão</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-400" /> KDS Cozinha em Tempo Real</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-400" /> Analytics de Conversão e Vendas</li>
                </ul>
              </div>

              <button
                onClick={onOpenAdminDemo}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-orange-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 transition-all transform active:scale-98"
              >
                {t.planCta}
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white font-heading">{t.planEnterpriseName}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white font-heading">{t.planEnterprisePrice}</span>
                  <span className="text-sm text-slate-400">{t.planMonthly}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{t.planEnterpriseDesc}</p>
                <ul className="text-xs text-slate-300 space-y-2 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Múltiplas Unidades / Franquias</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Integração com PDV / ERP</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Gerente de Conta Dedicado</li>
                </ul>
              </div>

              <button
                onClick={onOpenAdminDemo}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Falar com Consultor
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-slate-300">AuraMenu 3D • Versão 2.0 Produção</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Brasil 🇧🇷 & Argentina 🇦🇷</span>
            <span>Tecnologia WebAR Nativa</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
