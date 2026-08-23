import React, { useState, useEffect } from 'react';
import { Share2, Plus, Calendar, Clock, CheckCircle } from 'lucide-react';
import { getScheduledPosts, scheduleSocialPost } from '../services/api';

const SocialMediaScheduler = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const loadPosts = async () => {
    const data = await getScheduledPosts();
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!content) return;

    setLoading(true);
    setSuccessMsg(false);
    try {
      await scheduleSocialPost({
        content,
        platform,
        scheduledAt: scheduledAt || new Date().toISOString()
      });
      setContent('');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
      await loadPosts();
    } catch (err) {
      alert('Erro ao agendar post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="header-title">Social Hub & Agendador</h1>
        <p className="header-subtitle">Gestão automatizada de publicações em redes sociais (Facebook, Instagram, WhatsApp).</p>
      </div>

      {successMsg && (
        <div className="glass-card" style={{ borderColor: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle color="var(--success-color)" size={20} />
          <span>Publicação agendada com sucesso no wasaas-social-hub!</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Agendar Nova Publicação</h3>
          <form onSubmit={handleSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="stat-label">Plataforma</label>
              <select className="form-control" value={platform} onChange={e => setPlatform(e.target.value)}>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="whatsapp_status">WhatsApp Status</option>
              </select>
            </div>

            <div>
              <label className="stat-label">Texto da Publicação</label>
              <textarea 
                className="form-control" 
                rows="4" 
                placeholder="Escreva a sua mensagem..." 
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="stat-label">Data e Hora de Envio</label>
              <input 
                type="datetime-local" 
                className="form-control" 
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Plus size={16} />
              <span>{loading ? 'Agendando...' : 'Agendar Post'}</span>
            </button>
          </form>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Fila de Publicações Agendadas ({posts.length})</h3>
          {posts.length === 0 ? (
            <p className="text-muted">Nenhuma publicação agendada.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {posts.map((p, idx) => (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-warning">{p.platform?.toUpperCase() || 'POST'}</span>
                    <span className="small text-muted">{new Date(p.scheduledAt).toLocaleString()}</span>
                  </div>
                  <p className="small">{p.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaScheduler;
