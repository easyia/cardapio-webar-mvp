import React from 'react';
import { 
  Check, 
  Receipt,
  Download
} from 'lucide-react';
import { i18n } from '../../services/i18n';
import type { Dish } from '../../types';

interface SubscriptionBillingProps {
  dishes: Dish[];
}

export const SubscriptionBilling: React.FC<SubscriptionBillingProps> = ({ dishes }) => {
  const t = i18n.t();
  const activeDishes3DCount = dishes.filter(d => d.ar_ready).length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Current Plan Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border-2 border-orange-500/40 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black uppercase tracking-wider shadow-md">
                Plano Pro Ativo
              </span>
              <span className="text-xs text-emerald-400 font-bold">● Assinatura Regular</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {t.planProName}
            </h2>
            <p className="text-xs text-slate-400">
              Próxima renovação em 30 de Setembro • Cobrança automática
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-black text-orange-400 font-heading">
              {t.planProPrice}
            </div>
            <span className="text-xs text-slate-400">{t.planMonthly}</span>
          </div>
        </div>

        {/* Quota Progress Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Modelos 3D & WebAR Utilizados:</span>
              <span className="text-orange-400 font-mono">{activeDishes3DCount} / Ilimitados</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full w-[45%]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Visualizações em AR este Mês:</span>
              <span className="text-emerald-400 font-mono">1.480 / 10.000</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[15%]" />
            </div>
          </div>
        </div>

      </div>

      {/* Plans Comparison */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white font-heading">
          {t.pricingTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Starter Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">{t.planStarterName}</h4>
              <div className="text-2xl font-black text-white font-heading">{t.planStarterPrice} <span className="text-xs font-normal text-slate-400">{t.planMonthly}</span></div>
              <p className="text-xs text-slate-400">{t.planStarterDesc}</p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-3 border-t border-slate-800">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Até 15 pratos 3D</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> QR Codes de Mesa</li>
              </ul>
            </div>
            <button
              onClick={() => alert('Downgrade agendado para o próximo ciclo.')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Mudar para Starter
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-slate-900 border-2 border-orange-500 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl shadow-orange-500/10">
            <div className="space-y-3">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase">
                Plano Atual
              </div>
              <h4 className="text-base font-bold text-white">{t.planProName}</h4>
              <div className="text-2xl font-black text-orange-400 font-heading">{t.planProPrice} <span className="text-xs font-normal text-slate-400">{t.planMonthly}</span></div>
              <p className="text-xs text-slate-300">{t.planProDesc}</p>
              <ul className="text-xs text-slate-200 space-y-1.5 pt-3 border-t border-slate-800">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-orange-400" /> Pratos 3D Ilimitados</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-orange-400" /> KDS Cozinha + Pix na Mesa</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-orange-400" /> Relatórios de Conversão</li>
              </ul>
            </div>
            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-bold cursor-default"
            >
              ✓ Seu Plano Atual
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">{t.planEnterpriseName}</h4>
              <div className="text-2xl font-black text-white font-heading">{t.planEnterprisePrice} <span className="text-xs font-normal text-slate-400">{t.planMonthly}</span></div>
              <p className="text-xs text-slate-400">{t.planEnterpriseDesc}</p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-3 border-t border-slate-800">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Múltiplas Lojas</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Integração PDV & API</li>
              </ul>
            </div>
            <button
              onClick={() => alert('Entraremos em contato com sua franquia em até 2 horas úteis.')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Falar com Suporte
            </button>
          </div>

        </div>
      </div>

      {/* Invoice History Simulator */}
      <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-400" />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Histórico de Faturas</h4>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">Todas Pagas</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-slate-300">
            <div>
              <strong className="block text-white">Fatura #INV-2026-08</strong>
              <span className="text-[11px] text-slate-500">30 de Agosto de 2026 • Cartão final 4022</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">{t.planProPrice}</span>
              <button 
                onClick={() => alert('Download do PDF do recibo iniciado.')}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white" 
                title="Baixar Recibo"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
