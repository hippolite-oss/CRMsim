import React, { useState, useEffect, useMemo } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard,
    Smartphone, Banknote, Calendar, Filter, Search, Download,
    Printer, Eye, Plus, Minus, RefreshCw, CheckCircle, XCircle,
    AlertTriangle, BarChart3, Users, ShoppingCart, Receipt,
    Building, ArrowUpRight, ArrowDownRight, ChevronLeft,
    ChevronRight, History, Clock, Shield, Lock
} from 'lucide-react';

const CashRegister = () => {
    // États principaux
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState('tous');
    const [filterDate, setFilterDate] = useState('aujourdhui');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [showNewTransaction, setShowNewTransaction] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showBalance, setShowBalance] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        type: 'encaissement',
        categorie: 'vente',
        montant: '',
        description: '',
        mode: 'especes',
        reference: '',
        date: new Date().toISOString().split('T')[0],
        heure: new Date().toTimeString().slice(0, 5),
        client: '',
        responsable: 'Admin',
        statut: 'complete'
    });

    // États pour la caisse
    const [caisse, setCaisse] = useState({
        soldeInitial: 5000000,
        soldeActuel: 0,
        totalEncaissements: 0,
        totalDecaissements: 0,
        ouverte: true,
        dateOuverture: new Date().toISOString().split('T')[0],
        heureOuverture: '08:00',
        responsableOuverture: 'Admin',
        derniereFermeture: '2024-01-19 19:30'
    });

    // Transactions mockées
    const transactionsMock = [
        {
            id: 'TRX-2024-001234',
            type: 'encaissement',
            categorie: 'vente',
            montant: 914900,
            description: 'Vente Ordinateur Portable HP',
            mode: 'especes',
            reference: 'VENT-2024-00123',
            date: '2024-01-20 14:30',
            client: 'Jean Dupont',
            responsable: 'Admin',
            statut: 'complete',
            soldeApres: 5914900
        },
        {
            id: 'TRX-2024-001233',
            type: 'decaissement',
            categorie: 'achat',
            montant: 300000,
            description: 'Achat stock smartphone',
            mode: 'mobile_money',
            reference: 'FACT-2024-00124',
            date: '2024-01-20 11:15',
            fournisseur: 'Samsung Bénin',
            responsable: 'Admin',
            statut: 'complete',
            soldeApres: 5614900
        },
        {
            id: 'TRX-2024-001232',
            type: 'encaissement',
            categorie: 'vente',
            montant: 439800,
            description: 'Vente smartphone et accessoires',
            mode: 'mobile_money',
            reference: 'VENT-2024-00122',
            date: '2024-01-19 16:45',
            client: 'Marie Martin',
            responsable: 'Vendeur1',
            statut: 'complete',
            soldeApres: 6054700
        },
        {
            id: 'TRX-2024-001231',
            type: 'decaissement',
            categorie: 'frais',
            montant: 50000,
            description: 'Frais de transport',
            mode: 'especes',
            reference: 'FRAIS-2024-00105',
            date: '2024-01-19 14:20',
            responsable: 'Admin',
            statut: 'complete',
            soldeApres: 6004700
        },
        {
            id: 'TRX-2024-001230',
            type: 'encaissement',
            categorie: 'vente',
            montant: 129900,
            description: 'Vente enceinte portable',
            mode: 'carte',
            reference: 'VENT-2024-00121',
            date: '2024-01-18 11:10',
            client: 'Pierre Bernard',
            responsable: 'Vendeur2',
            statut: 'complete',
            soldeApres: 6134600
        },
        {
            id: 'TRX-2024-001229',
            type: 'decaissement',
            categorie: 'salaires',
            montant: 1500000,
            description: 'Paiement salaires personnel',
            mode: 'virement',
            reference: 'SAL-2024-01',
            date: '2024-01-18 10:05',
            responsable: 'Admin',
            statut: 'complete',
            soldeApres: 4634600
        },
        {
            id: 'TRX-2024-001228',
            type: 'encaissement',
            categorie: 'acompte',
            montant: 200000,
            description: 'Acompte client SARL TechImport',
            mode: 'virement',
            reference: 'ACO-2024-00123',
            date: '2024-01-17 15:30',
            client: 'SARL TechImport',
            responsable: 'Admin',
            statut: 'complete',
            soldeApres: 4834600
        },
        {
            id: 'TRX-2024-001227',
            type: 'decaissement',
            categorie: 'loyer',
            montant: 300000,
            description: 'Paiement loyer magasin',
            mode: 'virement',
            reference: 'LOY-2024-01',
            date: '2024-01-17 13:20',
            responsable: 'Admin',
            statut: 'complete',
            soldeApres: 4534600
        },
        {
            id: 'TRX-2024-001226',
            type: 'encaissement',
            categorie: 'vente',
            montant: 699900,
            description: 'Vente 2 smartphones Android',
            mode: 'mobile_money',
            reference: 'VENT-2024-00120',
            date: '2024-01-16 16:15',
            client: 'Thomas Moreau',
            responsable: 'Admin',
            statut: 'complete',
            soldeApres: 5234500
        },
        {
            id: 'TRX-2024-001225',
            type: 'decaissement',
            categorie: 'publicite',
            montant: 150000,
            description: 'Campagne publicitaire radio',
            mode: 'mobile_money',
            reference: 'PUB-2024-00105',
            date: '2024-01-16 10:05',
            responsable: 'Admin',
            statut: 'complete',
            soldeApres: 5084500
        }
    ];

    // Catégories de transactions
    const categories = {
        encaissement: [
            { value: 'vente', label: 'Vente', color: 'bg-green-100 text-green-800' },
            { value: 'acompte', label: 'Acompte', color: 'bg-blue-100 text-blue-800' },
            { value: 'remboursement', label: 'Remboursement', color: 'bg-purple-100 text-purple-800' },
            { value: 'divers', label: 'Divers', color: 'bg-gray-100 text-gray-800' }
        ],
        decaissement: [
            { value: 'achat', label: 'Achat stock', color: 'bg-red-100 text-red-800' },
            { value: 'frais', label: 'Frais opérationnels', color: 'bg-yellow-100 text-yellow-800' },
            { value: 'salaires', label: 'Salaires', color: 'bg-orange-100 text-orange-800' },
            { value: 'loyer', label: 'Loyer', color: 'bg-indigo-100 text-indigo-800' },
            { value: 'publicite', label: 'Publicité', color: 'bg-pink-100 text-pink-800' },
            { value: 'divers', label: 'Divers', color: 'bg-gray-100 text-gray-800' }
        ]
    };

    // Initialisation
    useEffect(() => {
        setTransactions(transactionsMock);
        calculerSolde();
    }, []);

    // Calculer le solde et les totaux
    const calculerSolde = () => {
        const totalEncaissements = transactionsMock
            .filter(t => t.type === 'encaissement' && t.statut === 'complete')
            .reduce((sum, t) => sum + t.montant, 0);
        
        const totalDecaissements = transactionsMock
            .filter(t => t.type === 'decaissement' && t.statut === 'complete')
            .reduce((sum, t) => sum + t.montant, 0);
        
        const soldeActuel = caisse.soldeInitial + totalEncaissements - totalDecaissements;
        
        setCaisse(prev => ({
            ...prev,
            totalEncaissements,
            totalDecaissements,
            soldeActuel
        }));
    };

    // Statistiques
    const stats = useMemo(() => {
        const aujourdHui = new Date().toISOString().split('T')[0];
        
        const transactionsAujourdhui = transactions.filter(t => 
            t.date.split(' ')[0] === aujourdHui
        );
        
        const encaissementsAujourdhui = transactionsAujourdhui
            .filter(t => t.type === 'encaissement')
            .reduce((sum, t) => sum + t.montant, 0);
        
        const decaissementsAujourdhui = transactionsAujourdhui
            .filter(t => t.type === 'decaissement')
            .reduce((sum, t) => sum + t.montant, 0);
        
        // Transactions par mode de paiement
        const parMode = {};
        transactions.forEach(t => {
            if (!parMode[t.mode]) {
                parMode[t.mode] = { montant: 0, count: 0 };
            }
            parMode[t.mode].montant += t.montant;
            parMode[t.mode].count += 1;
        });
        
        // Catégorie la plus fréquente
        const parCategorie = {};
        transactions.forEach(t => {
            if (!parCategorie[t.categorie]) {
                parCategorie[t.categorie] = { montant: 0, count: 0 };
            }
            parCategorie[t.categorie].montant += t.montant;
            parCategorie[t.categorie].count += 1;
        });
        
        let categoriePlusFrequente = '';
        let maxCount = 0;
        Object.entries(parCategorie).forEach(([categorie, data]) => {
            if (data.count > maxCount) {
                maxCount = data.count;
                categoriePlusFrequente = categorie;
            }
        });
        
        return {
            transactionsAujourdhui: transactionsAujourdhui.length,
            encaissementsAujourdhui,
            decaissementsAujourdhui,
            soldeAujourdhui: encaissementsAujourdhui - decaissementsAujourdhui,
            parMode,
            categoriePlusFrequente
        };
    }, [transactions]);

    // Filtrer les transactions
    const transactionsFiltrees = useMemo(() => {
        return transactions.filter(transaction => {
            const matchesSearch = 
                transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (transaction.client && transaction.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (transaction.reference && transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesType = filterType === 'tous' || transaction.type === filterType;
            
            let matchesDate = true;
            if (dateDebut && dateFin) {
                const transactionDate = transaction.date.split(' ')[0];
                matchesDate = transactionDate >= dateDebut && transactionDate <= dateFin;
            } else if (filterDate !== 'tous') {
                const aujourdHui = new Date().toISOString().split('T')[0];
                const hier = new Date();
                hier.setDate(hier.getDate() - 1);
                const hierStr = hier.toISOString().split('T')[0];
                
                const transactionDate = transaction.date.split(' ')[0];
                
                switch(filterDate) {
                    case 'aujourdhui':
                        matchesDate = transactionDate === aujourdHui;
                        break;
                    case 'hier':
                        matchesDate = transactionDate === hierStr;
                        break;
                    case 'semaine':
                        const semaineAgo = new Date();
                        semaineAgo.setDate(semaineAgo.getDate() - 7);
                        const semaineStr = semaineAgo.toISOString().split('T')[0];
                        matchesDate = transactionDate >= semaineStr;
                        break;
                    case 'mois':
                        const moisAgo = new Date();
                        moisAgo.setMonth(moisAgo.getMonth() - 1);
                        const moisStr = moisAgo.toISOString().split('T')[0];
                        matchesDate = transactionDate >= moisStr;
                        break;
                }
            }
            
            return matchesSearch && matchesType && matchesDate;
        });
    }, [transactions, searchTerm, filterType, filterDate, dateDebut, dateFin]);

    // Formater la date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Obtenir le libellé de la catégorie
    const getCategorieLabel = (categorie, type) => {
        const categoriesList = type === 'encaissement' ? categories.encaissement : categories.decaissement;
        const cat = categoriesList.find(c => c.value === categorie);
        return cat ? cat.label : categorie;
    };

    // Obtenir la couleur de la catégorie
    const getCategorieColor = (categorie, type) => {
        const categoriesList = type === 'encaissement' ? categories.encaissement : categories.decaissement;
        const cat = categoriesList.find(c => c.value === categorie);
        return cat ? cat.color : 'bg-gray-100 text-gray-800';
    };

    // Obtenir l'icône du mode de paiement
    const getModeIcon = (mode) => {
        switch(mode) {
            case 'especes': return <Banknote className="w-4 h-4" />;
            case 'mobile_money': return <Smartphone className="w-4 h-4" />;
            case 'carte': return <CreditCard className="w-4 h-4" />;
            case 'virement': return <Building className="w-4 h-4" />;
            default: return <Wallet className="w-4 h-4" />;
        }
    };

    // Obtenir le libellé du mode de paiement
    const getModeLabel = (mode) => {
        switch(mode) {
            case 'especes': return 'Espèces';
            case 'mobile_money': return 'Mobile Money';
            case 'carte': return 'Carte bancaire';
            case 'virement': return 'Virement bancaire';
            default: return mode;
        }
    };

    // Ajouter une nouvelle transaction
    const ajouterTransaction = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!newTransaction.montant || !newTransaction.description) {
            alert('Veuillez remplir tous les champs obligatoires');
            setLoading(false);
            return;
        }

        // Générer un ID
        const trxId = `TRX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
        
        // Calculer le nouveau solde
        const montant = parseFloat(newTransaction.montant);
        const nouveauSolde = newTransaction.type === 'encaissement' 
            ? caisse.soldeActuel + montant
            : caisse.soldeActuel - montant;

        const nouvelleTransaction = {
            id: trxId,
            type: newTransaction.type,
            categorie: newTransaction.categorie,
            montant: montant,
            description: newTransaction.description,
            mode: newTransaction.mode,
            reference: newTransaction.reference || trxId,
            date: `${newTransaction.date} ${newTransaction.heure}`,
            client: newTransaction.client,
            responsable: newTransaction.responsable,
            statut: newTransaction.statut,
            soldeApres: nouveauSolde
        };

        // Simuler l'API
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Ajouter à la liste
        setTransactions(prev => [nouvelleTransaction, ...prev]);
        
        // Mettre à jour la caisse
        setCaisse(prev => ({
            ...prev,
            soldeActuel: nouveauSolde,
            totalEncaissements: newTransaction.type === 'encaissement' 
                ? prev.totalEncaissements + montant
                : prev.totalEncaissements,
            totalDecaissements: newTransaction.type === 'decaissement' 
                ? prev.totalDecaissements + montant
                : prev.totalDecaissements
        }));

        // Réinitialiser le formulaire
        setNewTransaction({
            type: 'encaissement',
            categorie: 'vente',
            montant: '',
            description: '',
            mode: 'especes',
            reference: '',
            date: new Date().toISOString().split('T')[0],
            heure: new Date().toTimeString().slice(0, 5),
            client: '',
            responsable: 'Admin',
            statut: 'complete'
        });
        
        setShowNewTransaction(false);
        setLoading(false);
    };

    // Ouvrir/Fermer la caisse
    const toggleCaisse = () => {
        if (caisse.ouverte) {
            if (window.confirm('Fermer la caisse ? Un rapport de clôture sera généré.')) {
                setCaisse(prev => ({
                    ...prev,
                    ouverte: false,
                    derniereFermeture: new Date().toISOString().replace('T', ' ').substring(0, 16)
                }));
            }
        } else {
            const soldeInitial = parseFloat(prompt('Solde d\'ouverture (FCFA):', '0')) || 0;
            setCaisse(prev => ({
                ...prev,
                soldeInitial,
                soldeActuel: soldeInitial,
                totalEncaissements: 0,
                totalDecaissements: 0,
                ouverte: true,
                dateOuverture: new Date().toISOString().split('T')[0],
                heureOuverture: new Date().toTimeString().slice(0, 5),
                responsableOuverture: 'Admin'
            }));
        }
    };

    // Exporter les données
    const exporterDonnees = () => {
        const dataStr = JSON.stringify(transactionsFiltrees, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `caisse_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    // Imprimer le rapport
    const imprimerRapport = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Gestion de Caisse</h1>
                                <p className="text-sm text-gray-600">Suivi des encaissements et décaissements</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowBalance(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Bilan
                            </button>
                            <button
                                onClick={() => setShowNewTransaction(true)}
                                disabled={!caisse.ouverte}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Nouvelle Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statut de la caisse */}
            <div className="container mx-auto px-4 py-3">
                <div className={`rounded-lg p-4 flex items-center justify-between ${
                    caisse.ouverte 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                    <div className="flex items-center gap-3">
                        {caisse.ouverte ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                            <Lock className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                            <p className="font-medium">
                                Caisse {caisse.ouverte ? 'Ouverte' : 'Fermée'}
                            </p>
                            <p className="text-sm">
                                {caisse.ouverte 
                                    ? `Ouverte à ${caisse.heureOuverture} par ${caisse.responsableOuverture}`
                                    : `Fermée le ${caisse.derniereFermeture}`
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleCaisse}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            caisse.ouverte 
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                        {caisse.ouverte ? 'Fermer la Caisse' : 'Ouvrir la Caisse'}
                    </button>
                </div>
            </div>

            {/* Statistiques */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Solde Actuel</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {caisse.soldeActuel.toLocaleString()} F
                                </p>
                                <p className="text-xs text-gray-500">
                                    Solde initial: {caisse.soldeInitial.toLocaleString()} F
                                </p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Wallet className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Encaissements</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {caisse.totalEncaissements.toLocaleString()} F
                                </p>
                                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{stats.encaissementsAujourdhui.toLocaleString()} F aujourd'hui</span>
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
                                <p className="text-sm text-gray-600">Total Décaissements</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {caisse.totalDecaissements.toLocaleString()} F
                                </p>
                                <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                                    <TrendingDown className="w-3 h-3" />
                                    <span>{stats.decaissementsAujourdhui.toLocaleString()} F aujourd'hui</span>
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
                                <p className="text-sm text-gray-600">Transactions Aujourd'hui</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.transactionsAujourdhui}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Balance: {(stats.encaissementsAujourdhui - stats.decaissementsAujourdhui).toLocaleString()} F
                                </p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Receipt className="w-6 h-6 text-purple-600" />
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
                                    placeholder="Rechercher par ID, description, client ou référence..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                                    <option value="encaissement">Encaissements</option>
                                    <option value="decaissement">Décaissements</option>
                                </select>
                            </div>
                            
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

                {/* Tableau des transactions */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">
                            Journal des Transactions ({transactionsFiltrees.length})
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={exporterDonnees}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Exporter
                            </button>
                            <button
                                onClick={imprimerRapport}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Imprimer
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Montant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Solde après
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transactionsFiltrees.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            Aucune transaction trouvée
                                        </td>
                                    </tr>
                                ) : (
                                    transactionsFiltrees.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(transaction.date)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategorieColor(transaction.categorie, transaction.type)}`}>
                                                        {transaction.type === 'encaissement' ? 'Entrée' : 'Sortie'}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded text-xs ${getCategorieColor(transaction.categorie, transaction.type)}`}>
                                                        {getCategorieLabel(transaction.categorie, transaction.type)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {transaction.description}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {transaction.client && `Client: ${transaction.client}`}
                                                        {transaction.fournisseur && `Fournisseur: ${transaction.fournisseur}`}
                                                        {transaction.reference && ` • Ref: ${transaction.reference}`}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`font-bold ${transaction.type === 'encaissement' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.type === 'encaissement' ? '+' : '-'} {transaction.montant.toLocaleString()} F
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getModeIcon(transaction.mode)}
                                                    <span className="text-sm text-gray-600">
                                                        {getModeLabel(transaction.mode)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-blue-600">
                                                    {transaction.soldeApres.toLocaleString()} F
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTransaction(transaction);
                                                            setShowDetails(true);
                                                        }}
                                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        title="Voir détails"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => window.print()}
                                                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                                                        title="Imprimer"
                                                    >
                                                        <Printer className="w-4 h-4" />
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
                    {transactionsFiltrees.length > 0 && (
                        <div className="px-6 py-4 border-t flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Affichage de {transactionsFiltrees.length} transactions
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

            {/* Modal Nouvelle Transaction */}
            {showNewTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Nouvelle Transaction</h2>
                                    <p className="text-gray-600">Enregistrer un encaissement ou décaissement</p>
                                </div>
                                <button 
                                    onClick={() => setShowNewTransaction(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <form onSubmit={ajouterTransaction}>
                                <div className="space-y-6">
                                    {/* Type de transaction */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type de transaction
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setNewTransaction({...newTransaction, type: 'encaissement'})}
                                                className={`py-3 rounded-lg flex flex-col items-center justify-center gap-2 border ${
                                                    newTransaction.type === 'encaissement' 
                                                    ? 'bg-green-100 text-green-700 border-green-500' 
                                                    : 'bg-gray-100 text-gray-700 border-gray-300'
                                                }`}
                                            >
                                                <ArrowUpRight className="w-5 h-5" />
                                                <span>Encaissement</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewTransaction({...newTransaction, type: 'decaissement'})}
                                                className={`py-3 rounded-lg flex flex-col items-center justify-center gap-2 border ${
                                                    newTransaction.type === 'decaissement' 
                                                    ? 'bg-red-100 text-red-700 border-red-500' 
                                                    : 'bg-gray-100 text-gray-700 border-gray-300'
                                                }`}
                                            >
                                                <ArrowDownRight className="w-5 h-5" />
                                                <span>Décaissement</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Catégorie */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Catégorie *
                                        </label>
                                        <select
                                            value={newTransaction.categorie}
                                            onChange={(e) => setNewTransaction({...newTransaction, categorie: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            required
                                        >
                                            {newTransaction.type === 'encaissement' ? (
                                                <>
                                                    <option value="vente">Vente</option>
                                                    <option value="acompte">Acompte</option>
                                                    <option value="remboursement">Remboursement</option>
                                                    <option value="divers">Divers</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="achat">Achat stock</option>
                                                    <option value="frais">Frais opérationnels</option>
                                                    <option value="salaires">Salaires</option>
                                                    <option value="loyer">Loyer</option>
                                                    <option value="publicite">Publicité</option>
                                                    <option value="divers">Divers</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Montant */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Montant (FCFA) *
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    value={newTransaction.montant}
                                                    onChange={(e) => setNewTransaction({...newTransaction, montant: e.target.value})}
                                                    placeholder="0"
                                                    min="1"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Mode de paiement */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mode de paiement
                                            </label>
                                            <select
                                                value={newTransaction.mode}
                                                onChange={(e) => setNewTransaction({...newTransaction, mode: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            >
                                                <option value="especes">Espèces</option>
                                                <option value="mobile_money">Mobile Money</option>
                                                <option value="carte">Carte bancaire</option>
                                                <option value="virement">Virement bancaire</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            value={newTransaction.description}
                                            onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                                            placeholder="Description détaillée de la transaction..."
                                            rows="2"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    
                                    {/* Client/Fournisseur */}
                                    {newTransaction.type === 'encaissement' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Client (optionnel)
                                            </label>
                                            <input
                                                type="text"
                                                value={newTransaction.client}
                                                onChange={(e) => setNewTransaction({...newTransaction, client: e.target.value})}
                                                placeholder="Nom du client"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Bénéficiaire (optionnel)
                                            </label>
                                            <input
                                                type="text"
                                                value={newTransaction.client}
                                                onChange={(e) => setNewTransaction({...newTransaction, client: e.target.value})}
                                                placeholder="Nom du bénéficiaire"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Référence */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Référence (optionnel)
                                            </label>
                                            <input
                                                type="text"
                                                value={newTransaction.reference}
                                                onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                                                placeholder="Numéro de facture, vente, etc."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        
                                        {/* Date et heure */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date et heure
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="date"
                                                    value={newTransaction.date}
                                                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                />
                                                <input
                                                    type="time"
                                                    value={newTransaction.heure}
                                                    onChange={(e) => setNewTransaction({...newTransaction, heure: e.target.value})}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Récapitulatif */}
                                    <div className="p-4 bg-gray-50 rounded-lg border">
                                        <h3 className="font-medium text-gray-900 mb-2">Récapitulatif</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Type:</span>
                                                <span className={`font-medium ${newTransaction.type === 'encaissement' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {newTransaction.type === 'encaissement' ? 'Encaissement' : 'Décaissement'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Montant:</span>
                                                <span className={`font-bold ${newTransaction.type === 'encaissement' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {newTransaction.montant || 0} FCFA
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Nouveau solde:</span>
                                                <span className="font-bold text-blue-600">
                                                    {newTransaction.type === 'encaissement'
                                                        ? (caisse.soldeActuel + (parseFloat(newTransaction.montant) || 0)).toLocaleString()
                                                        : (caisse.soldeActuel - (parseFloat(newTransaction.montant) || 0)).toLocaleString()
                                                    } FCFA
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" />
                                                Enregistrer la Transaction
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewTransaction(false)}
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

            {/* Modal Détails Transaction */}
            {showDetails && selectedTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${
                                        selectedTransaction.type === 'encaissement' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedTransaction.type === 'encaissement' 
                                            ? <ArrowUpRight className="w-5 h-5" /> 
                                            : <ArrowDownRight className="w-5 h-5" />
                                        }
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedTransaction.id}</h2>
                                        <p className="text-gray-600">
                                            {selectedTransaction.type === 'encaissement' ? 'Encaissement' : 'Décaissement'} • 
                                            <span className={`ml-2 ${getCategorieColor(selectedTransaction.categorie, selectedTransaction.type)} px-2 py-1 rounded text-xs`}>
                                                {getCategorieLabel(selectedTransaction.categorie, selectedTransaction.type)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Informations transaction */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Informations</h3>
                                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Date:</span>
                                                    <span className="font-medium">{formatDate(selectedTransaction.date)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Statut:</span>
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                                        Complète
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Responsable:</span>
                                                    <span className="font-medium">{selectedTransaction.responsable}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Mode de paiement */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Mode de paiement</h3>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3">
                                                    {getModeIcon(selectedTransaction.mode)}
                                                    <div>
                                                        <div className="font-medium">{getModeLabel(selectedTransaction.mode)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Montant et solde */}
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Montant</h3>
                                            <div className={`p-4 rounded-lg text-center ${
                                                selectedTransaction.type === 'encaissement' 
                                                ? 'bg-green-50 border border-green-200' 
                                                : 'bg-red-50 border border-red-200'
                                            }`}>
                                                <div className={`text-3xl font-bold mb-1 ${
                                                    selectedTransaction.type === 'encaissement' 
                                                    ? 'text-green-600' 
                                                    : 'text-red-600'
                                                }`}>
                                                    {selectedTransaction.type === 'encaissement' ? '+' : '-'} {selectedTransaction.montant.toLocaleString()} F
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {selectedTransaction.type === 'encaissement' ? 'Entrée en caisse' : 'Sortie de caisse'}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Solde après */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Solde après transaction</h3>
                                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                                    {selectedTransaction.soldeApres.toLocaleString()} F
                                                </div>
                                                <div className="text-sm text-blue-700">
                                                    Nouveau solde de caisse
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700">{selectedTransaction.description}</p>
                                    </div>
                                </div>
                                
                                {/* Client/Bénéficiaire */}
                                {(selectedTransaction.client || selectedTransaction.fournisseur) && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            {selectedTransaction.type === 'encaissement' ? 'Client' : 'Bénéficiaire'}
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="font-medium">
                                                {selectedTransaction.client || selectedTransaction.fournisseur}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Référence */}
                                {selectedTransaction.reference && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Référence</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="font-medium">{selectedTransaction.reference}</div>
                                        </div>
                                    </div>
                                )}
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
                                onClick={() => setShowDetails(false)}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Bilan Financier */}
            {showBalance && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Bilan Financier</h2>
                                    <p className="text-gray-600">Rapport de trésorerie</p>
                                </div>
                                <button 
                                    onClick={() => setShowBalance(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Résumé */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {caisse.soldeInitial.toLocaleString()} F
                                        </div>
                                        <div className="text-sm text-blue-700">Solde initial</div>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {caisse.totalEncaissements.toLocaleString()} F
                                        </div>
                                        <div className="text-sm text-green-700">Total encaissements</div>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-red-600">
                                            {caisse.totalDecaissements.toLocaleString()} F
                                        </div>
                                        <div className="text-sm text-red-700">Total décaissements</div>
                                    </div>
                                </div>
                                
                                {/* Solde actuel */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-center text-white">
                                    <div className="text-4xl font-bold mb-2">
                                        {caisse.soldeActuel.toLocaleString()} F
                                    </div>
                                    <div className="text-lg">Solde actuel de caisse</div>
                                    <div className="text-sm opacity-90 mt-2">
                                        {caisse.ouverte ? 'Caisse ouverte' : 'Caisse fermée'} • {new Date().toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                                
                                {/* Détails par catégorie */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-4">Encaissements par catégorie</h3>
                                        <div className="space-y-3">
                                            {categories.encaissement.map((cat) => {
                                                const total = transactions
                                                    .filter(t => t.type === 'encaissement' && t.categorie === cat.value)
                                                    .reduce((sum, t) => sum + t.montant, 0);
                                                const percentage = caisse.totalEncaissements > 0 
                                                    ? Math.round((total / caisse.totalEncaissements) * 100)
                                                    : 0;
                                                    
                                                return (
                                                    <div key={cat.value} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-full ${cat.color.split(' ')[0]}`}></div>
                                                            <span className="text-sm">{cat.label}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium">{total.toLocaleString()} F</div>
                                                            <div className="text-xs text-gray-500">{percentage}%</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-4">Décaissements par catégorie</h3>
                                        <div className="space-y-3">
                                            {categories.decaissement.map((cat) => {
                                                const total = transactions
                                                    .filter(t => t.type === 'decaissement' && t.categorie === cat.value)
                                                    .reduce((sum, t) => sum + t.montant, 0);
                                                const percentage = caisse.totalDecaissements > 0 
                                                    ? Math.round((total / caisse.totalDecaissements) * 100)
                                                    : 0;
                                                    
                                                return (
                                                    <div key={cat.value} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-full ${cat.color.split(' ')[0]}`}></div>
                                                            <span className="text-sm">{cat.label}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium">{total.toLocaleString()} F</div>
                                                            <div className="text-xs text-gray-500">{percentage}%</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Transactions récentes */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">Dernières transactions</h3>
                                    <div className="space-y-2">
                                        {transactions.slice(0, 5).map((trx) => (
                                            <div key={trx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium">{trx.description}</div>
                                                    <div className="text-xs text-gray-500">{formatDate(trx.date)}</div>
                                                </div>
                                                <div className={`font-bold ${trx.type === 'encaissement' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {trx.type === 'encaissement' ? '+' : '-'} {trx.montant.toLocaleString()} F
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t flex gap-3">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Printer className="w-5 h-5" />
                                Imprimer le Bilan
                            </button>
                            <button
                                onClick={() => setShowBalance(false)}
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
                        <p>© 2024 Gestion de Caisse - Système de Trésorerie</p>
                        <p className="mt-1">
                            Statut: <span className={caisse.ouverte ? 'text-green-600' : 'text-red-600'}>
                                {caisse.ouverte ? 'CAISSE OUVERTE' : 'CAISSE FERMÉE'}
                            </span> | 
                            <span className="text-blue-600 ml-2">
                                Solde: {caisse.soldeActuel.toLocaleString()} F
                            </span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CashRegister;