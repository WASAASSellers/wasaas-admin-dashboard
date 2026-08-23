import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, ShoppingCart } from 'lucide-react';
import { getPlans, coreApi } from '../services/api';

const SubscriptionCart = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MulticaixaReference');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      const data = await getPlans();
      setPlans(data);
      if (data.length > 0) setSelectedPlanId(data[0].id);
    };
    fetchPlans();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await coreApi.post('/subscriptions/calculate-cart', {
        planId: selectedPlanId,
        paymentMethod,
        durationInDays: 30
      });
      setResult(res.data.data);
    } catch (err) {
      alert('Erro ao calcular subscrição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="header-title">Subscrição & Faturamento</h1>
        <p className="header-subtitle">Gestão de Carrinho de Subscrição e checkout com Multicaixa Express / Referência.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Selecione o Plano desejado</h3>
          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="stat-label">Plano</label>
              <select 
                className="form-control" 
                value={selectedPlanId} 
                onChange={e => setSelectedPlanId(e.target.value)}
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.price} Kz ({p.deliveriesPerPeriod} entregas)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="stat-label">Método de Pagamento</label>
              <select 
                className="form-control" 
                value={paymentMethod} 
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <option value="MulticaixaReference">Referência Multicaixa</option>
                <option value="TPA">Multicaixa Express / TPA</option>
                <option value="Cash">Dinheiro / Transferência</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <ShoppingCart size={18} />
              <span>{loading ? 'Calculando...' : 'Calcular & Gerar Fatura'}</span>
            </button>
          </form>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Resumo da Fatura</h3>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Plano Selecionado:</span>
                <strong>{result.planName || 'Plano'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Preço Base:</span>
                <span>{result.basePrice} Kz</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Taxa de Entrega:</span>
                <span>{result.deliveryFee || 1000} Kz</span>
              </div>
              <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                <strong>Total a Pagar:</strong>
                <strong style={{ color: 'var(--success-color)' }}>{result.totalAmount || result.basePrice} Kz</strong>
              </div>

              {result.paymentReference && (
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
                  <div className="small text-muted">Referência Multicaixa:</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{result.paymentReference}</div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted">Selecione um plano e clique em calcular para visualizar a fatura.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCart;
