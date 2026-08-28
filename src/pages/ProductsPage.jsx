import React, { useState, useEffect } from 'react';
import { Package, Plus, CheckCircle, RefreshCw, Edit2, Trash2, X, Save } from 'lucide-react';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAddons, 
  createAddon, 
  updateAddon, 
  deleteAddon, 
  getPlans 
} from '../services/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  // Form states (Add)
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  // Form states (Edit Modal)
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('');

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
      if (activeTab === 'products') {
        await createProduct({
          name: newProductName,
          description: newProductDesc,
          basePrice: parseFloat(newProductPrice),
          category: 0,
          imageUrl: null
        });
      } else if (activeTab === 'addons') {
        await createAddon({
          name: newProductName,
          description: newProductDesc,
          basePrice: parseFloat(newProductPrice),
          category: 0,
          imageUrl: null
        });
      }

      setNewProductName('');
      setNewProductDesc('');
      setNewProductPrice('');
      await loadAll();
    } catch (err) {
      alert('Erro ao criar item.');
    }
  };

  const handleStartEdit = (item) => {
    setEditingItem(item);
    setEditName(item.name || '');
    setEditDesc(item.description || '');
    setEditPrice(item.basePrice || item.price || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (activeTab === 'products') {
        await updateProduct(editingItem.id, {
          name: editName,
          description: editDesc,
          basePrice: parseFloat(editPrice),
          category: editingItem.category ?? 0,
          imageUrl: editingItem.imageUrl
        });
      } else if (activeTab === 'addons') {
        await updateAddon(editingItem.id, {
          name: editName,
          description: editDesc,
          basePrice: parseFloat(editPrice),
          category: editingItem.category ?? 0,
          imageUrl: editingItem.imageUrl
        });
      }

      setEditingItem(null);
      await loadAll();
    } catch (err) {
      alert('Erro ao atualizar item.');
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Tem certeza que deseja desativar "${item.name}"?`)) return;

    try {
      if (activeTab === 'products') {
        await deleteProduct(item.id);
      } else if (activeTab === 'addons') {
        await deleteAddon(item.id);
      }
      await loadAll();
    } catch (err) {
      alert('Erro ao desativar item.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="header-title">Gestão do Catálogo</h1>
          <p className="header-subtitle">Produtos, Serviços, Itens Adicionais e Planos de Subscrição com CRUD completo.</p>
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
                  <th>Ações</th>
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
                    <td><strong>{(item.basePrice || item.price)?.toLocaleString()} Kz</strong></td>
                    <td>
                      <span className={`badge ${item.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                        {item.isActive !== false ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      {activeTab !== 'plans' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.3rem 0.5rem' }} 
                            title="Editar"
                            onClick={() => handleStartEdit(item)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.3rem 0.5rem', color: 'var(--danger-color)' }} 
                            title="Desativar"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Column: Edit or Create */}
        <div className="glass-card">
          {editingItem ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Editar {activeTab === 'products' ? 'Produto' : 'Item Adicional'}</h3>
                <button className="btn btn-secondary" style={{ padding: '0.2rem 0.4rem' }} onClick={() => setEditingItem(null)}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="stat-label">Nome</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    required 
                  />
                </div>

                <div>
                  <label className="stat-label">Descrição</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                  />
                </div>

                <div>
                  <label className="stat-label">Preço Base (Kz)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    <Save size={16} />
                    <span>Guardar Alterações</span>
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>
                Adicionar Novo {activeTab === 'products' ? 'Produto' : activeTab === 'addons' ? 'Adicional' : 'Item'}
              </h3>
              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="stat-label">Nome</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder={`Ex: Novo ${activeTab === 'products' ? 'Produto' : 'Item'}`}
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
                    placeholder="Detalhes e especificações..."
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
                  <span>Guardar {activeTab === 'products' ? 'Produto' : 'Adicional'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

