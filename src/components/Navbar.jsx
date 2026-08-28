import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, Search, LogOut } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../services/api';

const Navbar = () => {
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();
  const user = getCurrentUser();

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <header className="admin-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <input 
          className="search-input" 
          type="search" 
          placeholder="Pesquisar produtos, encomendas, relatórios..." 
        />
      </div>

      <div className="navbar-actions">
        <button className="icon-btn" onClick={toggleTheme} title="Alternar Tema">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button className="icon-btn" title="Notificações">
          <Bell size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem' }}>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
            alt="Admin" 
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user?.name || 'Administrador'}</span>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.whatsApp || 'WASAAS'}</small>
          </div>
        </div>

        <button 
          className="icon-btn" 
          onClick={handleLogout} 
          title="Terminar Sessão"
          style={{ color: 'var(--danger-color)', marginLeft: '0.5rem' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;

