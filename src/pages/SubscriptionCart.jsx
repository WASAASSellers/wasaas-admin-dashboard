import React, { useState } from 'react';
import { CreditCard, CheckCircle, ShoppingCart } from 'lucide-react';
import { calculateSubscription, checkoutSubscription } from '../services/api';

const AVAILABLE_MODULES = [
  { id: 'whatsapp_agent', label: '🤖 Agente Bot WhatsApp', price: 10000 },
  { id: 'social_hub', label: '📱 Social Media Hub (FB & IG)', price: 8000 },
  { id: 'storefront_builder', label: '🌐 Construtor Drag & Drop de Sites', price: 12000 },
];

const SubscriptionCart = () => {
  const [selectedModules, setSelectedModules] = useState([]);
  const [extraAgents, setExtraAgents] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('MulticaixaReference');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleModule = (id) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (selectedModules.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const calc = await calculateSubscription(selectedModules, extraAgents);
      setResult(calc);
    } catch {
      alert('Erro ao calcular subscrição. Verifique se a Core API está ativa.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!result) return;
    setLoading(true);
    try {
      const checkout = await checkoutSubscription({
        tenantId: 'default',
        selectedModuleIds: selectedModules,
        extraAgentsCount: extraAgents,
        paymentMethod,
        paymentDetails: null,
      });
      alert(`✅ ${checkout?.message || 'Checkout processado!'}\nRef: ${checkout?.referenceNumber || '—'}`);
    } catch {
      alert('Erro ao processar checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="header-title">Subscrição & Faturamento</h1>
        <p className="header-subtitle">Selecione os módulos WASAaS e gere a fatura com Multicaixa Express / Referência.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Módulos Disponíveis</h3>
          <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {AVAILABLE_MODULES.map(mod => (
              <label key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedModules.includes(mod.id)}
                  onChange={() => toggleModule(mod.id)}
                />
                <span>{mod.label}</span>
                <span className="badge-pill badge-success" style={{ marginLeft: 'auto' }}>{mod.price.toLocaleString()} Kz/mês</span>
              </label>
            ))}

            <div>
              <label className="stat-label">Agentes Extra</label>
              <input
                type="number"
                className="form-control"
                min="0"
                max="20"
                value={extraAgents}
                onChange={e => setExtraAgents(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="stat-label">Método de Pagamento</label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <option value="MulticaixaReference">Referência Multicaixa</option>
                <option value="GATEWAY_EXPRESS">Multicaixa Express</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading || selectedModules.length === 0}>
              <ShoppingCart size={18} />
              <span>{loading ? 'Calculando...' : 'Calcular Fatura'}</span>
            </button>
          </form>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Resumo da Fatura</h3>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.modules?.map(mod => (
                <div key={mod.moduleId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">{mod.name}</span>
                  <span>{mod.monthlyPriceAoa?.toLocaleString()} Kz</span>
                </div>
              ))}
              {result.extraAgentsPriceAoa > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">Agentes Extra</span>
                  <span>{result.extraAgentsPriceAoa?.toLocaleString()} Kz</span>
                </div>
              )}
              <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                <strong>Total Mensal:</strong>
                <strong style={{ color: 'var(--success-color)' }}>{result.totalMonthlyAoa?.toLocaleString()} Kz</strong>
              </div>

              <button className="btn btn-primary" onClick={handleCheckout} disabled={loading} style={{ marginTop: '1rem' }}>
                <CreditCard size={18} />
                <span>{loading ? 'Processando...' : 'Confirmar & Pagar'}</span>
              </button>
            </div>
          ) : (
            <p className="text-muted">Selecione módulos e clique em calcular para visualizar a fatura.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCart;

