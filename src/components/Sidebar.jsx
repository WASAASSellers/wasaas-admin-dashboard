import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  LayoutTemplate, 
  Share2, 
  QrCode 
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="icon-box">
          <Package size={24} />
        </div>
        <div>
          <h2 className="logo-text">WASAAS</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin Portal</span>
        </div>
      </div>

      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Package size={20} />
            <span>Catálogo & Produtos</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={20} />
            <span>Encomendas</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/subscriptions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <CreditCard size={20} />
            <span>Subscrições & Planos</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/builder" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutTemplate size={20} />
            <span>Page Builder</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/social" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Share2 size={20} />
            <span>Redes Sociais</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/whatsapp" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <QrCode size={20} />
            <span>WhatsApp Connection</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
