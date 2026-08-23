import React, { useState, useEffect } from 'react';
import { LayoutTemplate, Plus, Trash2, Save, Eye, CheckCircle } from 'lucide-react';
import { getPageLayout, savePageLayout } from '../services/api';

const VisualPageBuilder = () => {
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const fetchLayout = async () => {
      const data = await getPageLayout();
      if (data && data.length > 0) {
        setBlocks(data);
      } else {
        // Initial default blocks
        setBlocks([
          { id: '1', type: 'hero', title: 'Bem-vindo ao Nosso Portal', subtitle: 'Produtos e Serviços de Alta Qualidade', ctaText: 'Ver Catálogo' },
          { id: '2', type: 'features', title: 'Nossa Oferta', description: 'Entregas diárias e serviços sob medida.' }
        ]);
      }
    };
    fetchLayout();
  }, []);

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      title: type === 'hero' ? 'Novo Cabeçalho' : type === 'features' ? 'Novos Destaques' : 'Informações de Contacto',
      subtitle: 'Insira a sua descrição aqui...'
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg(false);
    try {
      await savePageLayout(blocks);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      alert('Erro ao guardar o layout.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="header-title">Page Builder Visual</h1>
          <p className="header-subtitle">Construa e publique a Landing Page da sua loja de forma visual e instantânea.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Guardando...' : 'Publicar Página'}</span>
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="glass-card" style={{ borderColor: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle color="var(--success-color)" size={20} />
          <span>Layout publicado com sucesso no microserviço wasaas-page-builder!</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Editor Side */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Blocos da Página ({blocks.length})</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => addBlock('hero')}>+ Hero</button>
              <button className="btn btn-secondary" onClick={() => addBlock('features')}>+ Destaques</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {blocks.map((block, idx) => (
              <div key={block.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-success">Bloco {idx + 1}: {block.type.toUpperCase()}</span>
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.5rem', color: 'var(--danger-color)' }} onClick={() => removeBlock(block.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={block.title || ''} 
                    onChange={e => updateBlock(block.id, 'title', e.target.value)}
                    placeholder="Título do Bloco"
                  />
                  <input 
                    type="text" 
                    className="form-control" 
                    value={block.subtitle || block.description || ''} 
                    onChange={e => updateBlock(block.id, 'subtitle', e.target.value)}
                    placeholder="Subtítulo ou Descrição"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Side */}
        <div className="glass-card" style={{ background: '#020617' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <Eye size={18} />
            <span>Pré-Visualização ao Vivo</span>
          </div>

          <div style={{ borderRadius: '0.5rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            {blocks.map(block => (
              <div key={block.id} style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{block.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{block.subtitle || block.description}</p>
                {block.type === 'hero' && (
                  <button className="btn btn-primary" style={{ marginTop: '1rem' }}>{block.ctaText || 'Saiba Mais'}</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualPageBuilder;
