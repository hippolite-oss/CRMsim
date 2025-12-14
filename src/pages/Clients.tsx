import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Edit, Trash2, Eye, Filter, Users, 
  Activity, Download, MoreVertical, ChevronRight,
  TrendingUp, UserPlus, RefreshCw, Shield, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { clientService } from '../services/storageService';
import { Client } from '../types';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Tous' | 'Actif' | 'Inactif'>('Tous');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; client: Client | null }>({
    isOpen: false,
    client: null,
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
    // Simuler un chargement
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchQuery, statusFilter, clients]);

  const loadClients = () => {
    const allClients = clientService.getAll();
    setClients(allClients);
    setFilteredClients(allClients);
  };

  const filterClients = () => {
    let filtered = clients;

    // Recherche
    if (searchQuery) {
      filtered = clientService.search(searchQuery);
    }

    // Filtre par statut
    if (statusFilter !== 'Tous') {
      filtered = filtered.filter(c => c.statut === statusFilter);
    }

    setFilteredClients(filtered);
  };

  const handleDelete = () => {
    if (deleteModal.client) {
      const success = clientService.delete(deleteModal.client.id);
      if (success) {
        setAlert({ 
          type: 'success', 
          message: `Client ${deleteModal.client.nom} supprimé avec succès !` 
        });
        loadClients();
        
        // Auto-dismiss alert
        setTimeout(() => setAlert(null), 3000);
      } else {
        setAlert({ 
          type: 'error', 
          message: 'Erreur lors de la suppression du client' 
        });
      }
      setDeleteModal({ isOpen: false, client: null });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStats = () => {
    const total = clients.length;
    const actifs = clients.filter(c => c.statut === 'Actif').length;
    const inactifs = total - actifs;
    const actifsPercentage = total > 0 ? Math.round((actifs / total) * 100) : 0;
    
    return { total, actifs, inactifs, actifsPercentage };
  };

  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-4 md:p-6"
    >
      {/* Header avec animations */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl shadow-lg"
              >
                <Users className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                  Clients
                </h1>
                <p className="text-gray-600 mt-1">
                  Gérez votre portefeuille client avec efficacité
                </p>
              </div>
            </div>
            
            {/* Statistiques rapides */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mt-4"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  {stats.total} clients
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg border border-green-200">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {stats.actifs} actifs ({stats.actifsPercentage}%)
                </span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Link to="/clients/nouveau">
              <Button className="bg-gradient-to-r from-primary-500 to-blue-600 shadow-lg hover:shadow-xl transition-shadow">
                <UserPlus className="h-5 w-5 mr-2" />
                Nouveau client
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Alertes animées */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="mb-6"
          >
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
              animated={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panneau de contrôle amélioré */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un client par nom, email, téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative flex-1 lg:flex-none"
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'Tous' | 'Actif' | 'Inactif')}
                className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </motion.div>
            
            <motion.button
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={loadClients}
              className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              title="Actualiser"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </motion.button>
            
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600 border-r border-gray-300' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Grille
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vue Liste (améliorée) */}
      {viewMode === 'list' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {loading ? (
            // Squelette de chargement
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredClients.length === 0 ? (
            // État vide
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-12 text-center"
            >
              <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'Tous' ? 'Aucun client trouvé' : 'Aucun client'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery || statusFilter !== 'Tous' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par ajouter votre premier client'}
              </p>
              <Link to="/clients/nouveau">
                <Button className="bg-gradient-to-r from-primary-500 to-blue-600">
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter un client
                </Button>
              </Link>
            </motion.div>
          ) : (
            // Tableau des clients
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date d'ajout
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredClients.map((client, index) => (
                      <motion.tr
                        key={client.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          backgroundColor: 'rgba(59, 130, 246, 0.03)',
                          transition: { duration: 0.2 }
                        }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="h-10 w-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                            >
                              {client.nom.charAt(0)}
                            </motion.div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                                  {client.nom}
                                </p>
                                {client.statut === 'Actif' && (
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-2 w-2 rounded-full bg-green-500"
                                  />
                                )}
                              </div>
                              {client.entreprise && (
                                <p className="text-sm text-gray-500">{client.entreprise}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <a 
                                href={`mailto:${client.email}`}
                                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                              >
                                {client.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <a 
                                href={`tel:${client.telephone}`}
                                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                              >
                                {client.telephone}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                              client.statut === 'Actif'
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
                            }`}
                          >
                            {client.statut === 'Actif' ? (
                              <>
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                Actif
                              </>
                            ) : 'Inactif'}
                          </motion.span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(client.dateCreation)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/clients/${client.id}/edit`);
                              }}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="h-5 w-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteModal({ isOpen: true, client });
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="h-5 w-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/clients/${client.id}`);
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Voir détails"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pied de table */}
          {filteredClients.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Affichage de <span className="font-semibold">{filteredClients.length}</span> clients
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Données sécurisées et chiffrées
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        // Vue Grille
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading ? (
            // Squelette de grille
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))
          ) : filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className="h-12 w-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                    >
                      {client.nom.charAt(0)}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                        {client.nom}
                      </h3>
                      <p className="text-sm text-gray-500">{client.entreprise || 'Aucune entreprise'}</p>
                    </div>
                  </div>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      client.statut === 'Actif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {client.statut}
                  </motion.span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a 
                      href={`mailto:${client.email}`}
                      className="text-gray-600 hover:text-primary-600 transition-colors truncate"
                    >
                      {client.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{client.telephone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{formatDate(client.dateCreation)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/clients/${client.id}/edit`)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteModal({ isOpen: true, client })}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="text-sm text-gray-600 hover:text-primary-600 flex items-center gap-1 transition-colors"
                  >
                    Voir détails
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modale de suppression améliorée */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, client: null })}
        title="Confirmer la suppression"
        onConfirm={handleDelete}
        confirmLabel="Supprimer définitivement"
        confirmVariant="danger"
        animated={true}
      >
        <div className="text-center py-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Supprimer {deleteModal.client?.nom} ?
          </h3>
          <p className="text-gray-600 mb-4">
            Cette action est irréversible. Toutes les données associées à ce client seront définitivement supprimées.
          </p>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ Les opportunités et notes liées seront également supprimées
            </p>
          </div>
        </div>
      </Modal>

      {/* Bouton flottant pour mobile */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 md:hidden"
      >
        <Link to="/clients/nouveau">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-full shadow-xl"
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

// Ajout des composants manquants pour le code
const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Phone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default Clients;