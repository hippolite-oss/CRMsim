import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Axios from '../utils/Axios';

interface FormData {
  nom: string;
  adresse: string;
  telephone: string;
}

interface Errors {
  nom?: string;
  adresse?: string;
  telephone?: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const CreateCentre: React.FC = () => {
  const navigate = useNavigate();

  // États
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    adresse: '',
    telephone: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [notification, setNotification] = useState<Notification | null>(null);

  // Notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success'): void => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Gestion des champs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom du centre est obligatoire';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification('Veuillez corriger les erreurs', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await Axios.post<ApiResponse>('/api/centres', formData);
      if (response.data.success) {
        showNotification('Centre créé avec succès !', 'success');
        setTimeout(() => navigate('/admin/parametres/centres'), 1500);
      }
    } catch (error: any) {
      console.error('Erreur création centre:', error);
      showNotification(error.response?.data?.message || 'Erreur lors de la création', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-slide-in ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin/parametres/centres')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux centres
        </button>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500 rounded-xl">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nouveau Centre</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Ajoutez un nouveau centre de distribution</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Informations du centre</h2>

          <div className="space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du centre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Ex: Centre Principal"
                className={`w-full px-4 py-3 bg-white dark:bg-zinc-900 border ${
                  errors.nom ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
              />
              {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse
              </label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                placeholder="Ex: Rue de la Liberté, Cotonou"
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Ex: +229 01 56 29 12 64"
                className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 bg-gray-50 dark:bg-zinc-800/50 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/parametres/centres')}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all font-medium disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Créer le centre
              </>
            )}
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateCentre;