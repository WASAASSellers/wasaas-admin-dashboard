import React, { useState, useEffect } from 'react';
import { Users, Plus, RefreshCw, Phone, MapPin, Mail, Clock } from 'lucide-react';
import { getClients, registerClient } from '../services/api';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('12:00');

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !whatsApp) return;

    try {
      await registerClient({
        name,
        whatsApp,
        email: email || null,
        address: address || null,
        preferredDeliveryTime: deliveryTime || null
      });

      setName('');
      setWhatsApp('');
      setEmail('');
      setAddress('');
      await loadClients();
    } catch (err) {
      alert('Erro ao registar cliente.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="header-title">Gestão de Clientes</h1>
          <p className="header-subtitle">Base de clientes cadastrados, números de WhatsApp e preferências de entrega.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadClients} disabled={loading}>
          <RefreshCw size={16} />
          <span>Atualizar</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Clientes Cadastrados ({clients.length})</h3>
          
          {clients.length === 0 ? (
            <p className="text-muted py-4">Nenhum cliente encontrado na base de dados.</p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>WhatsApp / Telefone</th>
                    <th>Endereço</th>
                    <th>Horário Preferencial</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.name}</strong>
                        {c.email && <div className="small text-muted">{c.email}</div>}
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={14} className="text-muted" />
                          <code>{c.whatsApp}</code>
                        </span>
                      </td>
                      <td>{c.address || '—'}</td>
                      <td>
                        <span className="badge badge-success">{c.preferredDeliveryTime || '12:00'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Registar Novo Cliente</h3>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="stat-label">Nome Completo</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: João Manuel"
                value={name}
                onChange={e => setName(e.target.value)}
                required 
              />
            </div>

            <div>
              <label className="stat-label">WhatsApp / Telemóvel</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: 923456789"
                value={whatsApp}
                onChange={e => setWhatsApp(e.target.value)}
                required 
              />
            </div>

            <div>
              <label className="stat-label">Email (Opcional)</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="joao@exemplo.ao"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="stat-label">Endereço de Entrega</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Talatona, Luanda"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="stat-label">Horário de Entrega</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="12:00"
                value={deliveryTime}
                onChange={e => setDeliveryTime(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={18} />
              <span>Registar Cliente</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
