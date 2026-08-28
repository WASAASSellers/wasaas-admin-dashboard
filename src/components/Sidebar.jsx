import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  LayoutTemplate, 
  Share2, 
  QrCode,
  Users,
  DollarSign,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <a className="brand-mark" href="/">
          <div className="brand-icon">
            <LayoutGrid size={22} />
          </div>
          <div>
            <span className="brand-title">adminHMD</span>
            <span className="brand-subtitle">WASAAS Portal</span>
          </div>
        </a>
      </div>


      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><LayoutDashboard size={18} /></div>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><Package size={18} /></div>
          <span>Catálogo & Produtos</span>
        </NavLink>

        <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><ShoppingBag size={18} /></div>
          <span>Encomendas</span>
        </NavLink>

        <NavLink to="/clients" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><Users size={18} /></div>
          <span>Clientes</span>
        </NavLink>

        <NavLink to="/finance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><DollarSign size={18} /></div>
          <span>Finanças</span>
        </NavLink>

        <NavLink to="/subscriptions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><CreditCard size={18} /></div>
          <span>Faturamento & Planos</span>
        </NavLink>

        <NavLink to="/builder" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><LayoutTemplate size={18} /></div>
          <span>Page Builder</span>
        </NavLink>

        <NavLink to="/social" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><Share2 size={18} /></div>
          <span>Social Hub</span>
        </NavLink>

        <NavLink to="/whatsapp" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><QrCode size={18} /></div>
          <span>WhatsApp Connection</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><Settings size={18} /></div>
          <span>Configurações</span>
        </NavLink>
      </nav>

      <div className="sidebar-user">
        <img 
          className="sidebar-user-avatar" 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
          alt="Admin Avatar" 
        />
        <div className="sidebar-user-info">
          <strong>Admin Portal</strong>
          <small>WASAAS Manager</small>
        </div>
      </div>
    </aside>
  );
};


export default Sidebar;
