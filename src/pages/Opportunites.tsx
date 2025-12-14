import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Filter, Edit, Trash2, Target, DollarSign, TrendingUp,
  TrendingDown, Search, Users, Calendar, Award, Sparkles,
  BarChart, ChevronRight, RefreshCw, Eye, Download, MoreVertical,
  Clock, Activity, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { opportuniteService } from '../services/storageService';
import { clientService } from '../services/storageService';
import { Opportunite, OpportuniteStatus } from '../types';

const Opportunites = () => {
  const [opportunites, setOpportunites] = useState<Opportunite[]>([]);
  const [filteredOpportunites, setFilteredOpportunites] = useState<Opportunite[]>([]);
  const [statusFilter, setStatusFilter] = useState<OpportuniteStatus | 'Tous'>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState<string>('Tous');
  const [montantFilter, setMontantFilter] = useState<string>('Tous');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; opportunite: Opportunite | null }>({
    isOpen: false,
    opportunite: null,
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'kanban'>('table');
  const [selectedOpportunites, setSelectedOpportunites] = useState<string[]>([]);
  const navigate = useNavigate();

  const clients = clientService.getAll();
  const montantRanges = [
    { value: 'Tous', label: 'Tous les montants' },
    { value: 'petit', label: 'Moins de 5 000 €' },
    { value: 'moyen', label: '5 000 - 25 000 €' },
    { value: 'grand', label: 'Plus de 25 000 €' },
  ];

  useEffect(() => {
    loadOpportunites();
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    filterOpportunites();
  }, [statusFilter, searchQuery, clientFilter, montantFilter, opportunites]);

  const loadOpportunites = () => {
    const allOpportunites = opportuniteService.getAll();
    setOpportunites(allOpportunites);
  };

  const filterOpportunites = () => {
    let filtered = opportunites;

    if (statusFilter !== 'Tous') {
      filtered = filtered.filter(o => o.statut === statusFilter);
    }

    if (clientFilter !== 'Tous') {
      filtered = filtered.filter(o => o.clientId === clientFilter);
    }

    if (montantFilter !== 'Tous') {
      switch (montantFilter) {
        case 'petit':
          filtered = filtered.filter(o => o.montant < 5000);
          break;
        case 'moyen':
          filtered = filtered.filter(o => o.montant >= 5000 && o.montant <= 25000);
          break;
        case 'grand':
          filtered = filtered.filter(o => o.montant > 25000);
          break;
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opportunite => {
        const client = clientService.getById(opportunite.clientId);
        return (
          opportunite.titre.toLowerCase().includes(query) ||
          (client?.nom.toLowerCase().includes(query) || false) ||
          (client?.entreprise?.toLowerCase().includes(query) || false) ||
          opportunite.description?.toLowerCase().includes(query) ||
          false
        );
      });
    }

    setFilteredOpportunites(filtered);
  };

  const handleDelete = () => {
    if (deleteModal.opportunite) {
      const success = opportuniteService.delete(deleteModal.opportunite.id);
      if (success) {
        setAlert({ 
          type: 'success', 
          message: `Opportunité "${deleteModal.opportunite.titre}" supprimée avec succès !` 
        });
        loadOpportunites();
        setTimeout(() => setAlert(null), 3000);
      } else {
        setAlert({ 
          type: 'error', 
          message: 'Erreur lors de la suppression de l\'opportunité' 
        });
      }
      setDeleteModal({ isOpen: false, opportunite: null });
    }
  };

  const handleBulkDelete = () => {
    if (selectedOpportunites.length > 0) {
      const successCount = selectedOpportunites.reduce((count, id) => {
        return opportuniteService.delete(id) ? count + 1 : count;
      }, 0);
      
      if (successCount > 0) {
        setAlert({ 
          type: 'success', 
          message: `${successCount} opportunité(s) supprimée(s) avec succès !` 
        });
        loadOpportunites();
        setSelectedOpportunites([]);
        setTimeout(() => setAlert(null), 3000);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStats = () => {
    const total = opportunites.length;
    const gagnees = opportunites.filter(o => o.statut === 'Gagné').length;
    const enCours = opportunites.filter(o => o.statut === 'En cours').length;
    const montantTotal = opportunites.reduce((sum, o) => sum + o.montant, 0);
    const montantGagne = opportunites
      .filter(o => o.statut === 'Gagné')
      .reduce((sum, o) => sum + o.montant, 0);
    
    return { total, gagnees, enCours, montantTotal, montantGagne };
  };

  const getStatusColor = (status: OpportuniteStatus) => {
    switch (status) {
      case 'Gagné':
        return { 
          bg: 'from-green-500 to-emerald-600',
          light: 'bg-green-100',
          text: 'text-green-800',
          icon: CheckCircle
        };
      case 'Perdu':
        return { 
          bg: 'from-red-500 to-rose-600',
          light: 'bg-red-100',
          text: 'text-red-800',
          icon: XCircle
        };
      case 'En cours':
        return { 
          bg: 'from-blue-500 to-cyan-600',
          light: 'bg-blue-100',
          text: 'text-blue-800',
          icon: Activity
        };
      case 'Nouveau':
      default:
        return { 
          bg: 'from-yellow-500 to-amber-600',
          light: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: Clock
        };
    }
  };

  const getProbabilityColor = (probability?: number) => {
    if (!probability) return 'bg-gray-200';
    if (probability >= 70) return 'bg-green-500';
    if (probability >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const stats = getStats();

  const toggleSelection = (id: string) => {
    setSelectedOpportunites(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedOpportunites.length === filteredOpportunites.length) {
      setSelectedOpportunites([]);
    } else {
      setSelectedOpportunites(filteredOpportunites.map(o => o.id));
    }
  };

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
                className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg"
              >
                <Target className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                  Opportunités
                </h1>
                <p className="text-gray-600 mt-1">
                  Gérez votre pipeline commercial et maximisez vos revenus
                </p>
              </div>
            </div>
            
            {/* Statistiques rapides */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Gagnées</p>
                    <p className="text-2xl font-bold text-green-800">{stats.gagnees}</p>
                  </div>
                  <Award className="h-5 w-5 text-green-600" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">En cours</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.enCours}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700">Valeur totale</p>
                    <p className="text-xl font-bold text-purple-800">{formatCurrency(stats.montantTotal)}</p>
                  </div>
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {selectedOpportunites.length > 0 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Button
                  variant="danger"
                  onClick={handleBulkDelete}
                  className="bg-gradient-to-r from-red-500 to-rose-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer ({selectedOpportunites.length})
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedOpportunites([])}
                >
                  Annuler
                </Button>
              </motion.div>
            )}
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link to="/opportunites/nouvelle">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg hover:shadow-xl transition-shadow">
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle opportunité
                </Button>
              </Link>
            </motion.div>
          </div>
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
                placeholder="Rechercher une opportunité par titre, client, description..."
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
          
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative flex-1 lg:flex-none min-w-[180px]"
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OpportuniteStatus | 'Tous')}
                className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="Nouveau">Nouveau</option>
                <option value="En cours">En cours</option>
                <option value="Gagné">Gagné</option>
                <option value="Perdu">Perdu</option>
              </select>
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative flex-1 lg:flex-none min-w-[180px]"
            >
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="Tous">Tous les clients</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom}
                  </option>
                ))}
              </select>
              <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative flex-1 lg:flex-none min-w-[180px]"
            >
              <select
                value={montantFilter}
                onChange={(e) => setMontantFilter(e.target.value)}
                className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {montantRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </motion.div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={loadOpportunites}
                className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                title="Actualiser"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </motion.button>
              
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                {(['table', 'grid', 'kanban'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-2 ${viewMode === mode ? 'bg-blue-50 text-blue-600 border-r border-gray-300' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {mode === 'table' && 'Tableau'}
                    {mode === 'grid' && 'Grille'}
                    {mode === 'kanban' && 'Kanban'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vue Tableau (principale) */}
      {viewMode === 'table' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {loading ? (
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
          ) : filteredOpportunites.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-12 text-center"
            >
              <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
                <Target className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'Tous' ? 'Aucune opportunité trouvée' : 'Aucune opportunité'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery || statusFilter !== 'Tous' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par créer votre première opportunité'}
              </p>
              <Link to="/opportunites/nouvelle">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-600">
                  <Plus className="h-5 w-5 mr-2" />
                  Créer une opportunité
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedOpportunites.length === filteredOpportunites.length}
                          onChange={selectAll}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Opportunité
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date de clôture
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredOpportunites.map((opportunite, index) => {
                        const client = clientService.getById(opportunite.clientId);
                        const colors = getStatusColor(opportunite.statut);
                        const StatusIcon = colors.icon;
                        
                        return (
                          <motion.tr
                            key={opportunite.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ 
                              backgroundColor: 'rgba(59, 130, 246, 0.03)',
                              transition: { duration: 0.2 }
                            }}
                            className={`group cursor-pointer ${
                              selectedOpportunites.includes(opportunite.id) ? 'bg-blue-50' : ''
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedOpportunites.includes(opportunite.id)}
                                onChange={() => toggleSelection(opportunite.id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} shadow-md`}
                                >
                                  <Target className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                  <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                    {opportunite.titre}
                                  </p>
                                  {opportunite.description && (
                                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                      {opportunite.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      Créée le {formatDate(opportunite.dateCreation)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-white font-bold">
                                  {client?.nom.charAt(0) || '?'}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{client?.nom || 'Client inconnu'}</p>
                                  <p className="text-sm text-gray-500">{client?.entreprise || ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="font-bold text-gray-900">{formatCurrency(opportunite.montant)}</p>
                                {opportunite.probabilite && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${getProbabilityColor(opportunite.probabilite)}`}
                                        style={{ width: `${opportunite.probabilite}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">
                                      {opportunite.probabilite}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.light} ${colors.text}`}
                              >
                                <StatusIcon className="h-4 w-4" />
                                <span className="text-sm font-medium">{opportunite.statut}</span>
                              </motion.div>
                              {opportunite.priorite === 'Haute' && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="inline-block ml-2"
                                >
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                </motion.div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900">
                                  {formatDate(opportunite.dateClotureEstimee)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {(() => {
                                  const daysLeft = Math.ceil(
                                    (new Date(opportunite.dateClotureEstimee).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                                  );
                                  if (daysLeft > 30) return 'Plus de 30 jours';
                                  if (daysLeft > 0) return `${daysLeft} jours restants`;
                                  if (daysLeft === 0) return 'Aujourd\'hui';
                                  return 'Dépassée';
                                })()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => navigate(`/opportunites/${opportunite.id}`)}
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Voir détails"
                                >
                                  <Eye className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => navigate(`/opportunites/${opportunite.id}/edit`)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Modifier"
                                >
                                  <Edit className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setDeleteModal({ isOpen: true, opportunite })}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              {/* Pied de table */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">{filteredOpportunites.length}</span> opportunité(s)
                      {selectedOpportunites.length > 0 && (
                        <span className="ml-2 text-blue-600">
                          • <span className="font-semibold">{selectedOpportunites.length}</span> sélectionnée(s)
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <BarChart className="h-4 w-4" />
                      <span>
                        Valeur totale : <span className="font-semibold">{formatCurrency(
                          filteredOpportunites.reduce((sum, o) => sum + o.montant, 0)
                        )}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      ) : viewMode === 'grid' ? (
        // Vue Grille
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredOpportunites.map((opportunite, index) => {
            const client = clientService.getById(opportunite.clientId);
            const colors = getStatusColor(opportunite.statut);
            const StatusIcon = colors.icon;
            
            return (
              <motion.div
                key={opportunite.id}
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
                        className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} shadow-md`}
                      >
                        <Target className="h-5 w-5 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {opportunite.titre}
                        </h3>
                        <p className="text-sm text-gray-500">{client?.nom || 'Client inconnu'}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedOpportunites.includes(opportunite.id)}
                      onChange={() => toggleSelection(opportunite.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {opportunite.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {opportunite.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Montant</span>
                      <span className="font-bold text-gray-900">{formatCurrency(opportunite.montant)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Statut</span>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${colors.text}`} />
                        <span className={`text-sm font-medium ${colors.text}`}>
                          {opportunite.statut}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Clôture estimée</span>
                      <span className="text-sm text-gray-900">
                        {formatDate(opportunite.dateClotureEstimee)}
                      </span>
                    </div>
                    
                    {opportunite.probabilite && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-600">Probabilité</span>
                          <span className="text-sm font-medium text-gray-900">
                            {opportunite.probabilite}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProbabilityColor(opportunite.probabilite)}`}
                            style={{ width: `${opportunite.probabilite}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/opportunites/${opportunite.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteModal({ isOpen: true, opportunite })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => navigate(`/opportunites/${opportunite.id}`)}
                      className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
                    >
                      Voir détails
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        // Vue Kanban
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(['Nouveau', 'En cours', 'Gagné', 'Perdu'] as OpportuniteStatus[]).map((status) => {
            const opportunitiesInStatus = filteredOpportunites.filter(o => o.statut === status);
            const colors = getStatusColor(status);
            
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${colors.light}`}>
                      <Target className={`h-4 w-4 ${colors.text}`} />
                    </div>
                    <h3 className="font-bold text-gray-900">{status}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}>
                    {opportunitiesInStatus.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {opportunitiesInStatus.map((opportunite) => {
                    const client = clientService.getById(opportunite.clientId);
                    
                    return (
                      <motion.div
                        key={opportunite.id}
                        whileHover={{ y: -2 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                      >
                        <div className="mb-2">
                          <h4 className="font-medium text-gray-900 line-clamp-2">
                            {opportunite.titre}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">{client?.nom}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">
                            {formatCurrency(opportunite.montant)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/opportunites/${opportunite.id}/edit`)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ isOpen: true, opportunite })}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modale de suppression améliorée */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, opportunite: null })}
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
            Supprimer "{deleteModal.opportunite?.titre}" ?
          </h3>
          <p className="text-gray-600 mb-4">
            Cette action est irréversible. Toutes les données associées à cette opportunité seront définitivement supprimées.
          </p>
          {deleteModal.opportunite && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ Le client et les contacts associés ne seront pas affectés
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Bouton flottant pour mobile */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 md:hidden"
      >
        <Link to="/opportunites/nouvelle">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full shadow-xl"
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Opportunites;