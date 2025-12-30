import { useState } from 'react';
import { 
  Send, User, Phone, Mail, MapPin, ShoppingBag, 
  Check, MessageSquare, ArrowRight, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Commande = () => {
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    commande: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Efface l'erreur dès qu'on tape
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await Axios.post('/api/commande-online', formData);

      if (response.data.success) {
        setIsSubmitted(true);
        // On ne reset pas immédiatement pour que l'utilisateur voie les infos saisies
      } else {
        throw new Error(response.data.message || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      telephone: '',
      email: '',
      adresse: '',
      ville: '',
      commande: '',
      notes: ''
    });
    setIsSubmitted(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 lg:pt-24">
      <Header />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-12">
        {/* En-tête */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-100 rounded-full text-blue-700 font-semibold mb-6">
            <ShoppingBag className="h-6 w-6" />
            <span>Commande personnalisée</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Passez votre commande facilement
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Décrivez précisément ce dont vous avez besoin. Nous vous rappellerons rapidement pour confirmer et finaliser.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {isSubmitted ? (
            // Écran de succès
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-10 md:p-16 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Commande envoyée avec succès !</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Merci <strong>{formData.nom || 'cher client'}</strong>.<br />
                Nous avons bien reçu votre demande.<br />
                Un commercial vous appellera très bientôt au <strong>{formData.telephone}</strong> pour confirmer les détails, la disponibilité et le prix.
              </p>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <MessageSquare className="h-5 w-5" />
                Passer une nouvelle commande
              </button>
            </motion.div>
          ) : (
            // Formulaire principal
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 lg:p-12"
            >
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4" />
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="ASSOGBA Jean"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4" />
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      required
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="229 01 23 45 67 89"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4" />
                    Email (facultatif)
                  </label>
                  <input
                    type="email"
                    name="email"
    np                value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="assogbajean@example.com"
                  />
                </div>

                {/* Adresse */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4" />
                      Adresse complète *
                    </label>
                    <input
                      type="text"
                      name="adresse"
                      required
                      value={formData.adresse}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="123 Rue Sainte Rita, Cotonou"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Ville / Quartier *
                    </label>
                    <input
                      type="text"
                      name="ville"
                      required
                      value={formData.ville}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Cotonou, Akpakpa, Fidjrossè..."
                    />
                  </div>
                </div>

                {/* Détails de la commande */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <ShoppingBag className="h-4 w-4" />
                    Décrivez votre commande *
                  </label>
                  <textarea
                    name="commande"
                    rows={6}
                    required
                    value={formData.commande}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder={`Exemple :
- 1 Perceuse professionnelle Bosch 2000W
- 5 Sacs de ciment 50kg
- 10m de câble électrique 2.5mm²
- 1 Échafaudage pliable
Ou toute autre demande...`}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Soyez le plus précis possible (marque, modèle, quantité, dimensions...)
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Notes supplémentaires (facultatif)
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Ex: Livrer vendredi matin, appeler avant, besoin de facture pro..."
                  />
                </div>

                {/* Bouton d'envoi */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Envoyer la commande
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Nous vous rappellerons sous 24h pour confirmer disponibilité et prix exact.
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Commande;