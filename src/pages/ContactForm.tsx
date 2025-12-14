import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MessageSquare, Calendar, Clock, 
  User, Type, FileText, Save, Loader2,
  Sparkles, Phone, Mail, Users, Check,
  AlertCircle, TrendingUp, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { contactService } from '../services/storageService';
import { clientService } from '../services/storageService';
import { ContactType } from '../types';

const ContactForm = () => {
  const navigate = useNavigate();
  const clients = clientService.getAll();

  const [formData, setFormData] = useState({
    clientId: '',
    type: 'Email' as ContactType,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    description: '',
    sujet: '',
    duree: '30',
    priorite: 'Moyenne' as 'Faible' | 'Moyenne' | 'Haute',
    resultat: 'Positif' as 'Positif' | 'Neutre' | 'Négatif',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const typeOptions = [
    { value: 'Appel', icon: Phone, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-100' },
    { value: 'Email', icon: Mail, color: 'from-purple-500 to-pink-600', bg: 'bg-purple-100' },
    { value: 'Réunion', icon: Users, color: 'from-green-500 to-emerald-600', bg: 'bg-green-100' },
    { value: 'Visite', icon: Target, color: 'from-orange-500 to-amber-600', bg: 'bg-orange-100' },
    { value: 'Présentation', icon: TrendingUp, color: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-100' },
  ];

  const selectedClient = clients.find(c => c.id === formData.clientId);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Le client est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

      // Combiner date et heure
      const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      contactService.create({
        clientId: formData.clientId,
        type: formData.type,
        date: dateTime,
        description: formData.description,
        sujet: formData.sujet,
        duree: parseInt(formData.duree),
        priorite: formData.priorite,
        resultat: formData.resultat,
      });

      setSuccess(true);
      setAlert({ 
        type: 'success', 
        message: 'Contact enregistré avec succès !' 
      });
      
      // Animation de succès avant redirection
      setTimeout(() => navigate('/contacts'), 1500);
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: 'Une erreur est survenue lors de l\'enregistrement' 
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Supprime l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getTypeIcon = (type: string) => {
    const option = typeOptions.find(t => t.value === type);
    return option?.icon || MessageSquare;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20 p-4 md:p-6"
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
          onClick={() => navigate('/contacts')}
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
            Retour aux contacts
          </span>
        </motion.button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
            >
              <MessageSquare className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent">
                Nouveau contact
              </h1>
              <p className="text-gray-600 mt-1">
                Enregistrez un nouvel échange avec votre client
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(!showPreview)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
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
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-indigo-50/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails du contact
                </h2>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-sm text-gray-500">Tous les champs marqués * sont obligatoires</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Grille principale */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      Client <span className="text-red-500">*</span>
                    </div>
                  </label>
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
                  {errors.clientId && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.clientId}
                    </motion.p>
                  )}
                </motion.div>

                {/* Type de contact */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4 text-gray-400" />
                      Type de contact <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {typeOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = formData.type === option.value;
                      
                      return (
                        <motion.button
                          key={option.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInputChange('type', option.value)}
                          className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                            isSelected
                              ? `border-transparent bg-gradient-to-br ${option.color} text-white shadow-lg`
                              : 'border-gray-300 hover:border-gray-400 bg-white hover:shadow-md'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs font-medium">{option.value}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Date et heure */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Date <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className={`w-full px-4 pl-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.date 
                          ? 'border-red-500 bg-red-50/50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.date && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.date}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      Heure
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative"
                >
                  <label htmlFor="duree" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      Durée (minutes)
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      id="duree"
                      value={formData.duree}
                      onChange={(e) => handleInputChange('duree', e.target.value)}
                      className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none"
                    >
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">1h</option>
                      <option value="90">1h30</option>
                      <option value="120">2h</option>
                    </select>
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </motion.div>
              </div>

              {/* Sujet */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative"
              >
                <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    Sujet (optionnel)
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="sujet"
                    value={formData.sujet}
                    onChange={(e) => handleInputChange('sujet', e.target.value)}
                    className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ex: Présentation des nouveaux services..."
                  />
                  <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </motion.div>

              {/* Priorité et Résultat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="relative"
                >
                  <label htmlFor="priorite" className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'Faible', color: 'from-gray-400 to-gray-600', label: 'Faible' },
                      { value: 'Moyenne', color: 'from-blue-400 to-blue-600', label: 'Moyenne' },
                      { value: 'Haute', color: 'from-red-400 to-red-600', label: 'Haute' },
                    ].map((option) => (
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

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="relative"
                >
                  <label htmlFor="resultat" className="block text-sm font-medium text-gray-700 mb-2">
                    Résultat
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'Positif', color: 'from-green-400 to-green-600', label: '✓' },
                      { value: 'Neutre', color: 'from-yellow-400 to-yellow-600', label: '○' },
                      { value: 'Négatif', color: 'from-red-400 to-red-600', label: '✗' },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInputChange('resultat', option.value)}
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          formData.resultat === option.value
                            ? `border-transparent bg-gradient-to-br ${option.color} text-white shadow-lg`
                            : 'border-gray-300 hover:border-gray-400 bg-white hover:shadow-md'
                        }`}
                      >
                        <span className="text-lg font-bold">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="relative"
              >
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    Description / Commentaire <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                    className={`w-full px-4 pl-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none ${
                      errors.description 
                        ? 'border-red-500 bg-red-50/50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Décrivez l'échange avec le client, les points abordés, les décisions prises..."
                  />
                  <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                </div>
                {errors.description && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.description}
                  </motion.p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  {formData.description.length}/2000 caractères
                </p>
              </motion.div>

              {/* Boutons d'action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/contacts')}
                    className="w-full sm:w-auto"
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="relative overflow-hidden w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
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
                        Enregistrer le contact
                      </div>
                    )}
                    
                    {/* Effet de progression */}
                    {isSubmitting && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500"
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
            {/* Aperçu du contact */}
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Aperçu du contact
              </h3>
              
              {selectedClient ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {selectedClient.nom.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedClient.nom}</p>
                      <p className="text-sm text-gray-600">{selectedClient.entreprise || 'Aucune entreprise'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Type</span>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const TypeIcon = getTypeIcon(formData.type);
                          const typeOption = typeOptions.find(t => t.value === formData.type);
                          return (
                            <>
                              <div className={`p-1.5 rounded-lg ${typeOption?.bg}`}>
                                <TypeIcon className="h-4 w-4" />
                              </div>
                              <span className="font-medium text-gray-900">{formData.type}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Date et heure</span>
                      <span className="font-medium text-gray-900">
                        {new Date(`${formData.date}T${formData.time}`).toLocaleString('fr-FR', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-medium text-gray-900">{formData.duree} minutes</span>
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
                      <span className="text-gray-600">Résultat</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        formData.resultat === 'Positif' ? 'bg-green-100 text-green-800' :
                        formData.resultat === 'Négatif' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {formData.resultat}
                      </span>
                    </div>

                    {formData.sujet && (
                      <div>
                        <span className="text-gray-600 block mb-1">Sujet</span>
                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {formData.sujet}
                        </p>
                      </div>
                    )}

                    <div>
                      <span className="text-gray-600 block mb-1">Description</span>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                        {formData.description || 'Aucune description...'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Sélectionnez un client pour voir l'aperçu
                  </p>
                </div>
              )}
            </motion.div>

            {/* Conseils */}
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl shadow-lg border border-indigo-200 p-6"
            >
              <h3 className="text-lg font-bold text-indigo-900 mb-4">Conseils</h3>
              <ul className="space-y-3">
                {[
                  'Soyez précis dans la description de l\'échange',
                  'Notez les points clés abordés',
                  'Indiquez les actions à suivre',
                  'Un contact détaillé facilite le suivi futur',
                  'La priorité aide à organiser les suivis'
                ].map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                    <span className="text-indigo-800">{tip}</span>
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

export default ContactForm;