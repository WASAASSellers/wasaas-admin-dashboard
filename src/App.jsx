import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardHome from './pages/DashboardHome';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import VisualPageBuilder from './pages/VisualPageBuilder';
import SocialMediaScheduler from './pages/SocialMediaScheduler';
import WhatsAppPairing from './pages/WhatsAppPairing';
import SubscriptionCart from './pages/SubscriptionCart';

function App() {
  return (
    <BrowserRouter>
      <div className="admin-shell">
        <Sidebar />
        <div className="admin-main">
          <Navbar />
          <main className="dashboard-content">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/subscriptions" element={<SubscriptionCart />} />
              <Route path="/builder" element={<VisualPageBuilder />} />
              <Route path="/social" element={<SocialMediaScheduler />} />
              <Route path="/whatsapp" element={<WhatsAppPairing />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
