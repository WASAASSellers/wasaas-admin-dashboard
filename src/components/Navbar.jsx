import React, { useState } from 'react';
import { Sun, Moon, Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
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
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Admin Hasan</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
