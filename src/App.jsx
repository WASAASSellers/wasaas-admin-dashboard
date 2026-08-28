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
import ProtectedRoute from './components/ProtectedRoute';


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
        
        <Route path="/" element={<ProtectedRoute><AppLayout><DashboardHome /></AppLayout></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><AppLayout><ProductsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><AppLayout><OrdersPage /></AppLayout></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><AppLayout><ClientsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/finance" element={<ProtectedRoute><AppLayout><FinancePage /></AppLayout></ProtectedRoute>} />
        <Route path="/subscriptions" element={<ProtectedRoute><AppLayout><SubscriptionCart /></AppLayout></ProtectedRoute>} />
        <Route path="/builder" element={<ProtectedRoute><AppLayout><VisualPageBuilder /></AppLayout></ProtectedRoute>} />
        <Route path="/social" element={<ProtectedRoute><AppLayout><SocialMediaScheduler /></AppLayout></ProtectedRoute>} />
        <Route path="/whatsapp" element={<ProtectedRoute><AppLayout><WhatsAppPairing /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;

