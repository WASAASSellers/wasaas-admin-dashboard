import React, { useState, useEffect } from 'react';
import { Package, Plus, CheckCircle, RefreshCw } from 'lucide-react';
import { getProducts, getAddons, getPlans, coreApi } from '../services/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  // Form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, a, pl] = await Promise.all([getProducts(), getAddons(), getPlans()]);
      setProducts(p);
      setAddons(a);
      setPlans(pl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    try {
      await coreApi.post('/catalogue/products', {
        name: newProductName,
        description: newProductDesc,
        basePrice: parseFloat(newProductPrice),
        category: 0,
        imageUrl: null
      });

      setNewProductName('');
      setNewProductDesc('');
      setNewProductPrice('');
      await loadAll();
    } catch (err) {
      alert('Erro ao criar produto.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="header-title">Gestão do Catálogo</h1>
          <p className="header-subtitle">Produtos, Serviços, Itens Adicionais e Planos de Subscrição.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadAll} disabled={loading}>
          <RefreshCw size={16} />
          <span>Recarregar</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          Produtos Gerais ({products.length})
        </button>
        <button 
          className={`btn ${activeTab === 'addons' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('addons')}
        >
          Itens Adicionais ({addons.length})
        </button>
        <button 
          className={`btn ${activeTab === 'plans' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('plans')}
        >
          Planos ({plans.length})
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Lista de Itens ({activeTab.toUpperCase()})</h3>
          
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nº / Código</th>
                  <th>Nome</th>
                  <th>Preço Base</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'products' ? products : activeTab === 'addons' ? addons : plans).map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td><code>{item.itemNumber || item.productNumber || item.addonNumber || `PLN-${idx + 1}`}</code></td>
                    <td>
                      <strong>{item.name}</strong>
                      <div className="small text-muted">{item.description}</div>
                    </td>
                    <td><strong>{item.basePrice || item.price} Kz</strong></td>
                    <td><span className="badge badge-success">Ativo</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Adicionar Novo Produto</h3>
          <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="stat-label">Nome do Produto/Serviço</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Produto Especial"
                value={newProductName}
                onChange={e => setNewProductName(e.target.value)}
                required 
              />
            </div>

            <div>
              <label className="stat-label">Descrição</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Detalhes..."
                value={newProductDesc}
                onChange={e => setNewProductDesc(e.target.value)}
              />
            </div>

            <div>
              <label className="stat-label">Preço Base (Kz)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="2500"
                value={newProductPrice}
                onChange={e => setNewProductPrice(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={18} />
              <span>Guardar Produto</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
