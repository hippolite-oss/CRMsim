import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientForm from './pages/ClientForm';
import Opportunites from './pages/Opportunites';
import OpportuniteForm from './pages/OpportuniteForm';
import Contacts from './pages/Contacts';
import ContactForm from './pages/ContactForm';
import Projets from './pages/Projets';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/nouveau" element={<ClientForm />} />
          <Route path="clients/:id/edit" element={<ClientForm />} />
          <Route path="opportunites" element={<Opportunites />} />
          <Route path="opportunites/nouvelle" element={<OpportuniteForm />} />
          <Route path="opportunites/:id/edit" element={<OpportuniteForm />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="Projets" element={<Projets />} />
          <Route path="contacts/nouveau" element={<ContactForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
