import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardHome from './pages/DashboardHome';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import ClientsPage from './pages/ClientsPage';
import FinancePage from './pages/FinancePage';
import VisualPageBuilder from './pages/VisualPageBuilder';
import SocialMediaScheduler from './pages/SocialMediaScheduler';
import WhatsAppPairing from './pages/WhatsAppPairing';
import SubscriptionCart from './pages/SubscriptionCart';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

function AppLayout({ children }) {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <Navbar />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<AppLayout><DashboardHome /></AppLayout>} />
        <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
        <Route path="/orders" element={<AppLayout><OrdersPage /></AppLayout>} />
        <Route path="/clients" element={<AppLayout><ClientsPage /></AppLayout>} />
        <Route path="/finance" element={<AppLayout><FinancePage /></AppLayout>} />
        <Route path="/subscriptions" element={<AppLayout><SubscriptionCart /></AppLayout>} />
        <Route path="/builder" element={<AppLayout><VisualPageBuilder /></AppLayout>} />
        <Route path="/social" element={<AppLayout><SocialMediaScheduler /></AppLayout>} />
        <Route path="/whatsapp" element={<AppLayout><WhatsAppPairing /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

