import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, CheckCircle2, ShieldCheck, Key, Globe, Bell } from 'lucide-react';
import { getSystemSettings, updateSystemSetting } from '../services/api';

const SettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [values, setValues] = useState({});

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getSystemSettings();
      setSettings(data);
      const valMap = {};
      data.forEach(s => {
        valMap[s.key] = s.value;
      });
      setValues(valMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async (key) => {
    try {
      await updateSystemSetting(key, values[key]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(`Erro ao atualizar a configuração "${key}".`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="header-title">Configurações Globais</h1>
          <p className="header-subtitle">Parâmetros operacionais do sistema, limites diários e integração de gateways.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadSettings} disabled={loading}>
          <RefreshCw size={16} />
          <span>Atualizar</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="glass-card" style={{ borderColor: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <CheckCircle2 color="var(--success-color)" size={20} />
          <span>Configuração atualizada com sucesso no banco de dados!</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={20} color="var(--accent-color)" />
            <span>Parâmetros do Sistema</span>
          </h3>

          {settings.length === 0 ? (
            <p className="text-muted py-4">Nenhuma configuração registada no banco de dados.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {settings.map(s => (
                <div key={s.id || s.key} style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <strong>{s.key}</strong>
                      {s.description && <div className="small text-muted">{s.description}</div>}
                    </div>
                    <span className="badge badge-success">Ativo</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={values[s.key] ?? ''} 
                      onChange={e => handleChange(s.key, e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={() => handleSave(s.key)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <Save size={16} />
                      <span>Guardar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--success-color)" />
            <span>Segurança & Infraestrutura</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '0.5rem' }}>
              <div className="small text-muted">Base de Dados:</div>
              <strong>SQLite Persistente</strong>
              <div className="badge badge-success" style={{ marginTop: '0.5rem' }}>Conectado</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '0.5rem' }}>
              <div className="small text-muted">Cache Distribuído:</div>
              <strong>Redis 7 Alpine</strong>
              <div className="badge badge-success" style={{ marginTop: '0.5rem' }}>Conectado</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '0.5rem' }}>
              <div className="small text-muted">Autenticação:</div>
              <strong>JWT Bearer HMAC SHA256</strong>
              <div className="badge badge-success" style={{ marginTop: '0.5rem' }}>Protegido</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
