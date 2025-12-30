// App.tsx - Version simplifiée
import { BrowserRouter as Router, Routes, Route, Navigate,Outlet } from 'react-router-dom';

// Import des pages
import Reports from './pages/Reports';
import CompanySettings from './pages/CompanySettings';
import SettingsUsers from './pages/SettingsUsers';
import CashRegister from './pages/CashRegister';
import Activitie from './pages/Activitie';
import StockHistory from './pages/StockHistory';
import StockMovements from './pages/StockMovements';
import NewProduct from './pages/NewProduct';
import ProductsList from './pages/ProductsList';
import Invoices from './pages/Invoices';
import Quotes from './pages/Quotes';
import NewSale from './pages/NewSale';
import SalesHistory from './pages/SalesHistory';
import NewClient from './pages/NewClient';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import Sidebar from './components/Sidebar';
import Centre from './pages/Centre';
import Home from './pages/Home'; // Page d'accueil
import Otp from './pages/Otp';
import Users from './pages/Users';
import Login from './pages/Login';
import ForgotPassword from './pages/Forgotpassword';
import Commande from './pages/Commande';

// Layout pour les pages avec sidebar
const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

// Layout pour les pages sans sidebar
const PublicLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} /> {/* Page d'accueil par défaut */}
          <Route path="/home" element={<Home />} />
          <Route path="/otp" element={<Otp />} />
           <Route path="/login" element={<Login />} />
           <Route path="/commande" element={<Commande/>}/>
            <Route path="/password" element={<ForgotPassword />} />
        </Route>

        {/* Routes protégées avec Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }

        {/* Routes avec sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/nouveau" element={<NewClient />} />
          <Route path="/ventes" element={<SalesHistory />} />
          <Route path="/ventes/nouvelle" element={<NewSale />} />
          <Route path="/devis" element={<Quotes />} />
          <Route path="/factures" element={<Invoices />} />
          <Route path="/produits" element={<ProductsList />} />
          <Route path="/produits/nouveau" element={<NewProduct />} />
          <Route path="/stock/mouvements" element={<StockMovements />} />
          <Route path="/stock/historique" element={<StockHistory />} />
          <Route path="/activites" element={<Activitie />} />
          <Route path="/rapports" element={<Reports />} />
          <Route path="/utilisateurs" element={<Users />} />
          <Route path="/caisse" element={<CashRegister />} />
          <Route path="/paramètres/utilisateurs" element={<SettingsUsers />} />
          <Route path="/paramètres/societe" element={<CompanySettings />} />
          <Route path="/paramètres/Centre" element={<Centre />} />
        </Route>

        {/* Redirection pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;