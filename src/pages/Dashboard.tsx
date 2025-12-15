import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, TrendingUp, DollarSign, MessageSquare, Plus, 
  ChevronRight, Activity, Target, Award, Sparkles,
  Calendar, Mail, Phone, RefreshCw, Eye, Download,
  BarChart3, PieChart, Filter, MoreVertical
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { statisticsService } from '../services/statisticsService';
import { Statistiques, Opportunity, Client } from '../types';
import { opportuniteService } from '../services/storageService';
import { clientService } from '../services/storageService';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';

// Types pour les filtres
type TimeRange = 'today' | 'week' | 'month' | 'quarter' | 'year';
type ViewMode = 'grid' | 'list';

const Dashboard = () => {
  // États principaux
  const [stats, setStats] = useState<Statistiques>({
    totalClients: 0,
    clientsActifs: 0,
    totalOpportunites: 0,
    opportunitesGagnees: 0,
    montantTotal: 0,
    contactsRecents: 0,
    conversionRate: 0,
    averageDealSize: 0,
    revenueGrowth: 0
  });

  const [animatedStats, setAnimatedStats] = useState(stats);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [error, setError] = useState<string | null>(null);
  
  // Références pour les animations
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  // Mémoisation des données
  const opportunitesRecentes = useMemo(() => 
    opportuniteService.getAll()
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, 5),
    []
  );

  const clientsRecents = useMemo(() => 
    clientService.getAll()
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, 5),
    []
  );

  // Chargement des données
  const loadStats = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // Simulation d'un délai pour démo
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const statistics = statisticsService.getStatistics();
      setStats(statistics);
      
      // Animation progressive
      Object.keys(statistics).forEach((key, index) => {
        setTimeout(() => {
          setAnimatedStats(prev => ({
            ...prev,
            [key]: statistics[key as keyof Statistiques]
          }));
        }, index * 100);
      });
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Handlers
  const handleRefresh = () => {
    loadStats();
  };

  const handleExport = () => {
    // Logique d'export
    console.log('Exporting dashboard data...');
  };

  // Formateurs
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  const getProgressPercentage = useCallback(() => {
    return stats.totalOpportunites > 0 
      ? Math.round((stats.opportunitesGagnees / stats.totalOpportunites) * 100)
      : 0;
  }, [stats]);

  // Statistiques avancées
  const statCards = useMemo(() => [
    {
      title: "Total Clients",
      value: animatedStats.totalClients,
      icon: Users,
      color: "primary" as const,
      trend: "up" as const,
      change: "+12%",
      description: "Clients actifs et prospectifs"
    },
    {
      title: "Clients Actifs",
      value: animatedStats.clientsActifs,
      icon: Users,
      color: "green" as const,
      trend: "up" as const,
      change: "+5%",
      description: "Engagés dans un projet"
    },
    {
      title: "Opportunités",
      value: animatedStats.totalOpportunites,
      icon: TrendingUp,
      color: "blue" as const,
      trend: "up" as const,
      change: "+23%",
      description: "En cours de négociation"
    },
    {
      title: "Montant Total",
      value: formatCurrency(animatedStats.montantTotal),
      icon: DollarSign,
      color: "purple" as const,
      trend: "up" as const,
      change: "+18%",
      description: "Portefeuille d'opportunités"
    },
    {
      title: "Taux de Conversion",
      value: `${getProgressPercentage()}%`,
      icon: Award,
      color: "orange" as const,
      trend: getProgressPercentage() > 75 ? "up" : "down" as const,
      change: getProgressPercentage() > 75 ? "+8%" : "-3%",
      description: "Opportunités gagnées"
    },
    {
      title: "Contacts Récents",
      value: animatedStats.contactsRecents,
      icon: MessageSquare,
      color: "pink" as const,
      trend: "up" as const,
      change: "+15%",
      description: "Dernières 48h"
    }
  ], [animatedStats, formatCurrency, getProgressPercentage]);

  // Variants d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/20">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <Activity className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadStats}
            className="bg-gradient-to-r from-primary-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-4 md:p-6"
    >
      {/* Header amélioré */}
      <motion.header
        ref={headerRef}
        initial={{ y: -20, opacity: 0 }}
        animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl shadow-lg"
            >
              <Activity className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                Tableau de bord
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <p className="text-gray-600">Vue d'ensemble en temps réel de votre activité</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filtres de période */}
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              {(['week', 'month', 'quarter', 'year'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    timeRange === range 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range === 'week' && 'Semaine'}
                  {range === 'month' && 'Mois'}
                  {range === 'quarter' && 'Trimestre'}
                  {range === 'year' && 'Année'}
                </button>
              ))}
            </div>
            
            {/* Boutons d'action */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="h-5 w-5 text-gray-600" />
              <span className="hidden md:inline text-sm font-medium">Exporter</span>
            </motion.button>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500">Performance</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-600"
                />
              </div>
              <span className="text-sm font-bold text-gray-900">82%</span>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500">Objectif mensuel</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                />
              </div>
              <span className="text-sm font-bold text-gray-900">65%</span>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500">Taux de croissance</p>
            <p className="text-sm font-bold text-green-600">+24.5%</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500">Activité aujourd'hui</p>
            <p className="text-sm font-bold text-gray-900">18 actions</p>
          </div>
        </div>
      </motion.header>

      {/* Grille de statistiques */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8"
      >
        <AnimatePresence>
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                loading={loading}
                trend={stat.trend}
                change={stat.change}
                description={stat.description}
                delay={index * 10}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Performance des ventes</h2>
                  <p className="text-sm text-gray-500">Évolution sur {timeRange === 'month' ? '30 jours' : 'cette période'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Filter className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Graphique simplifié */}
          <div className="p-6 h-64 flex items-end justify-between gap-2">
            {[40, 65, 80, 60, 90, 75, 85].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="w-12 bg-gradient-to-t from-primary-500 to-blue-600 rounded-t-lg relative group"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {`$${(height * 1000).toLocaleString()}`}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Légende */}
          <div className="px-6 pb-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mer</span>
              <span>Jeu</span>
              <span>Ven</span>
              <span>Sam</span>
              <span>Dim</span>
            </div>
          </div>
        </motion.div>

        {/* Performance des opportunités */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Taux de conversion</h3>
                <p className="text-sm opacity-90">Opportunités gagnées</p>
              </div>
            </div>
            <Target className="h-6 w-6 opacity-80" />
          </div>
          
          {/* Cercle de progression */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: getProgressPercentage() / 100 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                strokeDasharray="283"
                strokeDashoffset="283"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold">{getProgressPercentage()}%</span>
              <span className="text-sm opacity-90 mt-1">Taux de succès</span>
            </div>
          </div>
          
          {/* Détails */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats.opportunitesGagnees}</p>
              <p className="text-xs opacity-90 mt-1">Gagnées</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats.totalOpportunites - stats.opportunitesGagnees}</p>
              <p className="text-xs opacity-90 mt-1">En cours</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats.totalOpportunites}</p>
              <p className="text-xs opacity-90 mt-1">Total</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grille inférieure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunités récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Opportunités récentes</h2>
                <p className="text-sm text-gray-500">{opportunitesRecentes.length} opportunités actives</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Eye className="h-5 w-5 text-gray-600" />
              </motion.button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/opportunites/nouvelle"
                  className="bg-gradient-to-r from-primary-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-md transition-shadow"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle
                </Link>
              </motion.div>
            </div>
          </div>
          
          <div className="p-6">
            <AnimatePresence>
              {opportunitesRecentes.map((opp, index) => {
                const client = clientService.getById(opp.clientId);
                return (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    className="group p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all duration-200 cursor-pointer mb-3 last:mb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary-50 transition-colors mt-1">
                          <Target className="h-4 w-4 text-gray-600 group-hover:text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                            {opp.titre}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <p className="text-sm text-gray-500">{client?.nom || 'Client inconnu'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.p 
                          className="font-bold text-lg text-gray-900"
                          whileHover={{ scale: 1.1 }}
                        >
                          {formatCurrency(opp.montant)}
                        </motion.p>
                        <motion.div 
                          className="mt-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            opp.statut === 'Gagné' 
                              ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200' 
                              : opp.statut === 'Perdu' 
                              ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200'
                              : opp.statut === 'En cours' 
                              ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200'
                          }`}>
                            {opp.statut}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {formatDate(opp.dateCreation)}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <span>Phase: {opp.phase || 'Négociation'}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Clients récents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Clients récents</h2>
                <p className="text-sm text-gray-500">{clientsRecents.length} clients actifs</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/clients/nouveau"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-md transition-shadow"
              >
                <Plus className="h-4 w-4" />
                Nouveau
              </Link>
            </motion.div>
          </div>
          
          <div className="p-6">
            <AnimatePresence>
              {clientsRecents.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                  className="group p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all duration-200 cursor-pointer mb-3 last:mb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                        {client.nom.charAt(0)}
                        <motion.div 
                          className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                            {client.nom}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <p className="text-sm text-gray-600 truncate">{client.email}</p>
                          </div>
                          {client.telephone && (
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <p className="text-sm text-gray-600">{client.telephone}</p>
                            </div>
                          )}
                        </div>
                        <div className="text-right pl-2">
                          <motion.span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                              client.statut === 'Actif'
                                ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200'
                                : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {client.statut === 'Actif' ? (
                              <>
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                                Actif
                              </>
                            ) : (
                              'Inactif'
                            )}
                          </motion.span>
                          <p className="text-xs text-gray-500 mt-2 flex items-center justify-end gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(client.dateCreation)}
                          </p>
                        </div>
                      </div>
                      {client.company && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Entreprise:</span> {client.company}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 pt-6 border-t border-gray-200"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary-600" />
            <p className="text-sm text-gray-600">
              Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{stats.totalClients}</span> clients • 
              <span className="font-medium text-gray-700 ml-2">{stats.totalOpportunites}</span> opportunités
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </motion.button>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Dashboard;