import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Filter, Edit, Trash2, FolderKanban, Calendar, 
  Users, Target, Clock, CheckCircle, XCircle, AlertCircle,
  Search, MoreVertical, Download, RefreshCw, ChevronRight,
  Sparkles, BarChart, TrendingUp, FileText, Layers,
  Eye, Share2, Copy, Archive, Tag, Flag, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { projectService } from '../services/storageService';
import { userService } from '../services/storageService';
import { Project, ProjectStatus, ProjectPriority } from '../types';

const Projets = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'Tous'>('Tous');
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'Tous'>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; project: Project | null }>({
    isOpen: false,
    project: null,
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'kanban'>('table');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  const users = userService.getAll();
  const statusOptions: ProjectStatus[] = ['En attente', 'En cours', 'En revue', 'Terminé', 'Archivé'];
  const priorityOptions: ProjectPriority[] = ['Basse', 'Moyenne', 'Haute', 'Urgent'];

  useEffect(() => {
    loadProjects();
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    filterProjects();
  }, [statusFilter, priorityFilter, searchQuery, projects]);

  const loadProjects = () => {
    const allProjects = projectService.getAll();
    setProjects(allProjects);
    setFilteredProjects(allProjects);
  };

  const filterProjects = () => {
    let filtered = projects;

    if (statusFilter !== 'Tous') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (priorityFilter !== 'Tous') {
      filtered = filtered.filter(p => p.priority === priorityFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => {
        const assignedUser = users.find(u => u.id === project.assignedTo);
        return (
          project.name.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.client?.toLowerCase().includes(query) ||
          (assignedUser?.name.toLowerCase().includes(query) || false)
        );
      });
    }

    setFilteredProjects(filtered);
  };

  const handleDelete = () => {
    if (deleteModal.project) {
      const success = projectService.delete(deleteModal.project.id);
      if (success) {
        setAlert({ 
          type: 'success', 
          message: `Projet "${deleteModal.project.name}" archivé avec succès !` 
        });
        loadProjects();
        setTimeout(() => setAlert(null), 3000);
      } else {
        setAlert({ 
          type: 'error', 
          message: 'Erreur lors de l\'archivage du projet' 
        });
      }
      setDeleteModal({ isOpen: false, project: null });
    }
  };

  const handleBulkAction = (action: 'archive' | 'duplicate' | 'changeStatus') => {
    if (selectedProjects.length === 0) return;

    switch (action) {
      case 'archive':
        selectedProjects.forEach(id => projectService.archive(id));
        setAlert({ 
          type: 'success', 
          message: `${selectedProjects.length} projet(s) archivé(s) avec succès !` 
        });
        break;
      case 'duplicate':
        selectedProjects.forEach(id => {
          const project = projectService.getById(id);
          if (project) {
            projectService.create({
              ...project,
              name: `${project.name} (Copie)`,
              id: undefined,
            });
          }
        });
        setAlert({ 
          type: 'info', 
          message: `${selectedProjects.length} projet(s) dupliqué(s) avec succès !` 
        });
        break;
    }
    
    loadProjects();
    setSelectedProjects([]);
    setTimeout(() => setAlert(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Terminé':
        return { bg: 'from-green-500 to-emerald-600', light: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      case 'En cours':
        return { bg: 'from-blue-500 to-cyan-600', light: 'bg-blue-100', text: 'text-blue-800', icon: Clock };
      case 'En attente':
        return { bg: 'from-yellow-500 to-amber-600', light: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle };
      case 'En revue':
        return { bg: 'from-purple-500 to-pink-600', light: 'bg-purple-100', text: 'text-purple-800', icon: Eye };
      case 'Archivé':
        return { bg: 'from-gray-500 to-gray-600', light: 'bg-gray-100', text: 'text-gray-800', icon: Archive };
      default:
        return { bg: 'from-gray-500 to-gray-600', light: 'bg-gray-100', text: 'text-gray-800', icon: FolderKanban };
    }
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Haute':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Basse':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStats = () => {
    const total = projects.length;
    const actifs = projects.filter(p => p.status === 'En cours').length;
    const termines = projects.filter(p => p.status === 'Terminé').length;
    const enRetard = projects.filter(p => {
      if (!p.deadline) return false;
      return new Date(p.deadline) < new Date() && p.status !== 'Terminé';
    }).length;
    
    return { total, actifs, termines, enRetard };
  };

  const calculateProgress = (project: Project) => {
    if (project.tasks && project.tasks.length > 0) {
      const completedTasks = project.tasks.filter(t => t.completed).length;
      return Math.round((completedTasks / project.tasks.length) * 100);
    }
    return 0;
  };

  const toggleSelection = (id: string) => {
    setSelectedProjects(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20 p-4 md:p-6"
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
                className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg"
              >
                <FolderKanban className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent">
                  Projets
                </h1>
                <p className="text-gray-600 mt-1">
                  Gérez vos projets et suivez leur progression
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
                  <FolderKanban className="h-5 w-5 text-indigo-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Actifs</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.actifs}</p>
                  </div>
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Terminés</p>
                    <p className="text-2xl font-bold text-green-800">{stats.termines}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-rose-100 rounded-xl p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">En retard</p>
                    <p className="text-2xl font-bold text-red-800">{stats.enRetard}</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {selectedProjects.length > 0 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <Button
                    variant="secondary"
                    icon={<MoreVertical />}
                    onClick={() => setUserMenuOpen(userMenuOpen === 'bulk' ? null : 'bulk')}
                  >
                    Actions ({selectedProjects.length})
                  </Button>
                  
                  <AnimatePresence>
                    {userMenuOpen === 'bulk' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleBulkAction('archive');
                              setUserMenuOpen(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Archive className="h-4 w-4" />
                            Archiver
                          </button>
                          <button
                            onClick={() => {
                              handleBulkAction('duplicate');
                              setUserMenuOpen(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Copy className="h-4 w-4" />
                            Dupliquer
                          </button>
                          <div className="border-t my-1" />
                          <button
                            onClick={() => {
                              setSelectedProjects([]);
                              setUserMenuOpen(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <XCircle className="h-4 w-4" />
                            Annuler la sélection
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link to="/projets/nouveau">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl transition-shadow">
                  <Plus className="h-5 w-5 mr-2" />
                  Nouveau projet
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
                placeholder="Rechercher un projet par nom, client, description..."
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
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'Tous')}
                className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="Tous">Tous les statuts</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative flex-1 lg:flex-none min-w-[180px]"
            >
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as ProjectPriority | 'Tous')}
                className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="Tous">Toutes priorités</option>
                {priorityOptions.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              <Flag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </motion.div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={loadProjects}
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
                    className={`px-3 py-2 ${viewMode === mode ? 'bg-indigo-50 text-indigo-600 border-r border-gray-300' : 'text-gray-600 hover:bg-gray-50'}`}
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

      {/* Vue Tableau */}
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
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-12 text-center"
            >
              <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
                <FolderKanban className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'Tous' ? 'Aucun projet trouvé' : 'Aucun projet'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery || statusFilter !== 'Tous' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par créer votre premier projet'}
              </p>
              <Link to="/projets/nouveau">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Plus className="h-5 w-5 mr-2" />
                  Créer un projet
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-indigo-50/50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedProjects.length === filteredProjects.length}
                          onChange={selectAll}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Projet
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Progression
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Priorité
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Échéance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredProjects.map((project, index) => {
                        const assignedUser = users.find(u => u.id === project.assignedTo);
                        const colors = getStatusColor(project.status);
                        const StatusIcon = colors.icon;
                        const progress = calculateProgress(project);
                        const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'Terminé';
                        
                        return (
                          <motion.tr
                            key={project.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ 
                              backgroundColor: 'rgba(99, 102, 241, 0.03)',
                              transition: { duration: 0.2 }
                            }}
                            className={`group cursor-pointer ${
                              selectedProjects.includes(project.id) ? 'bg-indigo-50' : ''
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedProjects.includes(project.id)}
                                onChange={() => toggleSelection(project.id)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} shadow-md`}
                                >
                                  <FolderKanban className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                  <p className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                    {project.name}
                                  </p>
                                  {project.description && (
                                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                      {project.description}
                                    </p>
                                  )}
                                  {assignedUser && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Users className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs text-gray-500">
                                        {assignedUser.name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {project.client || 'Non spécifié'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">{progress}%</span>
                                  <span className="text-xs text-gray-500">
                                    {project.tasks?.filter(t => t.completed).length || 0}/{project.tasks?.length || 0}
                                  </span>
                                </div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full ${getProgressColor(progress)}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority || 'Moyenne')}`}
                              >
                                <Flag className="h-3 w-3" />
                                {project.priority || 'Moyenne'}
                              </motion.span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar className={`h-4 w-4 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
                                <div>
                                  <span className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                                    {project.deadline ? formatDate(project.deadline) : 'Non définie'}
                                  </span>
                                  {isOverdue && (
                                    <p className="text-xs text-red-500">En retard</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.light} ${colors.text}`}
                              >
                                <StatusIcon className="h-4 w-4" />
                                <span className="text-sm font-medium">{project.status}</span>
                              </motion.div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => navigate(`/projets/${project.id}`)}
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Voir détails"
                                >
                                  <Eye className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => navigate(`/projets/${project.id}/edit`)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Modifier"
                                >
                                  <Edit className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setDeleteModal({ isOpen: true, project })}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Archiver"
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
                      <span className="font-semibold">{filteredProjects.length}</span> projet(s)
                      {selectedProjects.length > 0 && (
                        <span className="ml-2 text-indigo-600">
                          • <span className="font-semibold">{selectedProjects.length}</span> sélectionné(s)
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <BarChart className="h-4 w-4" />
                      <span>
                        Progression moyenne : <span className="font-semibold">{
                          filteredProjects.length > 0 
                            ? Math.round(filteredProjects.reduce((sum, p) => sum + calculateProgress(p), 0) / filteredProjects.length)
                            : 0
                        }%</span>
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
          {filteredProjects.map((project, index) => {
            const assignedUser = users.find(u => u.id === project.assignedTo);
            const colors = getStatusColor(project.status);
            const StatusIcon = colors.icon;
            const progress = calculateProgress(project);
            const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'Terminé';
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group"
              >
                <div className="p-6">
                  {/* En-tête */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} shadow-md`}
                      >
                        <FolderKanban className="h-5 w-5 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500">{project.client || 'Non spécifié'}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleSelection(project.id)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  
                  {/* Contenu */}
                  <div className="space-y-3 mb-4">
                    {project.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    
                    {/* Barre de progression */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Progression</span>
                        <span className="text-sm font-medium text-gray-900">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${getProgressColor(progress)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                    
                    {/* Métadonnées */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate">
                          {assignedUser?.name || 'Non assigné'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className={`h-4 w-4 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
                        <span className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                          {project.deadline ? formatDate(project.deadline) : '—'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Statut et Priorité */}
                    <div className="flex items-center justify-between">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.light} ${colors.text}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">{project.status}</span>
                      </motion.div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority || 'Moyenne')}`}>
                        {project.priority || 'Moyenne'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/projets/${project.id}/edit`)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteModal({ isOpen: true, project })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Archiver"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => navigate(`/projets/${project.id}`)}
                      className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {statusOptions.map((status) => {
            const projectsInStatus = filteredProjects.filter(p => p.status === status);
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
                      <FolderKanban className={`h-4 w-4 ${colors.text}`} />
                    </div>
                    <h3 className="font-bold text-gray-900">{status}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}>
                    {projectsInStatus.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {projectsInStatus.map((project) => {
                    const progress = calculateProgress(project);
                    
                    return (
                      <motion.div
                        key={project.id}
                        whileHover={{ y: -2 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer"
                        onClick={() => navigate(`/projets/${project.id}`)}
                      >
                        <div className="mb-2">
                          <h4 className="font-medium text-gray-900 line-clamp-2">
                            {project.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">{project.client}</p>
                        </div>
                        
                        {/* Barre de progression */}
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                          <div 
                            className={`h-full ${getProgressColor(progress)}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {progress}% terminé
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/projets/${project.id}/edit`);
                              }}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteModal({ isOpen: true, project });
                              }}
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
        onClose={() => setDeleteModal({ isOpen: false, project: null })}
        title="Archiver le projet"
        onConfirm={handleDelete}
        confirmLabel="Archiver"
        confirmVariant="warning"
        animated={true}
      >
        <div className="text-center py-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <Archive className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Archiver "{deleteModal.project?.name}" ?
          </h3>
          <p className="text-gray-600 mb-4">
            Le projet sera déplacé vers les archives. Vous pourrez le restaurer ultérieurement.
          </p>
          {deleteModal.project && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-sm text-yellow-700 font-medium">
                ⚠️ Le projet ne sera plus visible dans la liste active
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
        <Link to="/projets/nouveau">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-xl"
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

// Types nécessaires
export type { Project, ProjectStatus, ProjectPriority };

export default Projets;