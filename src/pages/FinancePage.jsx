import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, RefreshCw, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getFinanceSummary, addExpense } from '../services/api';

const FinancePage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states (Add Expense)
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(0);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const data = await getFinanceSummary();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!desc || !amount) return;

    try {
      await addExpense({
        description: desc,
        amount: parseFloat(amount),
        type: parseInt(type, 10),
        date: new Date().toISOString(),
        relatedOrderId: null
      });

      setDesc('');
      setAmount('');
      await loadSummary();
      alert('Despesa registada com sucesso!');
    } catch (err) {
      alert('Erro ao registar despesa.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="header-title">Fluxo de Caixa & Finanças</h1>
          <p className="header-subtitle">Resumo de receitas, despesas operacionais, lucro líquido e margem.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadSummary} disabled={loading}>
          <RefreshCw size={16} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card stat-card">
          <div className="stat-label">Receita Total</div>
          <div className="stat-value" style={{ color: 'var(--success-color)' }}>
            {(summary?.totalRevenue || 0).toLocaleString()} Kz
          </div>
          <div className="stat-help" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ArrowUpRight size={14} color="var(--success-color)" />
            <span>Vendas e Subscrições</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-label">Despesas Operacionais</div>
          <div className="stat-value" style={{ color: 'var(--danger-color)' }}>
            {(summary?.totalExpenses || 0).toLocaleString()} Kz
          </div>
          <div className="stat-help" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ArrowDownRight size={14} color="var(--danger-color)" />
            <span>Custos e Insumos</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-label">Lucro Líquido</div>
          <div className="stat-value" style={{ color: (summary?.netProfit || 0) >= 0 ? 'var(--accent-color)' : 'var(--danger-color)' }}>
            {(summary?.netProfit || 0).toLocaleString()} Kz
          </div>
          <div className="stat-help">Receita - Despesas</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-label">Margem de Lucro</div>
          <div className="stat-value">
            {(summary?.margin || 0).toFixed(1)}%
          </div>
          <div className="stat-help">Rentabilidade do período</div>
        </div>
      </div>

      {/* Expense Form & Breakdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Registar Nova Despesa</h3>
          <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="stat-label">Descrição da Despesa</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Compra de embalagens, combustível, etc."
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required 
              />
            </div>

            <div>
              <label className="stat-label">Valor (Kz)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="15000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required 
              />
            </div>

            <div>
              <label className="stat-label">Categoria de Custo</label>
              <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                <option value={0}>Ingredientes / Insumos de Produção</option>
                <option value={1}>Embalagens e Materiais</option>
                <option value={2}>Combustível & Logística de Entrega</option>
                <option value={3}>Marketing, Redes Sociais e Anúncios</option>
                <option value={4}>Serviços Gerais e Utilidades</option>
                <option value={5}>Outros Custos Operacionais</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={18} />
              <span>Gravar Despesa</span>
            </button>
          </form>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Informações do Período Contábil</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <span className="text-muted">Início do Período:</span>
              <strong>{summary?.periodStart ? new Date(summary.periodStart).toLocaleDateString() : '—'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <span className="text-muted">Fecho do Período:</span>
              <strong>{summary?.periodEnd ? new Date(summary.periodEnd).toLocaleDateString() : '—'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <span className="text-muted">Status do Balanço:</span>
              <span className="badge badge-success">Equilibrado</span>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
              <div className="small text-muted" style={{ marginBottom: '0.25rem' }}>Dica de Gestão Financeira:</div>
              <p className="small">Mantenha as despesas de insumos e logística atualizadas diariamente para que o relatório de margem reflita o custo real por entrega.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
