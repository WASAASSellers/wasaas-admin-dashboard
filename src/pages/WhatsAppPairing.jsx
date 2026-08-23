import React, { useState, useEffect } from 'react';
import { QrCode, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { getWhatsAppStatus } from '../services/api';

const WhatsAppPairing = () => {
  const [status, setStatus] = useState({ isConnected: false, qrCode: null });
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    setLoading(true);
    const data = await getWhatsAppStatus();
    setStatus(data);
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="header-title">Conexão WhatsApp</h1>
          <p className="header-subtitle">Emparelhe o bot do WhatsApp via QR Code para automação de mensagens.</p>
        </div>
        <button className="btn btn-secondary" onClick={checkStatus} disabled={loading}>
          <RefreshCw size={16} />
          <span>Atualizar</span>
        </button>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }} className="glass-card text-center">
        {status.isConnected ? (
          <div style={{ padding: '2rem 0' }}>
            <CheckCircle2 color="var(--success-color)" size={64} style={{ marginBottom: '1rem' }} />
            <h2>WhatsApp Conectado!</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              O bot está ativo e pronto para receber escolhas diárias e atender clientes.
            </p>
          </div>
        ) : (
          <div style={{ padding: '2rem 0' }}>
            <QrCode size={48} style={{ marginBottom: '1rem', color: 'var(--accent-color)' }} />
            <h2>Digitalize o QR Code</h2>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
              Abra o WhatsApp no telemóvel &gt; Dispositivos Conectados &gt; Conectar um Dispositivo.
            </p>

            {status.qrCode ? (
              <div style={{ background: 'white', padding: '1rem', display: 'inline-block', borderRadius: '0.5rem' }}>
                <img src={status.qrCode} alt="WhatsApp QR Code" style={{ width: '220px', height: '220px' }} />
              </div>
            ) : (
              <div className="glass-card" style={{ display: 'inline-block', padding: '1.5rem 2rem' }}>
                <AlertCircle color="var(--warning-color)" size={24} style={{ marginBottom: '0.5rem' }} />
                <p className="small">A aguardar geração do QR Code pelo servidor bot...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppPairing;
