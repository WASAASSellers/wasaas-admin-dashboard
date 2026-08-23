import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, DollarSign, Package, RefreshCw } from 'lucide-react';
import { getOrders, getProducts, getPlans } from '../services/api';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    activePlans: 0,
    totalRevenue: '34.000 Kz'
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData, plansData] = await Promise.all([
        getProducts(),
        getOrders(),
        getPlans()
      ]);

      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        activePlans: plansData.length,
        totalRevenue: '34.000 Kz'
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="header-title">Visão Geral do Negócio</h1>
          <p className="header-subtitle">Métricas principais e estado do portal em tempo real (100% REST API).</p>
        </div>
        <button className="btn btn-secondary" onClick={loadData} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Atualizar</span>
        </button>
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <div>
            <span className="stat-label">Produtos no Catálogo</span>
            <div className="stat-val">{stats.totalProducts}</div>
          </div>
          <div className="icon-box"><Package size={24} /></div>
        </div>

        <div className="stat-card">
          <div>
            <span className="stat-label">Encomendas Totais</span>
            <div className="stat-val">{stats.totalOrders}</div>
          </div>
          <div className="icon-box"><ShoppingBag size={24} /></div>
        </div>

        <div className="stat-card">
          <div>
            <span className="stat-label">Planos de Subscrição</span>
            <div className="stat-val">{stats.activePlans}</div>
          </div>
          <div className="icon-box"><Users size={24} /></div>
        </div>

        <div className="stat-card">
          <div>
            <span className="stat-label">Receita Estimada</span>
            <div className="stat-val">{stats.totalRevenue}</div>
          </div>
          <div className="icon-box"><DollarSign size={24} /></div>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1rem' }}>Encomendas Recentes</h3>
        {recentOrders.length === 0 ? (
          <p className="text-muted">Nenhuma encomenda registada até ao momento.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Cliente</th>
                  <th>Data</th>
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
                      <span className="badge badge-success">{order.status || 'Ativo'}</span>
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
