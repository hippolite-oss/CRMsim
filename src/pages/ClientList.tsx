// pages/ListClients.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Filter, AlertCircle, CheckCircle, ArrowLeft, 
  CreditCard, Phone, Loader2, Eye, Edit, Trash2, PiggyBank 
} from 'lucide-react';


const ListClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArdoise, setFilterArdoise] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchClients();
  }, [filterArdoise]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await Axios.get('/api/clients', {
        params: { avecArdoise: filterArdoise ? 'true' : undefined }
      });
      if (res.data.success) {
        setClients(res.data.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement clients:', error);
      showNotification('Erreur lors du chargement des clients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.prenom && client.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    client.telephone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return;
    try {
      await Axios.delete(`/api/clients/${id}`);
      showNotification('Client supprimé', 'success');
      fetchClients();
    } catch (error) {
      showNotification('Erreur suppression', 'error');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-slide-in ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
            : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.msg}</span>
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="flex-shrink-0 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Clients
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Gestion des clients, ardoises et cotisations
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/clients/nouveau')} 
          className="w-full md:w-auto py-3 px-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-lg"
        >
          <Users className="w-5 h-5" />
          Nouveau client
        </button>
      </div>

      {/* Recherche et filtres */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setFilterArdoise(!filterArdoise)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
                filterArdoise 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Avec ardoise
            </button>
          </div>
        </div>
      </div>

      {/* Liste clients */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <p className="text-2xl text-gray-600 dark:text-gray-400">Aucun client trouvé</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Essayez de modifier votre recherche ou le filtre
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Téléphone</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Ardoise</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Montant cotisé</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                {filteredClients.map(client => (
                  <tr key={client._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {client.nom} {client.prenom}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {client.adresse || 'Aucune adresse'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {client.telephone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                        client.solde_actuel > 0 
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400' 
                          : 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                      }`}>
                        {new Intl.NumberFormat('fr-FR').format(client.solde_actuel || 0)} FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        (client.total_cotisation_disponible || 0) > 0 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400'
                      }`}>
                        {new Intl.NumberFormat('fr-FR').format(client.total_cotisation_disponible || 0)} FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => navigate(`/admin/clients/${client._id}`)} 
                          className="p-2.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition"
                          title="Voir détails"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/clients/edit/${client._id}`)} 
                          className="p-2.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(client._id)} 
                          className="p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListClients;