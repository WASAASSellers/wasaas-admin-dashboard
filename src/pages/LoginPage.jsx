import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Lock, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { loginUser } from '../services/api';

const LoginPage = () => {
  const [whatsApp, setWhatsApp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!whatsApp || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await loginUser(whatsApp, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error || 'Credenciais inválidas.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao comunicar com o servidor de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', padding: '1.5rem' }}>
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--accent-color)', color: '#020617', marginBottom: '1rem' }}>
            <LayoutGrid size={32} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' }}>adminHMD</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Portal de Gestão WASAASSellers</p>
        </div>

        {error && (
          <div className="glass-card" style={{ borderColor: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)' }}>
            <AlertCircle color="var(--danger-color)" size={20} />
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="stat-label">Telemóvel / WhatsApp</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: 923456789"
                value={whatsApp}
                onChange={e => setWhatsApp(e.target.value)}
                required 
                style={{ paddingLeft: '2.5rem' }}
              />
              <Phone size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label className="stat-label">Palavra-passe</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
            <span>{loading ? 'A autenticar...' : 'Entrar no Portal'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <small className="text-muted">Acesso protegido por JWT Bearer com autenticação dupla.</small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
