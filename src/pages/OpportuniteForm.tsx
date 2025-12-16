import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Target, DollarSign, Calendar, 
  User, FileText, TrendingUp, Percent,
  Save, Loader2, Sparkles, Check,
  AlertCircle, Award, Clock, BarChart,
  Building, Briefcase, TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { opportuniteService } from '../services/storageService';
import { clientService } from '../services/storageService';
import { Opportunite, OpportuniteStatus, Client } from '../types';

// Constantes pour éviter la recréation à chaque rendu
const STATUT_OPTIONS = [
  { value: 'Nouveau', color: 'from-blue-500 to-cyan-600', label: 'Nouveau', icon: TrendingUp },
  { value: 'En cours', color: 'from-yellow-500 to-amber-600', label: 'En cours', icon: Clock },
  { value: 'Gagné', color: 'from-green-500 to-emerald-600', label: 'Gagné', icon: Award },
  { value: 'Perdu', color: 'from-red-500 to-rose-600', label: 'Perdu', icon: TrendingDown },
] as const;

const PRIORITE_OPTIONS = [
  { value: 'Faible', color: 'from-gray-400 to-gray-600', label: 'Faible' },
  { value: 'Moyenne', color: 'from-blue-400 to-blue-600', label: 'Moyenne' },
  { value: 'Haute', color: 'from-red-400 to-red-600', label: 'Haute' },
] as const;

const TYPE_OPTIONS = [
  { value: 'Nouveau', label: 'Nouveau client' },
  { value: 'Existant', label: 'Client existant' },
  { value: 'Renouvellement', label: 'Renouvellement' },
] as const;

const SOURCE_OPTIONS = [
  { value: 'Site Web', label: 'Site Web' },
  { value: 'Réseaux Sociaux', label: 'Réseaux Sociaux' },
  { value: 'Recommandation', label: 'Recommandation' },
  { value: 'Appel Froid', label: 'Appel Froid' },
  { value: 'Salon', label: 'Salon/Événement' },
] as const;

// Type pour le formulaire
type FormData = {
  titre: string;
  clientId: string;
  montant: string;
  statut: OpportuniteStatus;
  dateClotureEstimee: string;
  description: string;
  probabilite: string;
  priorite: 'Faible' | 'Moyenne' | 'Haute';
  type: 'Nouveau' | 'Existant' | 'Renouvellement';
  source: 'Site Web' | 'Réseaux Sociaux' | 'Recommandation' | 'Appel Froid' | 'Salon';
  notes: string;
};

