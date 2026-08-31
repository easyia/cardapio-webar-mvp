import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Flame,
  Check
} from 'lucide-react';
import type { TableOrder } from '../../types';
import { storeService } from '../../services/storeService';
import { i18n } from '../../services/i18n';

export const KitchenKDS: React.FC = () => {
  const t = i18n.t();
  const [orders, setOrders] = useState<TableOrder[]>(storeService.getOrders());

  useEffect(() => {
    const unsub = storeService.subscribe(() => {
      setOrders(storeService.getOrders());
    });
    return unsub;
  }, []);

  const handleAdvanceStatus = (orderId: string, currentStatus: string) => {
    let nextStatus: 'enviado' | 'em_preparo' | 'entregue' = 'em_preparo';
    if (currentStatus === 'enviado') nextStatus = 'em_preparo';
    else if (currentStatus === 'em_preparo') nextStatus = 'entregue';
    else nextStatus = 'entregue';

    const currentOrders = storeService.getOrders();
    const updated = currentOrders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o);
    localStorage.setItem('auramenu_orders_v1', JSON.stringify(updated));
    // Trigger notification
    storeService.saveDishes(storeService.getDishes());
  };

  const handleSeedDemoOrder = () => {
    const demoOrder: TableOrder = {
      id: `ord-${Date.now()}`,
      table_number: '08',
      items: [
        {
          dish: storeService.getDishes()[0],
          quantity: 2,
          notes: '1 com canela extra, 1 sem açúcar',
        },
        {
          dish: storeService.getDishes()[1],
          quantity: 1,
          notes: 'Servir bem quentinho com manteiga',
        }
      ],
      total: 54.30,
      status: 'enviado',
      created_at: new Date().toISOString(),
    };
    storeService.createOrder(demoOrder);
  };

  const activeOrders = orders.filter(o => o.status !== 'entregue');
  const finishedOrders = orders.filter(o => o.status === 'entregue');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* KDS Header */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-orange-500/20">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white font-heading">
                {t.kdsTitle}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-extrabold animate-pulse">
                ● Tempo Real
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeOrders.length} {activeOrders.length === 1 ? 'comanda ativa' : 'comandas ativas'} na fila da cozinha
            </p>
          </div>
        </div>

        <button
          onClick={handleSeedDemoOrder}
          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-2"
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Simular Novo Pedido</span>
        </button>
      </div>

      {/* Orders Grid */}
      {activeOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeOrders.map((order) => {
            const timeDiffMin = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);

            return (
              <div 
                key={order.id}
                className={`bg-slate-900 border-2 rounded-3xl overflow-hidden p-5 flex flex-col justify-between shadow-2xl transition-all ${
                  order.status === 'enviado' ? 'border-orange-500/60 shadow-orange-500/10' : 'border-amber-500/60 shadow-amber-500/10'
                }`}
              >
                <div className="space-y-4">
                  {/* Order Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-white text-slate-950 font-black rounded-xl text-sm">
                        Mesa {order.table_number}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        #{order.id.slice(-4)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{Math.max(1, timeDiffMin)} min</span>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between text-sm font-extrabold text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs">
                              {item.quantity}x
                            </span>
                            <span>{item.dish.name}</span>
                          </div>
                        </div>

                        {item.notes && (
                          <p className="text-xs text-amber-300 font-medium pl-8 bg-amber-950/30 p-1.5 rounded-lg border border-amber-500/30">
                            Obs: {item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Advancement CTA */}
                <div className="pt-5 mt-4 border-t border-slate-800">
                  {order.status === 'enviado' ? (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, order.status)}
                      className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>{t.kdsMarkPreparing}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, order.status)}
                      className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.kdsMarkDelivered}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400" />
          <h3 className="text-lg font-extrabold text-white">{t.kdsAllClear}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Novos pedidos feitos pelos clientes na mesa aparecerão automaticamente aqui.
          </p>
        </div>
      )}

      {/* Finished Orders Section */}
      {finishedOrders.length > 0 && (
        <div className="p-5 bg-slate-900/60 rounded-3xl border border-slate-800/80 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pedidos Entregues Recentemente ({finishedOrders.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {finishedOrders.slice(0, 3).map(o => (
              <div key={o.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center text-slate-400">
                <span>Mesa {o.table_number} • {o.items.length} itens</span>
                <span className="text-emerald-400 font-bold">✓ Entregue</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
