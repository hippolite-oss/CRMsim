import React, { useState } from "react";
import Axios from "../utils/Axios";
import Modal from "../components/Modal";
import { Save } from "lucide-react";
import { notifySuccess, notifyError } from '../utils/notify.jsx';

interface AddCategoriesProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddCategories: React.FC<AddCategoriesProps> = ({ onClose, onSuccess }) => {
  const [nom, setNom] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;

    setLoading(true);
    try {
      const res = await Axios.post("/api/categories", { nom, description });
      if (res.data.success) {
        notifySuccess('Catégorie ajoutée avec succès !');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      notifyError('Erreur lors de l\'ajout de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Ajouter une catégorie" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Nom de la catégorie
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Fer, Plomberie, Peinture"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Description (facultatif)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? "Ajout en cours..." : "Ajouter la catégorie"}
        </button>
      </form>
    </Modal>
  );
};

export default AddCategories;