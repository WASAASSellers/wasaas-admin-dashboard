import React, { useState, useEffect } from 'react';
import { ShoppingBag, Send, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getOrders, triggerDailyChoicesNotification } from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState(false);
  const [notifyResult, setNotifyResult] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleNotifyChoices = async () => {
    setNotifying(true);
    setNotifyResult(null);
    try {
      const res = await triggerDailyChoicesNotification();
      setNotifyResult(`Sucesso! Notificações enviadas para ${res.data ?? 0} cliente(s).`);
    } catch (err) {
      setNotifyResult('Erro ao disparar notificações de escolhas.');
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="header-title">Gestão de Encomendas</h1>
          <p className="header-subtitle">Acompanhe pedidos, seleções diárias e envie notificações via WhatsApp.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handleNotifyChoices} disabled={notifying}>
            <Send size={16} />
            <span>{notifying ? 'Enviando...' : 'Disparar Escolhas do Dia'}</span>
          </button>
          
          <button className="btn btn-secondary" onClick={loadOrders} disabled={loading}>
            <RefreshCw size={16} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {notifyResult && (
        <div className="glass-card" style={{ borderColor: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 color="var(--success-color)" size={20} />
          <span>{notifyResult}</span>
        </div>
      )}

      <div className="glass-card">
        <h3 style={{ marginBottom: '1rem' }}>Todas as Encomendas ({orders.length})</h3>
        
        {orders.length === 0 ? (
          <p className="text-muted py-4">Nenhuma encomenda encontrada na base de dados.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Cliente</th>
                  <th>Data Agendada</th>
                  <th>Horário</th>
                  <th>Endereço</th>
                  <th>Qtd. Itens</th>
                  <th>Preço Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td><strong>{o.orderNumber}</strong></td>
                    <td>{o.clientName || 'Cliente'}</td>
                    <td>{new Date(o.scheduledDate).toLocaleDateString()}</td>
                    <td>{o.scheduledTime || '12:00'}</td>
                    <td>{o.deliveryAddress}</td>
                    <td>{o.quantity}</td>
                    <td><strong>{o.totalPrice || 0} Kz</strong></td>
                    <td>
                      <span className="badge badge-success">{o.status || 'Pendente'}</span>
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

export default OrdersPage;
