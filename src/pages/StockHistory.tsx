import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, Filter, Printer, Download, Eye, Plus, Minus, 
    Package, AlertTriangle, CheckCircle, XCircle, RefreshCw,
    BarChart3, TrendingDown, TrendingUp, Edit, Trash2,
    ChevronLeft, ChevronRight, Layers, ShoppingCart, DollarSign
} from 'lucide-react';

const StockHistory = () => {
    // États principaux
    const [search, setSearch] = useState('');
    const [produits, setProduits] = useState([]);
    const [filterCategorie, setFilterCategorie] = useState('tous');
    const [filterStatut, setFilterStatut] = useState('tous');
    const [loading, setLoading] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showAjustement, setShowAjustement] = useState(false);
    const [ajustementData, setAjustementData] = useState({ type: 'ajout', quantite: 1, motif: '' });
    const [showAlerteSeuil, setShowAlerteSeuil] = useState(true);

    // Données mockées pour les produits
    const produitsMock = [
        {
            id: 'PROD-001',
            nom: 'Ordinateur Portable HP EliteBook',
            reference: 'HP-ELITE-X360',
            categorie: 'Informatique',
            fournisseur: 'HP Distribution',
            stockActuel: 15,
            stockMinimum: 5,
            stockMaximum: 50,
            prixAchat: 600000,
            prixVente: 899900,
            emplacement: 'Aisle 3, Shelf B',
            dateDerniereEntree: '2024-01-15',
            dateDerniereSortie: '2024-01-18',
            statut: 'normal',
            ventesMois: 8,
            marge: 299900
        },
        {
            id: 'PROD-002',
            nom: 'Smartphone Samsung Galaxy S23',
            reference: 'SAMSUNG-GS23',
            categorie: 'Téléphonie',
            fournisseur: 'Samsung Bénin',
            stockActuel: 3,
            stockMinimum: 10,
            stockMaximum: 100,
            prixAchat: 450000,
            prixVente: 699900,
            emplacement: 'Aisle 1, Shelf A',
            dateDerniereEntree: '2024-01-10',
            dateDerniereSortie: '2024-01-20',
            statut: 'alerte',
            ventesMois: 25,
            marge: 249900
        },
        {
            id: 'PROD-003',
            nom: 'Écouteurs Bluetooth Sony WH-1000XM4',
            reference: 'SONY-WH1000XM4',
            categorie: 'Audio',
            fournisseur: 'Sony Africa',
            stockActuel: 0,
            stockMinimum: 15,
            stockMaximum: 80,
            prixAchat: 120000,
            prixVente: 199900,
            emplacement: 'Aisle 2, Shelf C',
            dateDerniereEntree: '2024-01-05',
            dateDerniereSortie: '2024-01-19',
            statut: 'rupture',
            ventesMois: 18,
            marge: 79900
        },
        {
            id: 'PROD-004',
            nom: 'Tablette Apple iPad Air',
            reference: 'APPLE-IPADAIR',
            categorie: 'Tablettes',
            fournisseur: 'Apple Reseller',
            stockActuel: 12,
            stockMinimum: 8,
            stockMaximum: 40,
            prixAchat: 550000,
            prixVente: 849900,
            emplacement: 'Aisle 4, Shelf A',
            dateDerniereEntree: '2024-01-18',
            dateDerniereSortie: '2024-01-20',
            statut: 'normal',
            ventesMois: 6,
            marge: 299900
        },
        {
            id: 'PROD-005',
            nom: 'Souris Gaming Logitech G Pro',
            reference: 'LOGITECH-GPRO',
            categorie: 'Périphériques',
            fournisseur: 'Logitech Distribution',
            stockActuel: 45,
            stockMinimum: 20,
            stockMaximum: 150,
            prixAchat: 35000,
            prixVente: 69900,
            emplacement: 'Aisle 5, Shelf D',
            dateDerniereEntree: '2024-01-12',
            dateDerniereSortie: '2024-01-19',
            statut: 'normal',
            ventesMois: 32,
            marge: 34900
        },
        {
            id: 'PROD-006',
            nom: 'Enceinte Portable JBL Charge 5',
            reference: 'JBL-CHARGE5',
            categorie: 'Audio',
            fournisseur: 'JBL Africa',
            stockActuel: 7,
            stockMinimum: 15,
            stockMaximum: 60,
            prixAchat: 80000,
            prixVente: 129900,
            emplacement: 'Aisle 2, Shelf B',
            dateDerniereEntree: '2024-01-08',
            dateDerniereSortie: '2024-01-21',
            statut: 'alerte',
            ventesMois: 28,
            marge: 49900
        },
        {
            id: 'PROD-007',
            nom: 'Câble USB-C 2m',
            reference: 'CABLE-USBC-2M',
            categorie: 'Accessoires',
            fournisseur: 'ElectroTech',
            stockActuel: 120,
            stockMinimum: 50,
            stockMaximum: 300,
            prixAchat: 2500,
            prixVente: 5000,
            emplacement: 'Aisle 6, Shelf F',
            dateDerniereEntree: '2024-01-20',
            dateDerniereSortie: '2024-01-22',
            statut: 'normal',
            ventesMois: 156,
            marge: 2500
        },
        {
            id: 'PROD-008',
            nom: 'Montre Connectée Huawei Watch GT3',
            reference: 'HUAWEI-WATCHGT3',
            categorie: 'Montres',
            fournisseur: 'Huawei Bénin',
            stockActuel: 2,
            stockMinimum: 5,
            stockMaximum: 30,
            prixAchat: 120000,
            prixVente: 179900,
            emplacement: 'Aisle 7, Shelf A',
            dateDerniereEntree: '2023-12-15',
            dateDerniereSortie: '2024-01-18',
            statut: 'alerte',
            ventesMois: 9,
            marge: 59900
        }
    ];

    // Initialisation
    useEffect(() => {
        setProduits(produitsMock);
    }, []);

    // Calculer les statistiques
    const stats = useMemo(() => {
        const totalProduits = produits.length;
        const produitsEnRupture = produits.filter(p => p.statut === 'rupture').length;
        const produitsAlerte = produits.filter(p => p.statut === 'alerte').length;
        
        const valeurStock = produits.reduce((sum, p) => 
            sum + (p.stockActuel * p.prixAchat), 0);
        
        const valeurVentePotentielle = produits.reduce((sum, p) => 
            sum + (p.stockActuel * p.prixVente), 0);
        
        const margePotentielle = valeurVentePotentielle - valeurStock;
        
        // Produits les plus vendus ce mois
        const produitsPopulaires = [...produits]
            .sort((a, b) => b.ventesMois - a.ventesMois)
            .slice(0, 3)
            .map(p => ({ nom: p.nom, ventes: p.ventesMois }));
        
        return {
            totalProduits,
            produitsEnRupture,
            produitsAlerte,
            valeurStock,
            valeurVentePotentielle,
            margePotentielle,
            produitsPopulaires
        };
    }, [produits]);

    // Filtrer les produits
    const produitsFiltres = useMemo(() => {
        return produits.filter(produit => {
            const matchesSearch = 
                produit.nom.toLowerCase().includes(search.toLowerCase()) ||
                produit.reference.toLowerCase().includes(search.toLowerCase()) ||
                produit.fournisseur.toLowerCase().includes(search.toLowerCase());
            
            const matchesCategorie = 
                filterCategorie === 'tous' || produit.categorie === filterCategorie;
            
            const matchesStatut = 
                filterStatut === 'tous' || produit.statut === filterStatut;
            
            return matchesSearch && matchesCategorie && matchesStatut;
        });
    }, [produits, search, filterCategorie, filterStatut]);

    // Obtenir les catégories uniques
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(produits.map(p => p.categorie))];
        return ['tous', ...uniqueCategories];
    }, [produits]);

    // Obtenir la couleur du statut
    const getStatutColor = (statut) => {
        switch(statut) {
            case 'normal': return 'bg-green-100 text-green-800';
            case 'alerte': return 'bg-yellow-100 text-yellow-800';
            case 'rupture': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Obtenir l'icône du statut
    const getStatutIcon = (statut) => {
        switch(statut) {
            case 'normal': return <CheckCircle className="w-4 h-4" />;
            case 'alerte': return <AlertTriangle className="w-4 h-4" />;
            case 'rupture': return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    // Obtenir la barre de progression du stock
    const getStockProgress = (produit) => {
        const pourcentage = (produit.stockActuel / produit.stockMaximum) * 100;
        let color = 'bg-green-500';
        
        if (produit.statut === 'alerte') color = 'bg-yellow-500';
        if (produit.statut === 'rupture') color = 'bg-red-500';
        
        return {
            pourcentage: Math.min(pourcentage, 100),
            color
        };
    };

    // Ajuster le stock
    const ajusterStock = (produitId, type, quantite, motif) => {
        setProduits(prevProduits => 
            prevProduits.map(produit => {
                if (produit.id === produitId) {
                    const nouveauStock = type === 'ajout' 
                        ? produit.stockActuel + quantite
                        : produit.stockActuel - quantite;
                    
                    // Déterminer le nouveau statut
                    let nouveauStatut = 'normal';
                    if (nouveauStock <= 0) nouveauStatut = 'rupture';
                    else if (nouveauStock <= produit.stockMinimum) nouveauStatut = 'alerte';
                    
                    return {
                        ...produit,
                        stockActuel: nouveauStock,
                        statut: nouveauStatut,
                        dateDerniereEntree: type === 'ajout' ? new Date().toISOString().split('T')[0] : produit.dateDerniereEntree,
                        dateDerniereSortie: type === 'retrait' ? new Date().toISOString().split('T')[0] : produit.dateDerniereSortie
                    };
                }
                return produit;
            })
        );
        
        setShowAjustement(false);
        setAjustementData({ type: 'ajout', quantite: 1, motif: '' });
    };

    // Exporter les données
    const exporterDonnees = () => {
        const dataStr = JSON.stringify(produitsFiltres, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `etat_stock_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    // Imprimer l'état
    const imprimerEtat = () => {
        window.print();
    };

    // Recharger les données
    const rechargerDonnees = () => {
        setLoading(true);
        setTimeout(() => {
            setProduits([...produitsMock]);
            setLoading(false);
        }, 1000);
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
                                <h1 className="text-xl font-bold text-gray-900">État des Stocks</h1>
                                <p className="text-sm text-gray-600">Gestion et suivi des produits en stock</p>
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Alertes seuil bas */}
            {showAlerteSeuil && stats.produitsAlerte > 0 && (
                <div className="container mx-auto px-4 py-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <div>
                                <p className="font-medium text-yellow-800">
                                    {stats.produitsAlerte} produit{stats.produitsAlerte > 1 ? 's' : ''} en seuil bas
                                </p>
                                <p className="text-sm text-yellow-700">
                                    Certains produits approchent de la rupture de stock
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFilterStatut('alerte')}
                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium"
                        >
                            Voir les alertes
                        </button>
                    </div>
                </div>
            )}

            {/* Statistiques */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Produits</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalProduits}</p>
                                <p className="text-xs text-gray-500">
                                    {stats.produitsEnRupture} en rupture, {stats.produitsAlerte} seuil bas
                                </p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Valeur du Stock</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.valeurStock.toLocaleString()} F
                                </p>
                                <p className="text-xs text-green-600">
                                    + {stats.margePotentielle.toLocaleString()} F marge potentielle
                                </p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Ventes du Mois</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {produits.reduce((sum, p) => sum + p.ventesMois, 0)}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+12% vs mois dernier</span>
                                </div>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Produits Populaires</p>
                                <div className="space-y-1 mt-1">
                                    {stats.produitsPopulaires.map((prod, idx) => (
                                        <div key={idx} className="text-xs">
                                            <span className="font-medium">{prod.nom.split(' ')[0]}</span>
                                            <span className="text-gray-600"> - {prod.ventes} ventes</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-orange-600" />
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
                                    placeholder="Rechercher par nom, référence ou fournisseur..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {/* Filtre catégorie */}
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <select
                                    value={filterCategorie}
                                    onChange={(e) => setFilterCategorie(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                >
                                    {categories.map((categorie) => (
                                        <option key={categorie} value={categorie}>
                                            {categorie === 'tous' ? 'Toutes catégories' : categorie}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Filtre statut */}
                            <select
                                value={filterStatut}
                                onChange={(e) => setFilterStatut(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                            >
                                <option value="tous">Tous statuts</option>
                                <option value="normal">Stock normal</option>
                                <option value="alerte">Seuil bas</option>
                                <option value="rupture">Rupture</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tableau des produits */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">
                            Produits ({produitsFiltres.length})
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={imprimerEtat}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Imprimer
                            </button>
                            <button
                                onClick={exporterDonnees}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Exporter
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Produit
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Catégorie
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Prix
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {produitsFiltres.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            Aucun produit trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    produitsFiltres.map((produit) => {
                                        const progress = getStockProgress(produit);
                                        return (
                                            <tr key={produit.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{produit.nom}</div>
                                                            <div className="text-xs text-gray-500">
                                                                Ref: {produit.reference}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{produit.categorie}</div>
                                                    <div className="text-xs text-gray-500">{produit.fournisseur}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-bold text-gray-900">
                                                                {produit.stockActuel} unités
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                Min: {produit.stockMinimum}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className={`h-2 rounded-full ${progress.color}`}
                                                                style={{ width: `${progress.pourcentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Max: {produit.stockMaximum}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <div className="text-gray-900">
                                                            Achat: {produit.prixAchat.toLocaleString()} F
                                                        </div>
                                                        <div className="font-bold text-green-600">
                                                            Vente: {produit.prixVente.toLocaleString()} F
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatutColor(produit.statut)}`}>
                                                            {getStatutIcon(produit.statut)}
                                                            {produit.statut === 'normal' ? 'Normal' : 
                                                             produit.statut === 'alerte' ? 'Seuil bas' : 'Rupture'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProduit(produit);
                                                                setShowDetails(true);
                                                            }}
                                                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                            title="Voir détails"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProduit(produit);
                                                                setAjustementData({ 
                                                                    type: 'ajout', 
                                                                    quantite: 1, 
                                                                    motif: '' 
                                                                });
                                                                setShowAjustement(true);
                                                            }}
                                                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                                            title="Ajuster stock"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                // Action pour supprimer
                                                                if (window.confirm(`Supprimer ${produit.nom} ?`)) {
                                                                    setProduits(prev => 
                                                                        prev.filter(p => p.id !== produit.id)
                                                                    );
                                                                }
                                                            }}
                                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {produitsFiltres.length > 0 && (
                        <div className="px-6 py-4 border-t flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Affichage de {produitsFiltres.length} produits
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

            {/* Modal Détails Produit */}
            {showDetails && selectedProduit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedProduit.nom}</h2>
                                        <p className="text-gray-600">Ref: {selectedProduit.reference}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Informations stock */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">État du Stock</h3>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-3 bg-white rounded border">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {selectedProduit.stockActuel}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Stock actuel</div>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded border">
                                                    <div className="text-xl font-bold text-yellow-600">
                                                        {selectedProduit.stockMinimum}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Stock minimum</div>
                                                </div>
                                            </div>
                                            
                                            {/* Barre de progression */}
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Niveau de stock</span>
                                                    <span>{Math.round((selectedProduit.stockActuel / selectedProduit.stockMaximum) * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div 
                                                        className={`h-3 rounded-full ${getStockProgress(selectedProduit).color}`}
                                                        style={{ width: `${getStockProgress(selectedProduit).pourcentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                    <span>0</span>
                                                    <span>Maximum: {selectedProduit.stockMaximum}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Mouvements récents */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Derniers mouvements</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <div className="flex items-center gap-2">
                                                    <Plus className="w-4 h-4 text-green-600" />
                                                    <span>Dernière entrée</span>
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {selectedProduit.dateDerniereEntree}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <div className="flex items-center gap-2">
                                                    <Minus className="w-4 h-4 text-red-600" />
                                                    <span>Dernière sortie</span>
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {selectedProduit.dateDerniereSortie}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Informations produit */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Informations Produit</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Catégorie:</span>
                                                <span className="font-medium">{selectedProduit.categorie}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Fournisseur:</span>
                                                <span className="font-medium">{selectedProduit.fournisseur}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Emplacement:</span>
                                                <span className="font-medium">{selectedProduit.emplacement}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Prix et marge */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Prix et Marge</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Prix d'achat:</span>
                                                <span className="font-medium">{selectedProduit.prixAchat.toLocaleString()} F</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Prix de vente:</span>
                                                <span className="font-bold text-green-600">{selectedProduit.prixVente.toLocaleString()} F</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t">
                                                <span className="text-gray-600">Marge unitaire:</span>
                                                <span className="font-bold text-blue-600">
                                                    {selectedProduit.marge.toLocaleString()} F
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ventes ce mois:</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{selectedProduit.ventesMois}</span>
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDetails(false);
                                    setSelectedProduit(selectedProduit);
                                    setAjustementData({ 
                                        type: 'ajout', 
                                        quantite: 1, 
                                        motif: '' 
                                    });
                                    setShowAjustement(true);
                                }}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Edit className="w-5 h-5" />
                                Ajuster le stock
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

            {/* Modal Ajustement Stock */}
            {showAjustement && selectedProduit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Ajustement de stock</h2>
                                    <p className="text-sm text-gray-600">{selectedProduit.nom}</p>
                                </div>
                                <button 
                                    onClick={() => setShowAjustement(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            {/* Stock actuel */}
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">
                                        {selectedProduit.stockActuel}
                                    </div>
                                    <div className="text-sm text-blue-700">Stock actuel</div>
                                </div>
                            </div>
                            
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                ajusterStock(
                                    selectedProduit.id, 
                                    ajustementData.type, 
                                    ajustementData.quantite,
                                    ajustementData.motif
                                );
                            }}>
                                <div className="space-y-4">
                                    {/* Type d'ajustement */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type d'ajustement
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setAjustementData({...ajustementData, type: 'ajout'})}
                                                className={`py-2 rounded-lg flex items-center justify-center gap-2 ${
                                                    ajustementData.type === 'ajout' 
                                                    ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                                                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                                                }`}
                                            >
                                                <Plus className="w-4 h-4" />
                                                Ajout
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setAjustementData({...ajustementData, type: 'retrait'})}
                                                className={`py-2 rounded-lg flex items-center justify-center gap-2 ${
                                                    ajustementData.type === 'retrait' 
                                                    ? 'bg-red-100 text-red-700 border-2 border-red-500' 
                                                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                                                }`}
                                            >
                                                <Minus className="w-4 h-4" />
                                                Retrait
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Quantité */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantité
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={ajustementData.type === 'retrait' ? selectedProduit.stockActuel : 9999}
                                            value={ajustementData.quantite}
                                            onChange={(e) => setAjustementData({
                                                ...ajustementData, 
                                                quantite: parseInt(e.target.value) || 1
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    
                                    {/* Motif */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Motif
                                        </label>
                                        <textarea
                                            value={ajustementData.motif}
                                            onChange={(e) => setAjustementData({
                                                ...ajustementData, 
                                                motif: e.target.value
                                            })}
                                            placeholder="Raison de l'ajustement..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            rows="3"
                                            required
                                        />
                                    </div>
                                    
                                    {/* Nouveau stock */}
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Nouveau stock:</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                {ajustementData.type === 'ajout' 
                                                    ? selectedProduit.stockActuel + ajustementData.quantite
                                                    : selectedProduit.stockActuel - ajustementData.quantite
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                    >
                                        Confirmer l'ajustement
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAjustement(false)}
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
            
            {/* Footer */}
            <footer className="mt-8 py-6 border-t bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-gray-600">
                        <p>© 2024 État des Stocks - {stats.totalProduits} produits enregistrés</p>
                        <p className="mt-1">
                            Valeur totale: {stats.valeurStock.toLocaleString()} F | 
                            <span className="text-green-600 ml-2">
                                Marge potentielle: {stats.margePotentielle.toLocaleString()} F
                            </span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default StockHistory;