// Composant pour les champs de formulaire
const FormField = ({
  label,
  icon: Icon,
  children,
  error,
  required = false,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative"
  >
    <label className="block text-sm font-medium text-gray-700 mb-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-400" />
        {label} {required && <span className="text-red-500">*</span>}
      </div>
    </label>
    {children}
    {error && (
      <motion.p 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-sm text-red-600 flex items-center gap-1"
      >
        <AlertCircle className="h-4 w-4" />
        {error}
      </motion.p>
    )}
  </motion.div>
);

// Composant de prévisualisation
const PreviewPanel = ({ 
  formData, 
  client 
}: { 
  formData: FormData; 
  client?: Client;
}) => {
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '€0';
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getStatutIcon = (statut: string) => {
    const option = STATUT_OPTIONS.find(s => s.value === statut);
    return option?.icon || Target;
  };

  const StatutIcon = getStatutIcon(formData.statut);
  const statutOption = STATUT_OPTIONS.find(s => s.value === formData.statut);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-600" />
        Aperçu de l'opportunité
      </h3>
      
      {client ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
              {client.nom.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{client.nom}</p>
              <p className="text-sm text-gray-600">{client.entreprise || 'Aucune entreprise'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Statut</span>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${statutOption?.color}`}>
                  <StatutIcon className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-gray-900">{formData.statut}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Montant estimé</span>
              <span className="font-bold text-lg text-gray-900">
                {formatCurrency(formData.montant)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Probabilité</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      Number(formData.probabilite) > 70 ? 'bg-green-500' :
                      Number(formData.probabilite) > 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${formData.probabilite}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="font-medium text-gray-900">{formData.probabilite}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Priorité</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                formData.priorite === 'Haute' ? 'bg-red-100 text-red-800' :
                formData.priorite === 'Moyenne' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {formData.priorite}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Date de clôture</span>
              <span className="font-medium text-gray-900">
                {formData.dateClotureEstimee 
                  ? new Date(formData.dateClotureEstimee).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Non définie'}
              </span>
            </div>

            {formData.description && (
              <div>
                <span className="text-gray-600 block mb-1">Description</span>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {formData.description}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            Sélectionnez un client pour voir l'aperçu
          </p>
        </div>
      )}
    </motion.div>
  );
};

const OpportuniteForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<FormData>({
    titre: '',
    clientId: '',
    montant: '',
    statut: 'Nouveau',
    dateClotureEstimee: '',
    description: '',
    probabilite: '50',
    priorite: 'Moyenne',
    type: 'Nouveau',
    source: 'Site Web',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  // Charger les clients au montage
  useEffect(() => {
    const activeClients = clientService.getAll().filter(c => c.statut === 'Actif');
    setClients(activeClients);
  }, []);

  // Charger l'opportunité en mode édition
  useEffect(() => {
    if (isEdit && id) {
      const opportunite = opportuniteService.getById(id);
      if (opportunite) {
        setFormData({
          titre: opportunite.titre,
          clientId: opportunite.clientId,
          montant: opportunite.montant.toString(),
          statut: opportunite.statut,
          dateClotureEstimee: opportunite.dateClotureEstimee.split('T')[0],
          description: opportunite.description || '',
          probabilite: opportunite.probabilite?.toString() || '50',
          priorite: opportunite.priorite || 'Moyenne',
          type: opportunite.type || 'Nouveau',
          source: opportunite.source || 'Site Web',
          notes: opportunite.notes || '',
        });
      } else {
        navigate('/opportunites');
      }
    }
  }, [id, isEdit, navigate]);

  // Mémoriser le client sélectionné
  const selectedClient = useMemo(() => 
    clients.find(c => c.id === formData.clientId),
    [clients, formData.clientId]
  );

  // Validation du formulaire
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }

    if (!formData.clientId) {
      newErrors.clientId = 'Le client est requis';
    }

    if (!formData.montant.trim()) {
      newErrors.montant = 'Le montant est requis';
    } else if (isNaN(Number(formData.montant)) || Number(formData.montant) <= 0) {
      newErrors.montant = 'Le montant doit être un nombre positif';
    }

    if (!formData.dateClotureEstimee) {
      newErrors.dateClotureEstimee = 'La date de clôture estimée est requise';
    } else {
      const selectedDate = new Date(formData.dateClotureEstimee);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dateClotureEstimee = 'La date ne peut pas être dans le passé';
      }
    }

    if (formData.probabilite && (Number(formData.probabilite) < 0 || Number(formData.probabilite) > 100)) {
      newErrors.probabilite = 'La probabilité doit être entre 0 et 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Gestion de la soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Simulation d'un délai pour l'animation
      await new Promise(resolve => setTimeout(resolve, 800));

      const opportuniteData = {
        ...formData,
        montant: Number(formData.montant),
        probabilite: Number(formData.probabilite),
        dateClotureEstimee: new Date(formData.dateClotureEstimee).toISOString(),
        dateCreation: isEdit ? undefined : new Date().toISOString(),
        dateModification: new Date().toISOString(),
      };

      if (isEdit && id) {
        const updated = opportuniteService.update(id, opportuniteData);
        if (updated) {
          setSuccess(true);
          setAlert({ 
            type: 'success', 
            message: 'Opportunité modifiée avec succès !' 
          });
          
          setTimeout(() => navigate('/opportunites'), 1500);
        } else {
          setAlert({ 
            type: 'error', 
            message: 'Erreur lors de la modification' 
          });
        }
      } else {
        const created = opportuniteService.create(opportuniteData);
        if (created) {
          setSuccess(true);
          setAlert({ 
            type: 'success', 
            message: 'Opportunité créée avec succès !' 
          });
          
          setTimeout(() => navigate('/opportunites'), 1500);
        } else {
          setAlert({ 
            type: 'error', 
            message: 'Erreur lors de la création' 
          });
        }
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: 'Une erreur est survenue' 
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Gestion des changements de champ
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Conseils mémorisés
  const tips = useMemo(() => [
    'Définissez un titre clair et descriptif',
    'Estimez le montant au plus juste',
    'Mettez à jour régulièrement la probabilité',
    'Une date de clôture réaliste augmente les chances',
    'Priorisez les opportunités les plus prometteuses'
  ], []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6"
    >
      {/* Header amélioré */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/opportunites')}
          className="group flex items-center text-gray-600 hover:text-primary-700 mb-6 transition-colors"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 mr-3 group-hover:border-primary-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
          <span className="font-medium group-hover:text-primary-700 transition-colors">
            Retour aux opportunités
          </span>
        </motion.button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg"
            >
              <Target className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                {isEdit ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEdit 
                  ? 'Mettez à jour les détails de votre opportunité' 
                  : 'Créez une nouvelle opportunité commerciale'}
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(!showPreview)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {showPreview ? 'Masquer' : 'Aperçu'}
            </span>
          </motion.button>
        </div>
      </motion.div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${showPreview ? 'lg:col-span-2' : 'lg:col-span-3'}`}
        >
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-blue-50/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails de l'opportunité
                </h2>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm text-gray-500">Tous les champs marqués * sont obligatoires</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Titre */}
              <FormField
                label="Titre de l'opportunité"
                icon={Briefcase}
                error={errors.titre}
                required
              >
                <div className="relative">
                  <input
                    type="text"
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => handleInputChange('titre', e.target.value)}
                    className={`w-full px-4 pl-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.titre 
                        ? 'border-red-500 bg-red-50/50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Ex: Développement d'application mobile"
                  />
                  <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </FormField>

              {/* Client et Montant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Client"
                  icon={User}
                  error={errors.clientId}
                  required
                >
                  <div className="relative">
                    <select
                      id="clientId"
                      value={formData.clientId}
                      onChange={(e) => handleInputChange('clientId', e.target.value)}
                      className={`w-full px-4 pl-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none ${
                        errors.clientId 
                          ? 'border-red-500 bg-red-50/50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.nom} {client.entreprise ? `(${client.entreprise})` : ''}
                        </option>
                      ))}
                    </select>
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    </div>
                  </div>
                </FormField>

                <FormField
                  label="Montant estimé (€)"
                  icon={DollarSign}
                  error={errors.montant}
                  required
                >
                  <div className="relative">
                    <input
                      type="number"
                      id="montant"
                      step="0.01"
                      min="0"
                      value={formData.montant}
                      onChange={(e) => handleInputChange('montant', e.target.value)}
                      className={`w-full px-4 pl-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.montant 
                          ? 'border-red-500 bg-red-50/50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="0.00"
                    />
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </FormField>
              </div>

              {/* Type et Source */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'opportunité
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TYPE_OPTIONS.map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInputChange('type', option.value)}
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          formData.type === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-300 hover:border-gray-400 bg-white hover:shadow-md'
                        }`}
                      >
                        <span className="text-xs font-medium">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative"
                >
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                    Source
                  </label>
                  <div className="relative">
                    <select
                      id="source"
                      value={formData.source}
                      onChange={(e) => handleInputChange('source', e.target.value)}
                      className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none"
                    >
                      {SOURCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <BarChart className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </motion.div>
              </div>

              {/* Statut et Probabilité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="relative"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STATUT_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      
                      return (
                        <motion.button
                          key={option.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInputChange('statut', option.value)}
                          className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                            formData.statut === option.value
                              ? `border-transparent bg-gradient-to-br ${option.color} text-white shadow-lg`
                              : 'border-gray-300 hover:border-gray-400 bg-white hover:shadow-md'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs font-medium">{option.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                <FormField
                  label="Probabilité de succès (%)"
                  icon={Percent}
                  error={errors.probabilite}
                >
                  <div className="space-y-2">
                    <input
                      type="range"
                      id="probabilite"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.probabilite}
                      onChange={(e) => handleInputChange('probabilite', e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">0%</span>
                      <span className="font-bold text-lg text-blue-600">{formData.probabilite}%</span>
                      <span className="text-sm text-gray-500">100%</span>
                    </div>
                  </div>
                </FormField>
              </div>

              {/* Priorité et Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="relative"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRIORITE_OPTIONS.map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInputChange('priorite', option.value)}
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          formData.priorite === option.value
                            ? `border-transparent bg-gradient-to-br ${option.color} text-white shadow-lg`
                            : 'border-gray-300 hover:border-gray-400 bg-white hover:shadow-md'
                        }`}
                      >
                        <span className="text-sm font-medium">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <FormField
                  label="Date de clôture estimée"
                  icon={Calendar}
                  error={errors.dateClotureEstimee}
                  required
                >
                  <div className="relative">
                    <input
                      type="date"
                      id="dateClotureEstimee"
                      value={formData.dateClotureEstimee}
                      onChange={(e) => handleInputChange('dateClotureEstimee', e.target.value)}
                      className={`w-full px-4 pl-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.dateClotureEstimee 
                          ? 'border-red-500 bg-red-50/50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </FormField>
              </div>

              {/* Description et Notes */}
              <FormField label="Description" icon={FileText}>
                <div className="relative">
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Décrivez les détails de l'opportunité, les besoins du client..."
                  />
                  <FileText className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                </div>
              </FormField>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="relative"
              >
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes internes (optionnel)
                </label>
                <div className="relative">
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Notes pour l'équipe interne..."
                  />
                </div>
              </motion.div>

              {/* Boutons d'action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/opportunites')}
                    className="w-full sm:w-auto"
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    disabled={loading || isSubmitting}
                    className="relative overflow-hidden w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Enregistrement...
                      </div>
                    ) : success ? (
                      <div className="flex items-center justify-center">
                        <Check className="h-5 w-5 mr-2" />
                        Succès !
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Save className="h-5 w-5 mr-2" />
                        {isEdit ? 'Mettre à jour' : 'Créer l\'opportunité'}
                      </div>
                    )}
                    
                    {isSubmitting && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8 }}
                      />
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>

        {/* Panneau latéral (Aperçu) */}
        {showPreview && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <PreviewPanel formData={formData} client={selectedClient} />

            {/* Conseils */}
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl shadow-lg border border-blue-200 p-6"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-4">Conseils</h3>
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <span className="text-blue-800">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OpportuniteForm;