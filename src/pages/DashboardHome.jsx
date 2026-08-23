import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Package, RefreshCw, Plus } from 'lucide-react';
import { getOrders, getProducts, getPlans, getFinanceSummary } from '../services/api';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    activePlans: 0,
    totalRevenue: '—'
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData, plansData, financeSummary] = await Promise.all([
        getProducts(),
        getOrders(),
        getPlans(),
        getFinanceSummary()
      ]);

      const totalRevenue = financeSummary?.totalRevenue != null
        ? `${Number(financeSummary.totalRevenue).toLocaleString('pt-AO')} Kz`
        : '—';

      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        activePlans: plansData.length,
        totalRevenue
      });
      setRecentOrders(ordersData.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Visão Geral</span>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monitore desempenho, vendas, clientes e produtos a partir de um único painel.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={loadData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Atualizar</span>
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            <span>Novo Relatório</span>
          </button>
        </div>
      </div>

      <div className="metric-grid">
        <article className="metric-card metric-primary">
          <div className="metric-top">
            <span className="metric-label">Receita Total</span>
            <div className="metric-icon"><DollarSign size={20} /></div>
          </div>
          <div className="metric-value">{stats.totalRevenue}</div>
          <div className="metric-meta">
            <span className="badge-pill badge-success">+12.5%</span>
            <span style={{ color: 'var(--admin-muted)' }}>em relação ao mês passado</span>
          </div>
        </article>

        <article className="metric-card metric-success">
          <div className="metric-top">
            <span className="metric-label">Encomendas Totais</span>
            <div className="metric-icon"><ShoppingBag size={20} /></div>
          </div>
          <div className="metric-value">{stats.totalOrders}</div>
          <div className="metric-meta">
            <span className="badge-pill badge-success">+8.2%</span>
            <span style={{ color: 'var(--admin-muted)' }}>novas encomendas</span>
          </div>
        </article>

        <article className="metric-card metric-warning">
          <div className="metric-top">
            <span className="metric-label">Produtos no Catálogo</span>
            <div className="metric-icon"><Package size={20} /></div>
          </div>
          <div className="metric-value">{stats.totalProducts}</div>
          <div className="metric-meta">
            <span className="badge-pill badge-success">+5.1%</span>
            <span style={{ color: 'var(--admin-muted)' }}>itens ativos</span>
          </div>
        </article>

        <article className="metric-card metric-danger">
          <div className="metric-top">
            <span className="metric-label">Planos de Subscrição</span>
            <div className="metric-icon"><Users size={20} /></div>
          </div>
          <div className="metric-value">{stats.activePlans}</div>
          <div className="metric-meta">
            <span className="badge-pill badge-warning">Ativos</span>
            <span style={{ color: 'var(--admin-muted)' }}>no portal</span>
          </div>
        </article>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: 700 }}>Encomendas Recentes</h3>
        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--admin-muted)' }}>Nenhuma encomenda registada até ao momento.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Cliente</th>
                  <th>Data Agendada</th>
                  <th>Endereço</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td><strong>{order.orderNumber}</strong></td>
                    <td>{order.clientName || 'Cliente'}</td>
                    <td>{new Date(order.scheduledDate).toLocaleDateString()}</td>
                    <td>{order.deliveryAddress}</td>
                    <td>
                      <span className="badge-pill badge-success">{order.status || 'Concluído'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
