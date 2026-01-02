import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Upload, X, Plus, Trash2, Save, ArrowLeft, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import Axios from '../utils/Axios';
import uploadImage from '../utils/UploadImage';
//import AddCategories from '../components/AddCategories';
//import AddMarques from '../components/AddMarques';
import { notifySuccess, notifyError } from '../utils/notify.jsx';

const NewProduit = () => {
    const navigate = useNavigate();

    // États du formulaire
    const [formData, setFormData] = useState({
        code: '',
        nom: '',
        categorie: '',
        marque: '',
        prix_achat_ht: '',
        unite_base: '',
        unites: [{ type: '', prix_vente_ttc: '', equivalence_base: 1 }],
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [marques, setMarques] = useState([]);

    // États UI
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});


    const [showAddCategorie, setShowAddCategorie] = useState(false);
    const [showAddMarque, setShowAddMarque] = useState(false);

    const reloadCategories = async () => {
        const res = await Axios.get('/api/categories');
        if (res.data.success) setCategories(res.data.data);
    };

    const reloadMarques = async () => {
        const res = await Axios.get('/api/marques');
        if (res.data.success) setMarques(res.data.data);
    };


    // Charger les catégories et marques
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, marqRes] = await Promise.all([
                    Axios.get('/api/categories'),
                    Axios.get('/api/marques')
                ]);
                if (catRes.data.success) setCategories(catRes.data.data);
                if (marqRes.data.success) setMarques(marqRes.data.data);
            } catch (error) {
                console.error('Erreur chargement données:', error);
                notifyError('Erreur lors du chargement des données de référence');
            }
        };
        fetchData();
    }, []);



    // Gestion de l'image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            notifyError('Format d\'image non autorisé. Utilisez JPG, PNG ou WEBP');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            notifyError('Image trop volumineuse (maximum 5 Mo)');
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    // Gestion des champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Effacer l'erreur pour ce champ
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Gestion des unités
    const handleUniteChange = (index, field, value) => {
        const newUnites = [...formData.unites];
        newUnites[index][field] = value;
        setFormData(prev => ({ ...prev, unites: newUnites }));
    };

    const addUnite = () => {
        setFormData(prev => ({
            ...prev,
            unites: [...prev.unites, { type: '', prix_vente_ttc: '', equivalence_base: 1 }]
        }));
    };

    const removeUnite = (index) => {
        if (formData.unites.length === 1) {
            notifyError('Au moins une unité de vente est requise');
            return;
        }
        const newUnites = formData.unites.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, unites: newUnites }));
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.code.trim()) newErrors.code = 'Code produit obligatoire';
        if (!formData.nom.trim()) newErrors.nom = 'Nom du produit obligatoire';
        if (!formData.categorie) newErrors.categorie = 'Catégorie obligatoire';
        if (!formData.unite_base) newErrors.unite_base = 'Unité de base obligatoire';

        formData.unites.forEach((unite, index) => {
            if (!unite.type.trim()) {
                newErrors[`unite_${index}_type`] = 'Type d\'unité requis';
            }
            if (!unite.prix_vente_ttc || unite.prix_vente_ttc <= 0) {
                newErrors[`unite_${index}_prix`] = 'Prix de vente requis';
            }
        });

        // Vérifier que l'unité de base existe dans les unités
        const uniteBaseExiste = formData.unites.some(u => u.type === formData.unite_base);
        if (formData.unite_base && !uniteBaseExiste) {
            newErrors.unite_base = "L'unité de base doit correspondre à l'une des unités de vente définies";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            notifyError('Veuillez corriger les erreurs du formulaire');
            return;
        }

        setLoading(true);

        try {
            let photoUrl = null;

            // Upload de l'image si elle existe
            if (imageFile) {
                setUploading(true);
                const uploadResult = await uploadImage(imageFile);
                setUploading(false);

                if (!uploadResult.success) {
                    notifyError(uploadResult.message || 'Erreur lors de l\'upload de l\'image');
                    setLoading(false);
                    return;
                }

                photoUrl = uploadResult.image_url;
            }

            // Créer le produit
            const response = await Axios.post('/api/produits', {
                ...formData,
                photo: photoUrl,
                prix_achat_ht: formData.prix_achat_ht || 0,
            });

            if (response.data.success) {
                notifySuccess('Produit créé avec succès !');
                setTimeout(() => navigate('/admin/produits'), 1500);
            }
        } catch (error) {
            console.error('Erreur création produit:', error);
            const message = error.response?.data?.message || 'Erreur lors de la création du produit';
            notifyError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-950 dark:to-zinc-900 p-4 md:p-8">


            {/* Header */}
            <div className="max-w-5xl mx-auto mb-8">
                <button
                    onClick={() => navigate('/admin/produits')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Retour au catalogue
                </button>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500 rounded-xl">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Nouveau Produit
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Ajoutez un nouveau produit à votre catalogue de quincaillerie
                        </p>
                    </div>
                </div>
            </div>

            {/* Card principale */}
            <div className="max-w-10xl mx-auto">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                    {/* Informations de base */}
                    <div className="p-8 border-b border-gray-200 dark:border-zinc-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                            Informations générales
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Code produit <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    placeholder="Ex: Q9"
                                    className={`w-full px-4 py-3 bg-white dark:bg-zinc-900 border ${errors.code ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                />
                                {errors.code && (
                                    <p className="mt-1 text-sm text-red-500">{errors.code}</p>
                                )}
                            </div>

                            {/* Nom */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nom du produit <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    placeholder="Ex: Tuyau de 32    "
                                    className={`w-full px-4 py-3 bg-white dark:bg-zinc-900 border ${errors.nom ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                />
                                {errors.nom && (
                                    <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
                                )}
                            </div>

                            {/* Catégorie */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Catégorie <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCategorie(true)}
                                        className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ajouter
                                    </button>
                                </div>

                                <select
                                    name="categorie"
                                    value={formData.categorie}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-white dark:bg-zinc-900 border ${errors.categorie ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.nom}
                                        </option>
                                    ))}
                                </select>
                                {errors.categorie && (
                                    <p className="mt-1 text-sm text-red-500">{errors.categorie}</p>
                                )}
                            </div>

                            {/* Marque */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Marque
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddMarque(true)}
                                        className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ajouter
                                    </button>
                                </div>

                                <select
                                    name="marque"
                                    value={formData.marque}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                >
                                    <option value="">Sélectionner une marque (facultatif)</option>
                                    {marques.map(marque => (
                                        <option key={marque._id} value={marque._id}>
                                            {marque.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Prix d'achat HT */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Prix d'achat HT (facultatif)
                                </label>
                                <input
                                    type="number"
                                    name="prix_achat_ht"
                                    value={formData.prix_achat_ht}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Unités de vente */}
                    <div className="p-8 border-b border-gray-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Unités de vente
                            </h2>
                            <button
                                type="button"
                                onClick={addUnite}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Ajouter une unité
                            </button>
                        </div>

                        {/* Unité de base */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Unité de base <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="unite_base"
                                value={formData.unite_base}
                                onChange={handleChange}
                                placeholder="Ex: Kg, Pièce, Mètre"
                                className={`w-full px-4 py-3 bg-white dark:bg-zinc-900 border ${errors.unite_base ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                            />
                            {errors.unite_base && (
                                <p className="mt-1 text-sm text-red-500">{errors.unite_base}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                L'unité de base doit correspondre à l'une des unités de vente définies ci-dessous
                            </p>
                        </div>

                        {/* Liste des unités */}
                        <div className="space-y-4">
                            {formData.unites.map((unite, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                                >
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Type d'unité <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={unite.type}
                                                onChange={(e) => handleUniteChange(index, 'type', e.target.value)}
                                                placeholder="Ex: Kg, Carton, Lot"
                                                className={`w-full px-3 py-2 bg-white dark:bg-zinc-900 border ${errors[`unite_${index}_type`]
                                                    ? 'border-red-500'
                                                    : 'border-gray-300 dark:border-zinc-700'
                                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Prix de vente TTC <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={unite.prix_vente_ttc}
                                                onChange={(e) => handleUniteChange(index, 'prix_vente_ttc', e.target.value)}
                                                placeholder="0"
                                                min="0"
                                                step="0.01"
                                                className={`w-full px-3 py-2 bg-white dark:bg-zinc-900 border ${errors[`unite_${index}_prix`]
                                                    ? 'border-red-500'
                                                    : 'border-gray-300 dark:border-zinc-700'
                                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Équivalence base
                                            </label>
                                            <input
                                                type="number"
                                                value={unite.equivalence_base}
                                                onChange={(e) => handleUniteChange(index, 'equivalence_base', e.target.value)}
                                                placeholder="1"
                                                min="0.001"
                                                step="0.001"
                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                                            />
                                        </div>
                                    </div>

                                    {formData.unites.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeUnite(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upload image */}
                    <div className="p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                            Photo du produit
                        </h2>

                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />

                            {!imagePreview ? (
                                <label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Cliquez pour télécharger ou glissez-déposez
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG, WEBP (MAX. 5MB)
                                    </p>
                                </label>
                            ) : (
                                <div className="relative w-full h-64 rounded-xl overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Aperçu"
                                        className="w-full h-full object-contain bg-gray-100 dark:bg-zinc-800"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-8 bg-gray-50 dark:bg-zinc-800/50 flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/produits')}
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
                                    {uploading ? 'Téléchargement en cours...' : 'Création en cours...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Créer le produit
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>


            {showAddCategorie && (
                <AddCategories
                    onClose={() => setShowAddCategorie(false)}
                    onSuccess={reloadCategories}
                />
            )}

            {showAddMarque && (
                <AddMarques
                    onClose={() => setShowAddMarque(false)}
                    onSuccess={reloadMarques}
                />
            )}


            {/* Styles pour l'animation */}
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default NewProduit;