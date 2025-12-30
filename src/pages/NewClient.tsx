// pages/NewClient.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, Phone, MapPin, AlertCircle, CheckCircle, 
  Loader2, ArrowLeft, Upload, X, Image as ImageIcon 
} from 'lucide-react';


// Types pour Redux state
interface RootState {
  user: any; // Remplacez par votre type d'utilisateur réel
}

// Type pour formData
interface FormDataState {
  type: 'normal' | 'comptoir';
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
}

// Type pour la réponse d'upload
interface UploadResult {
  success: boolean;
  message?: string;
  image_url?: string;
}

const NewClient = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<FormDataState>({
    type: 'normal', // 'normal' ou 'comptoir'
    nom: '',
    prenom: '',
    telephone: '',
    adresse: ''
  });

  // Gestion de la carte d'identité
  const [carteFile, setCarteFile] = useState<File | null>(null);
  const [cartePreview, setCartePreview] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Gestion de l'upload de la carte
  const handleCarteChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format non autorisé. Utilisez JPG, PNG ou WEBP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image trop volumineuse (max 5 Mo)');
      return;
    }

    setCarteFile(file);
    setCartePreview(URL.createObjectURL(file));
    setError('');
  };

  const removeCarte = () => {
    setCarteFile(null);
    if (cartePreview) {
      URL.revokeObjectURL(cartePreview);
    }
    setCartePreview(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nom.trim()) {
      setError('Le nom est obligatoire');
      return;
    }

    if (formData.type === 'normal' && !formData.telephone.trim()) {
      setError('Le téléphone est obligatoire pour un client normal');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      let carte_identite_url: string | undefined = undefined;

      // Upload de la carte si présente (seulement pour client normal)
      if (formData.type === 'normal' && carteFile) {
        setUploading(true);
        const uploadResult: UploadResult = await uploadImage(carteFile);
        setUploading(false);

        if (!uploadResult.success) {
          setError(uploadResult.message || 'Erreur lors de l\'upload de la carte');
          setLoading(false);
          return;
        }

        carte_identite_url = uploadResult.image_url;
      }

      const response = await Axios.post('/api/clients', {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        telephone: formData.type === 'normal' ? formData.telephone.trim() : undefined,
        adresse: formData.adresse.trim(),
        type: formData.type,
        carte_identite: carte_identite_url // ← Champ envoyé au backend
      });

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          type: 'normal',
          nom: '',
          prenom: '',
          telephone: '',
          adresse: ''
        });
        setCarteFile(null);
        setCartePreview(null);

        setTimeout(() => {
          navigate('/admin/clients');
        }, 2000);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erreur lors de la création du client';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Messages */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-200">Erreur</p>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-200">Succès</p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Client créé avec succès ! Redirection...
            </p>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex-shrink-0 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Nouveau client
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Ajouter un client normal ou un client comptoir
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la liste
          </button>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Type de client */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Type de client
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all shadow-md ${
                formData.type === 'normal'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="normal"
                  checked={formData.type === 'normal'}
                  onChange={handleChange}
                  className="w-6 h-6 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Client normal</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Avec téléphone unique, ardoise et carte d'identité possible
                  </p>
                </div>
              </label>

              <label className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all shadow-md ${
                formData.type === 'comptoir'
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="comptoir"
                  checked={formData.type === 'comptoir'}
                  onChange={handleChange}
                  className="w-6 h-6 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Client comptoir</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Ventes anonymes (code auto-généré)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Informations communes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Ex: Dupont"
                className="w-full px-5 py-4 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Prénom (optionnel)
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Ex: Jean"
                className="w-full px-5 py-4 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 outline-none transition"
              />
            </div>
          </div>

          {/* Téléphone (client normal uniquement) */}
          {formData.type === 'normal' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  placeholder="Ex: +229 01 90 12 34 56"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
                Doit être unique
              </p>
            </div>
          )}

          {/* Carte d'identité (client normal uniquement) */}
          {formData.type === 'normal' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Photo de la carte d'identité (optionnel)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleCarteChange}
                className="hidden"
                id="carte-upload"
              />

              {!cartePreview ? (
                <label
                  htmlFor="carte-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all bg-gray-50 dark:bg-zinc-800"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cliquez pour télécharger la carte
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    JPG, PNG, WEBP (max 5 Mo)
                  </p>
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-zinc-700">
                  <img
                    src={cartePreview}
                    alt="Carte d'identité"
                    className="w-full h-96 object-contain bg-gray-100 dark:bg-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={removeCarte}
                    className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Adresse */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Adresse (optionnel)
            </label>
            <div className="relative">
              <MapPin className="absolute left-5 top-5 w-6 h-6 text-gray-400" />
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                rows={3}
                placeholder="Ex: Quartier Fidjrossè, Cotonou"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="pt-8 flex flex-col sm:flex-row gap-6">
            <button
              type="button"
              onClick={() => navigate('/admin/clients')}
              disabled={loading}
              className="flex-1 py-5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-2xl font-bold text-lg transition-all disabled:opacity-70"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 py-5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  {uploading ? 'Upload de la carte...' : 'Création en cours...'}
                </>
              ) : (
                <>
                  <UserPlus className="w-7 h-7" />
                  Créer le client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClient;