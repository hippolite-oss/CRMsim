import React, { useState, useEffect, useMemo } from 'react';
import {
    Minus, Package, DollarSign, ShoppingCart, User, Calendar,
    CheckCircle, XCircle, AlertTriangle, Printer, Download, 
    RefreshCw, Search, Filter, ChevronDown, ChevronUp, 
    Plus, Trash2, Edit, Eye, Copy, ExternalLink,
    BarChart3, TrendingDown, Receipt, Truck, ShoppingBag,
    CreditCard, Smartphone, Wallet, Clock, ArrowRight,
    ChevronRight
} from 'lucide-react';

const StockOut = () => {
    // États principaux
    const [mode, setMode] = useState('vente'); // 'vente', 'retrait', 'transfert'
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showBasket, setShowBasket] = useState(true);
    const [searchClient, setSearchClient] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [currentStep, setCurrentStep] = useState(1); // 1: Produits, 2: Client, 3: Paiement
    const [paymentMethod, setPaymentMethod] = useState('especes');
    const [paymentStatus, setPaymentStatus] = useState('complete');
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    // États pour les formulaires
    const [saleData, setSaleData] = useState({
        clientId: '',
        produits: [],
        remise: 0,
        transport: 0,
        commentaire: '',
        vendeur: 'Admin'
    });

    const [withdrawalData, setWithdrawalData] = useState({
        motif: '',
        responsable: '',
        departement: '',
        produits: [],
        commentaire: ''
    });

    const [transferData, setTransferData] = useState({
        destination: '',
        motif: '',
        produits: [],
        transporteur: '',
        dateTransfert: new Date().toISOString().split('T')[0],
        commentaire: ''
    });

    // Données mockées
    const clientsMock = [
        { id: 'CLI-001', nom: 'Dupont', prenom: 'Jean', telephone: '+229 12 34 56 78', email: 'jean.dupont@email.com', type: 'particulier' },
        { id: 'CLI-002', nom: 'Martin', prenom: 'Marie', telephone: '+229 23 45 67 89', email: 'marie.martin@email.com', type: 'particulier' },
        { id: 'CLI-003', nom: 'Bernard', prenom: 'Pierre', telephone: '+229 34 56 78 90', email: 'pierre.bernard@email.com', type: 'particulier' },
        { id: 'CLI-004', nom: 'TechImport SARL', prenom: '', telephone: '+229 45 67 89 01', email: 'contact@techimport.bj', type: 'entreprise' },
        { id: 'CLI-005', nom: 'Leclerc', prenom: 'Sophie', telephone: '+229 56 78 90 12', email: 'sophie.leclerc@email.com', type: 'particulier' },
        { id: 'CLI-006', nom: 'Moreau', prenom: 'Thomas', telephone: '+229 67 89 01 23', email: 'thomas.moreau@email.com', type: 'particulier' }
    ];

    const produitsStock = [
        { 
            id: 'PROD-001', 
            nom: 'Ordinateur Portable HP EliteBook', 
            reference: 'HP-ELITE-X360',
            categorie: 'Informatique',
            stockActuel: 15,
            prixVente: 899900,
            prixAchat: 600000,
            marge: 299900
        },
        { 
            id: 'PROD-002', 
            nom: 'Smartphone Samsung Galaxy S23', 
            reference: 'SAMSUNG-GS23',
            categorie: 'Téléphonie',
            stockActuel: 3,
            prixVente: 699900,
            prixAchat: 450000,
            marge: 249900
        },
        { 
            id: 'PROD-003', 
            nom: 'Écouteurs Bluetooth Sony WH-1000XM4', 
            reference: 'SONY-WH1000XM4',
            categorie: 'Audio',
            stockActuel: 0,
            prixVente: 199900,
            prixAchat: 120000,
            marge: 79900
        },
        { 
            id: 'PROD-004', 
            nom: 'Tablette Apple iPad Air', 
            reference: 'APPLE-IPADAIR',
            categorie: 'Tablettes',
            stockActuel: 12,
            prixVente: 849900,
            prixAchat: 550000,
            marge: 299900
        },
        { 
            id: 'PROD-005', 
            nom: 'Souris Gaming Logitech G Pro', 
            reference: 'LOGITECH-GPRO',
            categorie: 'Périphériques',
            stockActuel: 45,
            prixVente: 69900,
            prixAchat: 35000,
            marge: 34900
        },
        { 
            id: 'PROD-006', 
            nom: 'Enceinte Portable JBL Charge 5', 
            reference: 'JBL-CHARGE5',
            categorie: 'Audio',
            stockActuel: 7,
            prixVente: 129900,
            prixAchat: 80000,
            marge: 49900
        },
        { 
            id: 'PROD-007', 
            nom: 'Câble USB-C 2m', 
            reference: 'CABLE-USBC-2M',
            categorie: 'Accessoires',
            stockActuel: 120,
            prixVente: 5000,
            prixAchat: 2500,
            marge: 2500
        },
        { 
            id: 'PROD-008', 
            nom: 'Montre Connectée Huawei Watch GT3', 
            reference: 'HUAWEI-WATCHGT3',
            categorie: 'Montres',
            stockActuel: 2,
            prixVente: 179900,
            prixAchat: 120000,
            marge: 59900
        }
    ];

    const historiqueMock = [
        { id: 'VENT-2024-00123', date: '2024-01-20 14:30', type: 'vente', client: 'Jean Dupont', total: 914900, statut: 'complete', vendeur: 'Admin' },
        { id: 'RET-2024-00012', date: '2024-01-19 11:15', type: 'retrait', motif: 'Échantillon démo', total: 349900, statut: 'complete', responsable: 'Admin' },
        { id: 'TRANS-2024-00005', date: '2024-01-18 16:45', type: 'transfert', destination: 'Succursale Cotonou', total: 269700, statut: 'en_cours', transporteur: 'Transport Express' },
        { id: 'VENT-2024-00122', date: '2024-01-18 10:20', type: 'vente', client: 'Marie Martin', total: 439800, statut: 'complete', vendeur: 'Vendeur1' },
        { id: 'RET-2024-00011', date: '2024-01-17 15:30', type: 'retrait', motif: 'Produit défectueux', total: 199900, statut: 'complete', responsable: 'Admin' }
    ];

    // Calculer le total du panier
    const basketTotal = useMemo(() => {
        return selectedProducts.reduce((total, item) => {
            return total + (item.prixVente * item.quantite);
        }, 0);
    }, [selectedProducts]);

    // Calculer la marge totale
    const basketMargin = useMemo(() => {
        return selectedProducts.reduce((total, item) => {
            return total + (item.marge * item.quantite);
        }, 0);
    }, [selectedProducts]);

    // Filtrer les produits disponibles
    const availableProducts = useMemo(() => {
        return produitsStock.filter(produit => 
            produit.nom.toLowerCase().includes(searchProduct.toLowerCase()) ||
            produit.reference.toLowerCase().includes(searchProduct.toLowerCase())
        );
    }, [searchProduct]);

    // Ajouter un produit au panier
    const addToBasket = (produit) => {
        // Vérifier si le produit est déjà dans le panier
        const existingIndex = selectedProducts.findIndex(item => item.id === produit.id);
        
        if (existingIndex >= 0) {
            // Augmenter la quantité
            const updatedProducts = [...selectedProducts];
            if (updatedProducts[existingIndex].quantite < produit.stockActuel) {
                updatedProducts[existingIndex].quantite += 1;
                setSelectedProducts(updatedProducts);
            } else {
                alert(`Stock insuffisant pour ${produit.nom}. Stock disponible: ${produit.stockActuel}`);
            }
        } else {
            // Ajouter le produit avec quantité 1
            if (produit.stockActuel > 0) {
                setSelectedProducts([
                    ...selectedProducts,
                    {
                        ...produit,
                        quantite: 1
                    }
                ]);
            } else {
                alert(`${produit.nom} est en rupture de stock`);
            }
        }
    };

    // Modifier la quantité d'un produit
    const updateQuantity = (produitId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromBasket(produitId);
            return;
        }

        // Trouver le produit dans le stock pour vérifier la quantité disponible
        const produitStock = produitsStock.find(p => p.id === produitId);
        
        if (newQuantity > produitStock.stockActuel) {
            alert(`Quantité non disponible. Stock maximum: ${produitStock.stockActuel}`);
            return;
        }

        setSelectedProducts(prev => 
            prev.map(item => 
                item.id === produitId ? { ...item, quantite: newQuantity } : item
            )
        );
    };

    // Retirer un produit du panier
    const removeFromBasket = (produitId) => {
        setSelectedProducts(prev => prev.filter(item => item.id !== produitId));
    };

    // Vider le panier
    const clearBasket = () => {
        if (selectedProducts.length > 0 && window.confirm('Vider tout le panier ?')) {
            setSelectedProducts([]);
        }
    };

    // Passer à l'étape suivante
    const nextStep = () => {
        if (currentStep === 1 && selectedProducts.length === 0) {
            alert('Veuillez ajouter au moins un produit');
            return;
        }
        
        if (currentStep === 2 && mode === 'vente' && !selectedClient) {
            alert('Veuillez sélectionner un client');
            return;
        }
        
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Revenir à l'étape précédente
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Finaliser la sortie
    const finalizeOut = async () => {
        setLoading(true);

        // Générer une référence
        const refPrefix = mode === 'vente' ? 'VENT' : mode === 'retrait' ? 'RET' : 'TRANS';
        const reference = `${refPrefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

        // Préparer les données
        const outData = {
            id: reference,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            type: mode,
            produits: selectedProducts,
            total: basketTotal,
            margeTotale: basketMargin,
            statut: paymentStatus
        };

        // Ajouter les données spécifiques au mode
        if (mode === 'vente') {
            outData.client = selectedClient;
            outData.paiement = paymentMethod;
            outData.remise = saleData.remise || 0;
            outData.transport = saleData.transport || 0;
            outData.vendeur = saleData.vendeur;
            outData.totalFinal = basketTotal - (saleData.remise || 0) + (saleData.transport || 0);
        } else if (mode === 'retrait') {
            outData.motif = withdrawalData.motif;
            outData.responsable = withdrawalData.responsable;
            outData.departement = withdrawalData.departement;
        } else if (mode === 'transfert') {
            outData.destination = transferData.destination;
            outData.motif = transferData.motif;
            outData.transporteur = transferData.transporteur;
        }

        // Simulation d'enregistrement
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mettre à jour le reçu
        setReceiptData(outData);
        setShowReceipt(true);
        
        // Réinitialiser
        setSelectedProducts([]);
        setSelectedClient(null);
        setCurrentStep(1);
        setPaymentMethod('especes');
        setPaymentStatus('complete');
        
        setSuccess(true);
        setLoading(false);
        
        // Cacher le message de succès
        setTimeout(() => setSuccess(false), 5000);
    };

    // Annuler la sortie
    const cancelOut = () => {
        if (window.confirm('Annuler cette sortie ? Toutes les données seront perdues.')) {
            setSelectedProducts([]);
            setSelectedClient(null);
            setCurrentStep(1);
            setSaleData({
                clientId: '',
                produits: [],
                remise: 0,
                transport: 0,
                commentaire: '',
                vendeur: 'Admin'
            });
            setWithdrawalData({
                motif: '',
                responsable: '',
                departement: '',
                produits: [],
                commentaire: ''
            });
            setTransferData({
                destination: '',
                motif: '',
                produits: [],
                transporteur: '',
                dateTransfert: new Date().toISOString().split('T')[0],
                commentaire: ''
            });
        }
    };

    // Imprimer le reçu
    const printReceipt = () => {
        window.print();
    };

    // Obtenir la couleur du statut
    const getStatusColor = (status) => {
        switch(status) {
            case 'complete': return 'bg-green-100 text-green-800';
            case 'en_cours': return 'bg-yellow-100 text-yellow-800';
            case 'annule': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Obtenir l'icône du mode
    const getModeIcon = (mode) => {
        switch(mode) {
            case 'vente': return <ShoppingCart className="w-4 h-4" />;
            case 'retrait': return <Minus className="w-4 h-4" />;
            case 'transfert': return <Truck className="w-4 h-4" />;
            default: return null;
        }
    };

    // Obtenir le libellé du mode
    const getModeLabel = (mode) => {
        switch(mode) {
            case 'vente': return 'Vente';
            case 'retrait': return 'Retrait';
            case 'transfert': return 'Transfert';
            default: return mode;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg">
                                <Minus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Sortie de Stock</h1>
                                <p className="text-sm text-gray-600">Ventes, retraits et transferts de produits</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                Historique
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Imprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message de succès */}
            {success && (
                <div className="container mx-auto px-4 py-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                            <p className="font-medium text-green-800">Sortie enregistrée !</p>
                            <p className="text-sm text-green-700">
                                La sortie a été enregistrée avec succès. Reçu disponible.
                            </p>
                        </div>
                        <button
                            onClick={() => setSuccess(false)}
                            className="text-green-600 hover:text-green-800"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-6">
                {/* Indicateur d'étapes */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                                        currentStep >= step 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {step}
                                    </div>
                                    <span className={`font-medium ${
                                        currentStep >= step 
                                            ? 'text-blue-600' 
                                            : 'text-gray-500'
                                    }`}>
                                        {step === 1 ? 'Produits' : step === 2 ? (mode === 'vente' ? 'Client' : 'Détails') : 'Validation'}
                                    </span>
                                    {step < 3 && (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 rounded-lg"
                            >
                                Retour
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={currentStep === 3}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
                            >
                                {currentStep === 3 ? 'Terminer' : 'Suivant'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne gauche: Produits disponibles */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-4 border-b flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h2 className="font-semibold text-gray-900">
                                        {currentStep === 1 ? 'Sélection des Produits' : 
                                         currentStep === 2 ? (mode === 'vente' ? 'Sélection du Client' : 'Détails de la Sortie') : 
                                         'Récapitulatif'}
                                    </h2>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                        {selectedProducts.length} produit{selectedProducts.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                
                                {/* Sélecteur de mode */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Type:</span>
                                    <select
                                        value={mode}
                                        onChange={(e) => {
                                            setMode(e.target.value);
                                            setCurrentStep(1);
                                        }}
                                        className="px-3 py-1 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm"
                                    >
                                        <option value="vente">Vente</option>
                                        <option value="retrait">Retrait</option>
                                        <option value="transfert">Transfert</option>
                                    </select>
                                </div>
                            </div>

                            {/* Étape 1: Sélection des produits */}
                            {currentStep === 1 && (
                                <div className="p-4">
                                    {/* Barre de recherche */}
                                    <div className="mb-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchProduct}
                                                onChange={(e) => setSearchProduct(e.target.value)}
                                                placeholder="Rechercher un produit par nom ou référence..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Liste des produits */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {availableProducts.map((produit) => (
                                            <div 
                                                key={produit.id} 
                                                className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900">{produit.nom}</div>
                                                            <div className="text-xs text-gray-500">
                                                                Ref: {produit.reference} • Stock: {produit.stockActuel}
                                                            </div>
                                                            <div className="mt-1">
                                                                <span className="font-bold text-green-600">
                                                                    {produit.prixVente.toLocaleString()} F
                                                                </span>
                                                                <span className="text-xs text-gray-500 ml-2">
                                                                    Marge: {(produit.marge).toLocaleString()} F
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => addToBasket(produit)}
                                                        disabled={produit.stockActuel === 0}
                                                        className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
                                                        title="Ajouter au panier"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                
                                                {produit.stockActuel <= 5 && produit.stockActuel > 0 && (
                                                    <div className="mt-2 text-xs text-yellow-600 flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Stock faible ({produit.stockActuel} unité{produit.stockActuel > 1 ? 's' : ''})
                                                    </div>
                                                )}
                                                
                                                {produit.stockActuel === 0 && (
                                                    <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                                                        <XCircle className="w-3 h-3" />
                                                        Rupture de stock
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Étape 2: Client ou Détails */}
                            {currentStep === 2 && (
                                <div className="p-6">
                                    {mode === 'vente' ? (
                                        // Sélection client pour vente
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="font-medium text-gray-900 mb-4">Sélectionnez un client</h3>
                                                <div className="relative mb-4">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={searchClient}
                                                        onChange={(e) => setSearchClient(e.target.value)}
                                                        placeholder="Rechercher un client..."
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {clientsMock
                                                        .filter(client => 
                                                            `${client.prenom} ${client.nom}`.toLowerCase().includes(searchClient.toLowerCase()) ||
                                                            client.telephone.includes(searchClient) ||
                                                            client.email.toLowerCase().includes(searchClient.toLowerCase())
                                                        )
                                                        .map((client) => (
                                                            <div
                                                                key={client.id}
                                                                onClick={() => setSelectedClient(client)}
                                                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                                    selectedClient?.id === client.id
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'hover:border-gray-400'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                                        <User className="w-5 h-5 text-gray-600" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-gray-900">
                                                                            {client.prenom} {client.nom}
                                                                            {client.type === 'entreprise' && (
                                                                                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                                                    Entreprise
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">
                                                                            {client.telephone}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            {client.email}
                                                                        </div>
                                                                    </div>
                                                                    {selectedClient?.id === client.id && (
                                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                                
                                                <div className="mt-6">
                                                    <button
                                                        onClick={() => setSelectedClient({
                                                            id: 'CLI-000',
                                                            nom: 'Client',
                                                            prenom: 'Comptoir',
                                                            telephone: '',
                                                            email: '',
                                                            type: 'comptoir'
                                                        })}
                                                        className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm"
                                                    >
                                                        Client comptoir (sans enregistrement)
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {selectedClient && (
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {selectedClient.prenom} {selectedClient.nom}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {selectedClient.telephone || 'Non renseigné'}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedClient(null)}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : mode === 'retrait' ? (
                                        // Formulaire retrait
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Motif du retrait *
                                                </label>
                                                <select
                                                    value={withdrawalData.motif}
                                                    onChange={(e) => setWithdrawalData({...withdrawalData, motif: e.target.value})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                    required
                                                >
                                                    <option value="">Sélectionner un motif</option>
                                                    <option value="échantillon">Échantillon / Démo</option>
                                                    <option value="défectueux">Produit défectueux</option>
                                                    <option value="interne">Usage interne</option>
                                                    <option value="don">Don / Cadeau</option>
                                                    <option value="autre">Autre</option>
                                                </select>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Responsable *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={withdrawalData.responsable}
                                                        onChange={(e) => setWithdrawalData({...withdrawalData, responsable: e.target.value})}
                                                        placeholder="Nom du responsable"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Département
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={withdrawalData.departement}
                                                        onChange={(e) => setWithdrawalData({...withdrawalData, departement: e.target.value})}
                                                        placeholder="Département concerné"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Commentaire
                                                </label>
                                                <textarea
                                                    value={withdrawalData.commentaire}
                                                    onChange={(e) => setWithdrawalData({...withdrawalData, commentaire: e.target.value})}
                                                    placeholder="Informations complémentaires..."
                                                    rows="3"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        // Formulaire transfert
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Destination *
                                                </label>
                                                <select
                                                    value={transferData.destination}
                                                    onChange={(e) => setTransferData({...transferData, destination: e.target.value})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                    required
                                                >
                                                    <option value="">Sélectionner une destination</option>
                                                    <option value="Succursale Cotonou">Succursale Cotonou</option>
                                                    <option value="Succursale Porto-Novo">Succursale Porto-Novo</option>
                                                    <option value="Entrepôt principal">Entrepôt principal</option>
                                                    <option value="Point de vente">Point de vente</option>
                                                    <option value="autre">Autre</option>
                                                </select>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Motif *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={transferData.motif}
                                                        onChange={(e) => setTransferData({...transferData, motif: e.target.value})}
                                                        placeholder="Raison du transfert"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Transporteur
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={transferData.transporteur}
                                                        onChange={(e) => setTransferData({...transferData, transporteur: e.target.value})}
                                                        placeholder="Nom du transporteur"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date de transfert
                                                </label>
                                                <input
                                                    type="date"
                                                    value={transferData.dateTransfert}
                                                    onChange={(e) => setTransferData({...transferData, dateTransfert: e.target.value})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Commentaire
                                                </label>
                                                <textarea
                                                    value={transferData.commentaire}
                                                    onChange={(e) => setTransferData({...transferData, commentaire: e.target.value})}
                                                    placeholder="Instructions spéciales..."
                                                    rows="3"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Étape 3: Validation */}
                            {currentStep === 3 && (
                                <div className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-4">Récapitulatif</h3>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        {getModeIcon(mode)}
                                                        <span className="font-medium text-gray-900">
                                                            {getModeLabel(mode)} - {selectedProducts.length} produit{selectedProducts.length > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    <span className="text-2xl font-bold text-blue-600">
                                                        {basketTotal.toLocaleString()} F
                                                    </span>
                                                </div>
                                                
                                                {mode === 'vente' && selectedClient && (
                                                    <div className="mb-3 p-3 bg-white rounded border">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <User className="w-4 h-4 text-gray-500" />
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {selectedClient.prenom} {selectedClient.nom}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        {selectedClient.telephone || 'Client comptoir'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {mode === 'vente' && (
                                            <div>
                                                <h3 className="font-medium text-gray-900 mb-4">Paiement</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Mode de paiement
                                                        </label>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {[
                                                                { value: 'especes', label: 'Espèces', icon: <Wallet className="w-4 h-4" /> },
                                                                { value: 'mobile_money', label: 'Mobile Money', icon: <Smartphone className="w-4 h-4" /> },
                                                                { value: 'carte', label: 'Carte bancaire', icon: <CreditCard className="w-4 h-4" /> }
                                                            ].map((method) => (
                                                                <button
                                                                    key={method.value}
                                                                    type="button"
                                                                    onClick={() => setPaymentMethod(method.value)}
                                                                    className={`py-3 rounded-lg flex flex-col items-center justify-center gap-2 border ${
                                                                        paymentMethod === method.value 
                                                                        ? 'bg-blue-100 text-blue-700 border-blue-500' 
                                                                        : 'bg-gray-100 text-gray-700 border-gray-300'
                                                                    }`}
                                                                >
                                                                    {method.icon}
                                                                    <span>{method.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Statut du paiement
                                                        </label>
                                                        <div className="flex gap-2">
                                                            {[
                                                                { value: 'complete', label: 'Complet', color: 'green' },
                                                                { value: 'partiel', label: 'Partiel', color: 'yellow' },
                                                                { value: 'en_attente', label: 'En attente', color: 'blue' }
                                                            ].map((status) => (
                                                                <button
                                                                    key={status.value}
                                                                    type="button"
                                                                    onClick={() => setPaymentStatus(status.value)}
                                                                    className={`px-4 py-2 rounded-lg border ${
                                                                        paymentStatus === status.value 
                                                                        ? `bg-${status.color}-100 text-${status.color}-700 border-${status.color}-500` 
                                                                        : 'bg-gray-100 text-gray-700 border-gray-300'
                                                                    }`}
                                                                >
                                                                    {status.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-4">Commentaire (optionnel)</h3>
                                            <textarea
                                                value={mode === 'vente' ? saleData.commentaire : 
                                                       mode === 'retrait' ? withdrawalData.commentaire : 
                                                       transferData.commentaire}
                                                onChange={(e) => {
                                                    if (mode === 'vente') {
                                                        setSaleData({...saleData, commentaire: e.target.value});
                                                    } else if (mode === 'retrait') {
                                                        setWithdrawalData({...withdrawalData, commentaire: e.target.value});
                                                    } else {
                                                        setTransferData({...transferData, commentaire: e.target.value});
                                                    }
                                                }}
                                                placeholder="Ajouter un commentaire..."
                                                rows="3"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Colonne droite: Panier et actions */}
                    <div className="space-y-6">
                        {/* Panier */}
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-4 border-b flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                                    <h2 className="font-semibold text-gray-900">Panier</h2>
                                </div>
                                <button
                                    onClick={() => setShowBasket(!showBasket)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {showBasket ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {showBasket && (
                                <div className="p-4">
                                    {selectedProducts.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500">Votre panier est vide</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Ajoutez des produits depuis la liste
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            {/* Liste des produits */}
                                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                                {selectedProducts.map((produit) => (
                                                    <div key={produit.id} className="border rounded-lg p-3">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-900 text-sm">
                                                                    {produit.nom}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {produit.prixVente.toLocaleString()} F x {produit.quantite}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-bold text-gray-900">
                                                                    {(produit.prixVente * produit.quantite).toLocaleString()} F
                                                                </div>
                                                                <div className="text-xs text-green-600">
                                                                    Marge: {(produit.marge * produit.quantite).toLocaleString()} F
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between mt-2">
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => updateQuantity(produit.id, produit.quantite - 1)}
                                                                    className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded"
                                                                >
                                                                    <Minus className="w-3 h-3" />
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    value={produit.quantite}
                                                                    onChange={(e) => updateQuantity(produit.id, parseInt(e.target.value) || 1)}
                                                                    min="1"
                                                                    max={produit.stockActuel}
                                                                    className="w-12 text-center px-1 py-1 border rounded"
                                                                />
                                                                <button
                                                                    onClick={() => updateQuantity(produit.id, produit.quantite + 1)}
                                                                    disabled={produit.quantite >= produit.stockActuel}
                                                                    className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 rounded"
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFromBasket(produit.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Total */}
                                            <div className="mt-4 pt-4 border-t">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Sous-total:</span>
                                                        <span className="font-medium">{basketTotal.toLocaleString()} F</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Marge totale:</span>
                                                        <span className="font-bold text-green-600">{basketMargin.toLocaleString()} F</span>
                                                    </div>
                                                    <div className="pt-2 border-t">
                                                        <div className="flex justify-between text-lg font-bold">
                                                            <span>TOTAL:</span>
                                                            <span className="text-blue-600">{basketTotal.toLocaleString()} F</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Boutons panier */}
                                            <div className="mt-4 space-y-2">
                                                <button
                                                    onClick={clearBasket}
                                                    className="w-full py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                                                >
                                                    Vider le panier
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Actions rapides */}
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <h3 className="font-medium text-gray-900 mb-4">Actions rapides</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={finalizeOut}
                                    disabled={loading || selectedProducts.length === 0 || (currentStep === 2 && mode === 'vente' && !selectedClient)}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Traitement...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            Valider la sortie
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    onClick={cancelOut}
                                    className="w-full py-2 border border-gray-300 hover:bg-gray-50 rounded-lg"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>

                        {/* Statistiques */}
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <h3 className="font-medium text-gray-900 mb-4">Statistiques</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Produits:</span>
                                    <span className="font-medium">{selectedProducts.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total unités:</span>
                                    <span className="font-medium">
                                        {selectedProducts.reduce((sum, item) => sum + item.quantite, 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Marge moyenne:</span>
                                    <span className="font-medium text-green-600">
                                        {selectedProducts.length > 0 
                                            ? Math.round(basketMargin / selectedProducts.reduce((sum, item) => sum + item.quantite, 0)).toLocaleString() 
                                            : '0'} F
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Reçu */}
            {showReceipt && receiptData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" id="receipt">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Reçu de Sortie</h2>
                                    <p className="text-gray-600">{receiptData.id}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={printReceipt}
                                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                                        title="Imprimer"
                                    >
                                        <Printer className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => setShowReceipt(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {/* En-tête du reçu */}
                                <div className="text-center border-b pb-4">
                                    <h1 className="text-2xl font-bold">Gestion Stock Pro</h1>
                                    <p className="text-gray-600">123 Avenue du Commerce, Cotonou</p>
                                    <p className="text-gray-600">Tél: +229 21 30 40 50</p>
                                </div>
                                
                                {/* Informations */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-600">Date</div>
                                        <div className="font-medium">{receiptData.date}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Type</div>
                                        <div className="font-medium">{getModeLabel(receiptData.type)}</div>
                                    </div>
                                </div>
                                
                                {/* Client/Destination */}
                                {receiptData.client && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">Client</div>
                                        <div className="font-medium">
                                            {receiptData.client.prenom} {receiptData.client.nom}
                                        </div>
                                        {receiptData.client.telephone && (
                                            <div className="text-gray-600">{receiptData.client.telephone}</div>
                                        )}
                                    </div>
                                )}
                                
                                {receiptData.destination && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">Destination</div>
                                        <div className="font-medium">{receiptData.destination}</div>
                                    </div>
                                )}
                                
                                {/* Produits */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Produits sortis</h3>
                                    <table className="w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Produit</th>
                                                <th className="px-3 py-2 text-center text-sm font-medium text-gray-700">Qté</th>
                                                <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">Prix</th>
                                                <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {receiptData.produits.map((produit, index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="px-3 py-2">
                                                        <div className="text-sm">{produit.nom}</div>
                                                        <div className="text-xs text-gray-500">{produit.reference}</div>
                                                    </td>
                                                    <td className="px-3 py-2 text-center">{produit.quantite}</td>
                                                    <td className="px-3 py-2 text-right">{produit.prixVente.toLocaleString()} F</td>
                                                    <td className="px-3 py-2 text-right font-medium">
                                                        {(produit.prixVente * produit.quantite).toLocaleString()} F
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Totaux */}
                                <div className="flex justify-end">
                                    <div className="w-64 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Sous-total:</span>
                                            <span>{receiptData.total.toLocaleString()} F</span>
                                        </div>
                                        
                                        {receiptData.remise > 0 && (
                                            <div className="flex justify-between text-red-600">
                                                <span>Remise:</span>
                                                <span>- {receiptData.remise.toLocaleString()} F</span>
                                            </div>
                                        )}
                                        
                                        {receiptData.transport > 0 && (
                                            <div className="flex justify-between">
                                                <span>Transport:</span>
                                                <span>+ {receiptData.transport.toLocaleString()} F</span>
                                            </div>
                                        )}
                                        
                                        <div className="pt-2 border-t">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>TOTAL:</span>
                                                <span className="text-blue-600">
                                                    {(receiptData.totalFinal || receiptData.total).toLocaleString()} F
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Statut */}
                                <div className="text-center p-4 border-t">
                                    <div className={`inline-block px-4 py-2 rounded-full ${getStatusColor(receiptData.statut)}`}>
                                        {receiptData.statut === 'complete' ? 'SORTIE EFFECTUÉE' : 
                                         receiptData.statut === 'en_cours' ? 'EN COURS' : 'ANNULÉE'}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {new Date().toLocaleDateString('fr-FR')} • {new Date().toLocaleTimeString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t flex gap-3">
                            <button
                                onClick={() => setShowReceipt(false)}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                Fermer
                            </button>
                            <button
                                onClick={printReceipt}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Imprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Historique */}
            {showHistory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Historique des Sorties</h2>
                                    <p className="text-gray-600">Dernières sorties de stock</p>
                                </div>
                                <button 
                                    onClick={() => setShowHistory(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
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
                                                Client/Destination
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Vendeur/Responsable
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {historiqueMock.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-blue-600">{item.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{item.date}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                                            item.type === 'vente' ? 'bg-green-100 text-green-800' :
                                                            item.type === 'retrait' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {getModeIcon(item.type)}
                                                            {getModeLabel(item.type)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {item.client || item.destination || item.motif}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">
                                                        {item.total.toLocaleString()} F
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.statut)}`}>
                                                        {item.statut === 'complete' ? 'Complète' : 
                                                         item.statut === 'en_cours' ? 'En cours' : 'Annulée'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {item.vendeur || item.responsable || '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="mt-8 py-6 border-t bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-gray-600">
                        <p>© 2024 Gestion des Stocks - Module de Sortie</p>
                        <p className="mt-1">
                            Mode: {getModeLabel(mode)} | 
                            <span className="text-blue-600 ml-2">
                                Panier: {selectedProducts.length} produit{selectedProducts.length > 1 ? 's' : ''} • {basketTotal.toLocaleString()} F
                            </span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default StockOut;