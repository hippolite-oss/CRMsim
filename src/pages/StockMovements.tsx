import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, Filter, Download, Printer, Eye, Plus, Minus, 
    RefreshCw, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
    Package, User, Calendar, Hash, TrendingUp, TrendingDown,
    CheckCircle, XCircle, AlertTriangle, ExternalLink, Copy,
    BarChart3, DollarSign, ShoppingCart, Layers
} from 'lucide-react';

const StockMovements = () => {
    // États principaux
    const [mouvements, setMouvements] = useState([]);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('tous');
    const [filterProduit, setFilterProduit] = useState('tous');
    const [filterDate, setFilterDate] = useState('tous');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNouveauMouvement, setShowNouveauMouvement] = useState(false);
    const [nouveauMouvement, setNouveauMouvement] = useState({
        type: 'entree',
        produitId: '',
        quantite: 1,
        motif: '',
        utilisateur: 'Admin',
        reference: `MV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    });
    const [selectedMouvement, setSelectedMouvement] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // Produits disponibles (mockés)
    const produitsMock = [
        { id: 'PROD-001', nom: 'Ordinateur Portable HP EliteBook', stockActuel: 15 },
        { id: 'PROD-002', nom: 'Smartphone Samsung Galaxy S23', stockActuel: 3 },
        { id: 'PROD-003', nom: 'Écouteurs Bluetooth Sony', stockActuel: 0 },
        { id: 'PROD-004', nom: 'Tablette Apple iPad Air', stockActuel: 12 },
        { id: 'PROD-005', nom: 'Souris Gaming Logitech', stockActuel: 45 },
        { id: 'PROD-006', nom: 'Enceinte Portable JBL', stockActuel: 7 },
        { id: 'PROD-007', nom: 'Câble USB-C 2m', stockActuel: 120 },
        { id: 'PROD-008', nom: 'Montre Connectée Huawei', stockActuel: 2 }
    ];

    // Mouvements mockés
    const mouvementsMock = [
        {
            id: 'MV-2024-001234',
            reference: 'MV-2024-001234',
            date: '2024-01-20 10:30:45',
            type: 'entree',
            produit: { id: 'PROD-001', nom: 'Ordinateur Portable HP EliteBook' },
            quantite: 5,
            stockAvant: 10,
            stockApres: 15,
            motif: 'Réapprovisionnement mensuel',
            utilisateur: 'Admin',
            fournisseur: 'HP Distribution',
            factureRef: 'FACT-2024-00123',
            statut: 'termine'
        },
        {
            id: 'MV-2024-001233',
            reference: 'MV-2024-001233',
            date: '2024-01-20 09:15:22',
            type: 'sortie',
            produit: { id: 'PROD-002', nom: 'Smartphone Samsung Galaxy S23' },
            quantite: 2,
            stockAvant: 5,
            stockApres: 3,
            motif: 'Vente à M. Dupont',
            utilisateur: 'Vendeur1',
            client: 'Jean Dupont',
            venteRef: 'VENT-2024-00123',
            statut: 'termine'
        },
        {
            id: 'MV-2024-001232',
            reference: 'MV-2024-001232',
            date: '2024-01-19 16:45:18',
            type: 'ajustement',
            produit: { id: 'PROD-003', nom: 'Écouteurs Bluetooth Sony' },
            quantite: -3,
            stockAvant: 3,
            stockApres: 0,
            motif: 'Inventaire - produits défectueux',
            utilisateur: 'Admin',
            statut: 'termine'
        },
        {
            id: 'MV-2024-001231',
            reference: 'MV-2024-001231',
            date: '2024-01-19 14:20:33',
            type: 'entree',
            produit: { id: 'PROD-005', nom: 'Souris Gaming Logitech' },
            quantite: 20,
            stockAvant: 25,
            stockApres: 45,
            motif: 'Commande urgente',
            utilisateur: 'Admin',
            fournisseur: 'Logitech Distribution',
            factureRef: 'FACT-2024-00122',
            statut: 'termine'
        },
        {
            id: 'MV-2024-001230',
            reference: 'MV-2024-001230',
            date: '2024-01-18 11:10:15',
            type: 'sortie',
            produit: { id: 'PROD-004', nom: 'Tablette Apple iPad Air' },
            quantite: 3,
            stockAvant: 15,
            stockApres: 12,
            motif: 'Vente en gros',
            utilisateur: 'Vendeur2',
            client: 'SARL TechImport',
            venteRef: 'VENT-2024-00122',
            statut: 'termine'
        },
        {
            id: 'MV-2024-001229',
            reference: 'MV-2024-001229',
            date: '2024-01-18 09:45:12',
            type: 'transfert',
            produit: { id: 'PROD-007', nom: 'Câble USB-C 2m' },
            quantite: 50,
            stockAvant: 170,
            stockApres: 120,
            motif: 'Transfert vers succursale Cotonou',
            utilisateur: 'Admin',
            destination: 'Succursale Cotonou',
            statut: 'termine'
        },
        {
            id: 'MV-2024-001228',
            reference: 'MV-2024-001228',
            date: '2024-01-17 15:30:45',
            type: 'entree',
            produit: { id: 'PROD-006', nom: 'Enceinte Portable JBL' },
            quantite: 10,
            stockAvant: 0,
            stockApres: 10,
            motif: 'Nouvel arrivage',
            utilisateur: 'Admin',
            fournisseur: 'JBL Africa',
            factureRef: 'FACT-2024-00121',
            statut: 'termine'
        },
        {
            id: 'MV-2024-001227',
            reference: 'MV-2024-001227',
            date: '2024-01-17 13:20:18',
            type: 'sortie',
            produit: { id: 'PROD-008', nom: 'Montre Connectée Huawei' },
            quantite: 1,
            stockAvant: 3,
            stockApres: 2,
            motif: 'Vente client',
            utilisateur: 'Vendeur1',
            client: 'Marie Martin',
            venteRef: 'VENT-2024-00121',
            statut: 'termine'
        },
        {
            id: 'MV-2024-001226',
            reference: 'MV-2024-001226',
            date: '2024-01-16 16:15:33',
            type: 'ajustement',
            produit: { id: 'PROD-001', nom: 'Ordinateur Portable HP EliteBook' },
            quantite: -1,
            stockAvant: 11,
            stockApres: 10,
            motif: 'Retour client - produit défectueux',
            utilisateur: 'Admin',
            statut: 'termine'
        },
        {
            id: 'MV-2024-001225',
            reference: 'MV-2024-001225',
            date: '2024-01-16 10:05:22',
            type: 'entree',
            produit: { id: 'PROD-002', nom: 'Smartphone Samsung Galaxy S23' },
            quantite: 8,
            stockAvant: 0,
            stockApres: 8,
            motif: 'Réception commande',
            utilisateur: 'Admin',
            fournisseur: 'Samsung Bénin',
            factureRef: 'FACT-2024-00120',
            statut: 'termine'
        }
    ];

    // Initialisation
    useEffect(() => {
        setMouvements(mouvementsMock);
    }, []);

    // Calcul des statistiques
    const stats = useMemo(() => {
        const aujourdHui = new Date().toISOString().split('T')[0];
        
        const mouvementsAujourdhui = mouvements.filter(m => 
            m.date.split(' ')[0] === aujourdHui
        );
        
        const totalEntrees = mouvements
            .filter(m => m.type === 'entree')
            .reduce((sum, m) => sum + Math.abs(m.quantite), 0);
        
        const totalSorties = mouvements
            .filter(m => m.type === 'sortie')
            .reduce((sum, m) => sum + Math.abs(m.quantite), 0);
        
        const mouvementsParJour = {};
        mouvements.forEach(m => {
            const date = m.date.split(' ')[0];
            if (!mouvementsParJour[date]) {
                mouvementsParJour[date] = {
                    entree: 0,
                    sortie: 0,
                    ajustement: 0,
                    transfert: 0
                };
            }
            mouvementsParJour[date][m.type] += Math.abs(m.quantite);
        });
        
        // Trouver le jour avec le plus d'activité
        let jourPlusActif = { date: '', total: 0 };
        Object.entries(mouvementsParJour).forEach(([date, data]) => {
            const total = data.entree + data.sortie + data.ajustement + data.transfert;
            if (total > jourPlusActif.total) {
                jourPlusActif = { date, total };
            }
        });
        
        return {
            totalMouvements: mouvements.length,
            mouvementsAujourdhui: mouvementsAujourdhui.length,
            totalEntrees,
            totalSorties,
            jourPlusActif,
            mouvementRecent: mouvements.length > 0 ? mouvements[0] : null
        };
    }, [mouvements]);

    // Filtrer les mouvements
    const mouvementsFiltres = useMemo(() => {
        return mouvements.filter(mouvement => {
            const matchesSearch = 
                mouvement.reference.toLowerCase().includes(search.toLowerCase()) ||
                mouvement.produit.nom.toLowerCase().includes(search.toLowerCase()) ||
                (mouvement.motif && mouvement.motif.toLowerCase().includes(search.toLowerCase()));
            
            const matchesType = filterType === 'tous' || mouvement.type === filterType;
            const matchesProduit = filterProduit === 'tous' || mouvement.produit.id === filterProduit;
            
            let matchesDate = true;
            if (dateDebut && dateFin) {
                const mouvementDate = mouvement.date.split(' ')[0];
                matchesDate = mouvementDate >= dateDebut && mouvementDate <= dateFin;
            } else if (filterDate !== 'tous') {
                const aujourdHui = new Date().toISOString().split('T')[0];
                const hier = new Date();
                hier.setDate(hier.getDate() - 1);
                const hierStr = hier.toISOString().split('T')[0];
                
                const mouvementDate = mouvement.date.split(' ')[0];
                
                switch(filterDate) {
                    case 'aujourdhui':
                        matchesDate = mouvementDate === aujourdHui;
                        break;
                    case 'hier':
                        matchesDate = mouvementDate === hierStr;
                        break;
                    case 'semaine':
                        const semaineAgo = new Date();
                        semaineAgo.setDate(semaineAgo.getDate() - 7);
                        const semaineStr = semaineAgo.toISOString().split('T')[0];
                        matchesDate = mouvementDate >= semaineStr;
                        break;
                    case 'mois':
                        const moisAgo = new Date();
                        moisAgo.setMonth(moisAgo.getMonth() - 1);
                        const moisStr = moisAgo.toISOString().split('T')[0];
                        matchesDate = mouvementDate >= moisStr;
                        break;
                }
            }
            
            return matchesSearch && matchesType && matchesProduit && matchesDate;
        });
    }, [mouvements, search, filterType, filterProduit, filterDate, dateDebut, dateFin]);

    // Formater la date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Obtenir la couleur du type
    const getTypeColor = (type) => {
        switch(type) {
            case 'entree': return 'bg-green-100 text-green-800 border-green-200';
            case 'sortie': return 'bg-red-100 text-red-800 border-red-200';
            case 'ajustement': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'transfert': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Obtenir l'icône du type
    const getTypeIcon = (type) => {
        switch(type) {
            case 'entree': return <ArrowUpRight className="w-4 h-4" />;
            case 'sortie': return <ArrowDownRight className="w-4 h-4" />;
            case 'ajustement': return <RefreshCw className="w-4 h-4" />;
            case 'transfert': return <ExternalLink className="w-4 h-4" />;
            default: return null;
        }
    };

    // Obtenir le libellé du type
    const getTypeLabel = (type) => {
        switch(type) {
            case 'entree': return 'Entrée';
            case 'sortie': return 'Sortie';
            case 'ajustement': return 'Ajustement';
            case 'transfert': return 'Transfert';
            default: return type;
        }
    };

    // Ajouter un nouveau mouvement
    const ajouterMouvement = () => {
        if (!nouveauMouvement.produitId || nouveauMouvement.quantite < 1) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        const produit = produitsMock.find(p => p.id === nouveauMouvement.produitId);
        const quantiteAbs = Math.abs(nouveauMouvement.quantite);
        
        const nouveauStock = nouveauMouvement.type === 'entree' 
            ? produit.stockActuel + quantiteAbs
            : produit.stockActuel - quantiteAbs;

        const nouveauMvt = {
            id: `MV-${Date.now()}`,
            reference: nouveauMouvement.reference,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            type: nouveauMouvement.type,
            produit: {
                id: produit.id,
                nom: produit.nom
            },
            quantite: nouveauMouvement.type === 'entree' ? quantiteAbs : -quantiteAbs,
            stockAvant: produit.stockActuel,
            stockApres: nouveauStock,
            motif: nouveauMouvement.motif,
            utilisateur: nouveauMouvement.utilisateur,
            statut: 'termine'
        };

        setMouvements(prev => [nouveauMvt, ...prev]);
        
        // Réinitialiser le formulaire
        setNouveauMouvement({
            type: 'entree',
            produitId: '',
            quantite: 1,
            motif: '',
            utilisateur: 'Admin',
            reference: `MV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
        });
        
        setShowNouveauMouvement(false);
    };

    // Exporter les données
    const exporterDonnees = () => {
        const dataStr = JSON.stringify(mouvementsFiltres, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mouvements_stock_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    // Recharger les données
    const rechargerDonnees = () => {
        setLoading(true);
        setTimeout(() => {
            setMouvements([...mouvementsMock]);
            setLoading(false);
        }, 1000);
    };

    // Copier la référence
    const copierReference = (reference) => {
        navigator.clipboard.writeText(reference);
        alert(`Référence ${reference} copiée !`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg">
                                <Layers className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Mouvements de Stock</h1>
                                <p className="text-sm text-gray-600">Suivi des entrées, sorties et ajustements</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={rechargerDonnees}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Actualiser
                            </button>
                            <button
                                onClick={() => setShowNouveauMouvement(true)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Nouveau Mouvement
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Mouvements</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalMouvements}</p>
                                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{stats.mouvementsAujourdhui} aujourd'hui</span>
                                </div>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Entrées</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalEntrees}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                    Unités reçues
                                </div>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ArrowUpRight className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Sorties</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalSorties}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                    Unités vendues
                                </div>
                            </div>
                            <div className="p-2 bg-red-100 rounded-lg">
                                <ArrowDownRight className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Jour le plus actif</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {stats.jourPlusActif.date || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {stats.jourPlusActif.total} mouvements
                                </p>
                            </div>
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par référence, produit ou motif..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {/* Filtre type */}
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                >
                                    <option value="tous">Tous types</option>
                                    <option value="entree">Entrées</option>
                                    <option value="sortie">Sorties</option>
                                    <option value="ajustement">Ajustements</option>
                                    <option value="transfert">Transferts</option>
                                </select>
                            </div>
                            
                            {/* Filtre produit */}
                            <select
                                value={filterProduit}
                                onChange={(e) => setFilterProduit(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                            >
                                <option value="tous">Tous produits</option>
                                {produitsMock.map(produit => (
                                    <option key={produit.id} value={produit.id}>
                                        {produit.nom}
                                    </option>
                                ))}
                            </select>
                            
                            {/* Filtre date */}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <select
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                >
                                    <option value="tous">Toutes dates</option>
                                    <option value="aujourdhui">Aujourd'hui</option>
                                    <option value="hier">Hier</option>
                                    <option value="semaine">7 derniers jours</option>
                                    <option value="mois">30 derniers jours</option>
                                    <option value="personnalise">Période personnalisée</option>
                                </select>
                            </div>
                            
                            {/* Date personnalisée */}
                            {filterDate === 'personnalise' && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={dateDebut}
                                        onChange={(e) => setDateDebut(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    />
                                    <span>au</span>
                                    <input
                                        type="date"
                                        value={dateFin}
                                        onChange={(e) => setDateFin(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tableau des mouvements */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">
                            Historique des Mouvements ({mouvementsFiltres.length})
                        </h2>
                        <button
                            onClick={exporterDonnees}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Exporter
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Référence
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Produit
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantité
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Utilisateur
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {mouvementsFiltres.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            Aucun mouvement trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    mouvementsFiltres.map((mouvement) => (
                                        <tr key={mouvement.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-blue-600">{mouvement.reference}</div>
                                                <div className="text-xs text-gray-500">
                                                    {mouvement.type === 'entree' && mouvement.factureRef && `Facture: ${mouvement.factureRef}`}
                                                    {mouvement.type === 'sortie' && mouvement.venteRef && `Vente: ${mouvement.venteRef}`}
                                                    {mouvement.type === 'transfert' && mouvement.destination && `Vers: ${mouvement.destination}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(mouvement.date)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getTypeColor(mouvement.type)}`}>
                                                        {getTypeIcon(mouvement.type)}
                                                        {getTypeLabel(mouvement.type)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {mouvement.produit.nom}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Ref: {mouvement.produit.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {mouvement.type === 'entree' ? (
                                                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                                                    )}
                                                    <span className={`font-bold ${mouvement.type === 'entree' ? 'text-green-700' : 'text-red-700'}`}>
                                                        {mouvement.type === 'entree' ? '+' : ''}{Math.abs(mouvement.quantite)}
                                                    </span>
                                                    <span className="text-sm text-gray-500">unités</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-600">Avant:</span>
                                                        <span className="font-medium">{mouvement.stockAvant}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-600">Après:</span>
                                                        <span className="font-bold text-blue-600">{mouvement.stockApres}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {mouvement.utilisateur}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedMouvement(mouvement);
                                                            setShowDetails(true);
                                                        }}
                                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        title="Voir détails"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => copierReference(mouvement.reference)}
                                                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                                                        title="Copier référence"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {mouvementsFiltres.length > 0 && (
                        <div className="px-6 py-4 border-t flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Affichage de {mouvementsFiltres.length} mouvements
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</span>
                                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Nouveau Mouvement */}
            {showNouveauMouvement && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Nouveau Mouvement</h2>
                                    <p className="text-gray-600">Enregistrer une entrée, sortie ou ajustement</p>
                                </div>
                                <button 
                                    onClick={() => setShowNouveauMouvement(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                ajouterMouvement();
                            }}>
                                <div className="space-y-4">
                                    {/* Type de mouvement */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type de mouvement
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {[
                                                { value: 'entree', label: 'Entrée', icon: <ArrowUpRight className="w-4 h-4" />, color: 'green' },
                                                { value: 'sortie', label: 'Sortie', icon: <ArrowDownRight className="w-4 h-4" />, color: 'red' },
                                                { value: 'ajustement', label: 'Ajustement', icon: <RefreshCw className="w-4 h-4" />, color: 'blue' },
                                                { value: 'transfert', label: 'Transfert', icon: <ExternalLink className="w-4 h-4" />, color: 'purple' }
                                            ].map((type) => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => setNouveauMouvement({
                                                        ...nouveauMouvement,
                                                        type: type.value
                                                    })}
                                                    className={`py-3 rounded-lg flex flex-col items-center justify-center gap-2 border ${
                                                        nouveauMouvement.type === type.value 
                                                        ? `bg-${type.color}-100 text-${type.color}-700 border-${type.color}-500` 
                                                        : 'bg-gray-100 text-gray-700 border-gray-300'
                                                    }`}
                                                >
                                                    {type.icon}
                                                    <span>{type.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Produit */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Produit *
                                        </label>
                                        <select
                                            value={nouveauMouvement.produitId}
                                            onChange={(e) => setNouveauMouvement({
                                                ...nouveauMouvement,
                                                produitId: e.target.value
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            required
                                        >
                                            <option value="">Sélectionner un produit</option>
                                            {produitsMock.map(produit => (
                                                <option key={produit.id} value={produit.id}>
                                                    {produit.nom} (Stock: {produit.stockActuel})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {/* Quantité */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantité *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={nouveauMouvement.quantite}
                                            onChange={(e) => setNouveauMouvement({
                                                ...nouveauMouvement,
                                                quantite: parseInt(e.target.value) || 1
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    
                                    {/* Motif */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Motif / Raison *
                                        </label>
                                        <textarea
                                            value={nouveauMouvement.motif}
                                            onChange={(e) => setNouveauMouvement({
                                                ...nouveauMouvement,
                                                motif: e.target.value
                                            })}
                                            placeholder="Détaillez la raison de ce mouvement..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            rows="3"
                                            required
                                        />
                                    </div>
                                    
                                    {/* Informations supplémentaires selon le type */}
                                    {nouveauMouvement.type === 'entree' && (
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <h3 className="font-medium text-blue-900 mb-2">Informations fournisseur</h3>
                                            <input
                                                type="text"
                                                placeholder="Nom du fournisseur"
                                                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:border-blue-500 outline-none mb-2"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Référence facture"
                                                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    )}
                                    
                                    {nouveauMouvement.type === 'sortie' && (
                                        <div className="p-4 bg-red-50 rounded-lg">
                                            <h3 className="font-medium text-red-900 mb-2">Informations client</h3>
                                            <input
                                                type="text"
                                                placeholder="Nom du client"
                                                className="w-full px-4 py-2 border border-red-300 rounded-lg focus:border-red-500 outline-none mb-2"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Référence vente"
                                                className="w-full px-4 py-2 border border-red-300 rounded-lg focus:border-red-500 outline-none"
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Récapitulatif */}
                                    {nouveauMouvement.produitId && (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">Récapitulatif</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Produit:</span>
                                                    <span className="font-medium">
                                                        {produitsMock.find(p => p.id === nouveauMouvement.produitId)?.nom}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Stock actuel:</span>
                                                    <span className="font-medium">
                                                        {produitsMock.find(p => p.id === nouveauMouvement.produitId)?.stockActuel}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Stock après mouvement:</span>
                                                    <span className={`font-bold ${
                                                        nouveauMouvement.type === 'entree' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {nouveauMouvement.type === 'entree' 
                                                            ? (produitsMock.find(p => p.id === nouveauMouvement.produitId)?.stockActuel || 0) + nouveauMouvement.quantite
                                                            : (produitsMock.find(p => p.id === nouveauMouvement.produitId)?.stockActuel || 0) - nouveauMouvement.quantite
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Enregistrer le mouvement
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNouveauMouvement(false)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Détails Mouvement */}
            {showDetails && selectedMouvement && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${getTypeColor(selectedMouvement.type).split(' ')[0]} ${getTypeColor(selectedMouvement.type).split(' ')[1]}`}>
                                        {getTypeIcon(selectedMouvement.type)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedMouvement.reference}</h2>
                                        <p className="text-gray-600">{getTypeLabel(selectedMouvement.type)} de stock</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Informations mouvement */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Informations</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Date:</span>
                                                <span className="font-medium">{formatDate(selectedMouvement.date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Utilisateur:</span>
                                                <span className="font-medium">{selectedMouvement.utilisateur}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Statut:</span>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                                    Terminé
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Motif */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Motif</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-700">{selectedMouvement.motif}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Informations produit */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Produit concerné</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{selectedMouvement.produit.nom}</div>
                                                    <div className="text-xs text-gray-500">Ref: {selectedMouvement.produit.id}</div>
                                                </div>
                                            </div>
                                            
                                            {/* Évolution du stock */}
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-gray-600">Évolution du stock</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold text-gray-500">{selectedMouvement.stockAvant}</div>
                                                        <div className="text-xs text-gray-500">Avant</div>
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-center">
                                                        <div className={`p-2 rounded-full ${selectedMouvement.type === 'entree' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                            {selectedMouvement.type === 'entree' ? (
                                                                <ArrowUpRight className="w-5 h-5" />
                                                            ) : (
                                                                <ArrowDownRight className="w-5 h-5" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className={`text-2xl font-bold ${selectedMouvement.type === 'entree' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {selectedMouvement.stockApres}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Après</div>
                                                    </div>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <span className={`text-sm font-medium ${selectedMouvement.type === 'entree' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {selectedMouvement.type === 'entree' ? '+' : ''}{Math.abs(selectedMouvement.quantite)} unités
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Informations complémentaires */}
                                    {(selectedMouvement.factureRef || selectedMouvement.venteRef || selectedMouvement.fournisseur || selectedMouvement.client) && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Informations complémentaires</h3>
                                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                                {selectedMouvement.factureRef && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Facture:</span>
                                                        <span className="font-medium">{selectedMouvement.factureRef}</span>
                                                    </div>
                                                )}
                                                {selectedMouvement.venteRef && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Vente:</span>
                                                        <span className="font-medium">{selectedMouvement.venteRef}</span>
                                                    </div>
                                                )}
                                                {selectedMouvement.fournisseur && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Fournisseur:</span>
                                                        <span className="font-medium">{selectedMouvement.fournisseur}</span>
                                                    </div>
                                                )}
                                                {selectedMouvement.client && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Client:</span>
                                                        <span className="font-medium">{selectedMouvement.client}</span>
                                                    </div>
                                                )}
                                                {selectedMouvement.destination && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Destination:</span>
                                                        <span className="font-medium">{selectedMouvement.destination}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t flex gap-3">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Printer className="w-5 h-5" />
                                Imprimer
                            </button>
                            <button
                                onClick={() => {
                                    copierReference(selectedMouvement.reference);
                                }}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Copy className="w-4 h-4" />
                                Copier référence
                            </button>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Footer */}
            <footer className="mt-8 py-6 border-t bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-gray-600">
                        <p>© 2024 Mouvements de Stock - {stats.totalMouvements} mouvements enregistrés</p>
                        <p className="mt-1">
                            Entrées: {stats.totalEntrees} | Sorties: {stats.totalSorties} | 
                            <span className="text-blue-600 ml-2">
                                Balance: {stats.totalEntrees - stats.totalSorties}
                            </span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default StockMovements;