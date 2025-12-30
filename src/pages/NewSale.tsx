// src/pages/NewSales.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Search, User, ShoppingCart, Trash2, DollarSign, CreditCard, Phone,
    AlertCircle, CheckCircle, Loader2, Printer, Package, AlertTriangle,
    UserPlus, X, Clock, TrendingUp, Truck, Building2, MapPin,
    Keyboard, History, ChevronLeft, ChevronRight, Zap, ArrowRight,
    Star, Tag, Grid, List, Heart, Share2, Filter, Award, Plus, Minus
} from 'lucide-react';
import { motion } from 'framer-motion';

const NewSales = () => {
    // États pour le slide hero
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // États pour la vente
    const [produits, setProduits] = useState([]);
    const [panier, setPanier] = useState([]);
    const [clients, setClients] = useState([]);
    const [clientSelectionne, setClientSelectionne] = useState(null);
    const [searchProduit, setSearchProduit] = useState('');
    const [searchClient, setSearchClient] = useState('');
    const [montantPaye, setMontantPaye] = useState('');
    const [fraisTransport, setFraisTransport] = useState(0);
    const [modePaiement, setModePaiement] = useState('especes');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showModalClient, setShowModalClient] = useState(false);
    const [showRaccourcis, setShowRaccourcis] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFacture, setShowFacture] = useState(false);
    
    // Références
    const produitInputRef = useRef(null);
    const clientInputRef = useRef(null);
    const montantInputRef = useRef(null);
    
    // Données mockées pour les slides
    const slides = [
        { 
            image: "/sales-bg1.jpg", 
            title: "Vente Rapide & Intelligente", 
            subtitle: "Gérez vos ventes avec notre système moderne et intuitif", 
            cta: "Commencer une vente" 
        },
        { 
            image: "/sales-bg2.jpg", 
            title: "Boostez vos Performances", 
            subtitle: "Augmentez votre chiffre d'affaires de 40% avec nos outils", 
            cta: "Voir les statistiques" 
        },
        { 
            image: "/sales-bg3.jpg", 
            title: "Gestion Client Optimisée", 
            subtitle: "Suivez vos clients et leurs préférences en temps réel", 
            cta: "Gérer les clients" 
        }
    ];
    
    // Données mockées pour les produits
    const produitsMock = [
        {
            id: 1,
            code: "PROD001",
            nom: "Ordinateur Portable",
            description: "PC portable 15 pouces, 8GB RAM, 512GB SSD",
            prix: 899900,
            photo: "/products/laptop.jpg",
            categorie: "informatique",
            stock: 15,
            unites: [
                { type: "Unité", prix_vente_ttc: 899900, equivalence_base: 1 }
            ]
        },
        {
            id: 2,
            code: "PROD002",
            nom: "Smartphone Android",
            description: "Écran 6.5\", 128GB, 48MP",
            prix: 349900,
            photo: "/products/phone.jpg",
            categorie: "téléphonie",
            stock: 25,
            unites: [
                { type: "Unité", prix_vente_ttc: 349900, equivalence_base: 1 }
            ]
        },
        {
            id: 3,
            code: "PROD003",
            nom: "Écouteurs Bluetooth",
            description: "Réduction de bruit, autonomie 30h",
            prix: 79900,
            photo: "/products/earbuds.jpg",
            categorie: "audio",
            stock: 50,
            unites: [
                { type: "Paire", prix_vente_ttc: 79900, equivalence_base: 1 }
            ]
        },
        {
            id: 4,
            code: "PROD004",
            nom: "Montre Connectée",
            description: "Suivi santé, GPS, étanche",
            prix: 199900,
            photo: "/products/smartwatch.jpg",
            categorie: "wearable",
            stock: 20,
            unites: [
                { type: "Unité", prix_vente_ttc: 199900, equivalence_base: 1 }
            ]
        },
        {
            id: 5,
            code: "PROD005",
            nom: "Tablette Android",
            description: "Écran 10 pouces, 64GB, WiFi",
            prix: 449900,
            photo: "/products/tablet.jpg",
            categorie: "informatique",
            stock: 12,
            unites: [
                { type: "Unité", prix_vente_ttc: 449900, equivalence_base: 1 }
            ]
        },
        {
            id: 6,
            code: "PROD006",
            nom: "Enceinte Portable",
            description: "360° son, résistante à l'eau",
            prix: 129900,
            photo: "/products/speaker.jpg",
            categorie: "audio",
            stock: 30,
            unites: [
                { type: "Unité", prix_vente_ttc: 129900, equivalence_base: 1 }
            ]
        },
        {
            id: 7,
            code: "PROD007",
            nom: "Clavier Mécanique",
            description: "RGB, switches bleus, filaire",
            prix: 89900,
            photo: "/products/keyboard.jpg",
            categorie: "informatique",
            stock: 40,
            unites: [
                { type: "Unité", prix_vente_ttc: 89900, equivalence_base: 1 }
            ]
        },
        {
            id: 8,
            code: "PROD008",
            nom: "Souris Gaming",
            description: "16000 DPI, 6 boutons, RGB",
            prix: 59900,
            photo: "/products/mouse.jpg",
            categorie: "informatique",
            stock: 35,
            unites: [
                { type: "Unité", prix_vente_ttc: 59900, equivalence_base: 1 }
            ]
        }
    ];
    
    // Données mockées pour les clients
    const clientsMock = [
        {
            id: 1,
            nom: "Dupont",
            prenom: "Jean",
            telephone: "+33 6 12 34 56 78",
            email: "jean.dupont@email.com",
            adresse: "123 Rue de Paris, 75001 Paris"
        },
        {
            id: 2,
            nom: "Martin",
            prenom: "Marie",
            telephone: "+33 6 23 45 67 89",
            email: "marie.martin@email.com",
            adresse: "456 Avenue des Champs, 75008 Paris"
        },
        {
            id: 3,
            nom: "Bernard",
            prenom: "Pierre",
            telephone: "+33 6 34 56 78 90",
            email: "pierre.bernard@email.com",
            adresse: "789 Boulevard Saint-Germain, 75006 Paris"
        }
    ];
    
    // Catégories de produits
    const categories = [
        { id: 'all', name: 'Tous les produits', icon: <Grid className="w-4 h-4" /> },
        { id: 'informatique', name: 'Informatique', icon: <Zap className="w-4 h-4" /> },
        { id: 'téléphonie', name: 'Téléphonie', icon: <Phone className="w-4 h-4" /> },
        { id: 'audio', name: 'Audio', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'wearable', name: 'Wearable', icon: <Star className="w-4 h-4" /> }
    ];
    
    // Initialisation des données mockées
    useEffect(() => {
        setProduits(produitsMock);
        setClients(clientsMock);
        
        // Définir un client par défaut
        if (clientsMock.length > 0) {
            setClientSelectionne(clientsMock[0]);
        }
    }, []);
    
    // Navigation automatique des slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);
    
    // Raccourcis clavier (simulation)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                setShowRaccourcis(true);
            }
            if (e.key === 'F2') {
                e.preventDefault();
                produitInputRef.current?.focus();
            }
            if (e.key === 'F3') {
                e.preventDefault();
                clientInputRef.current?.focus();
            }
            if (e.key === 'F12') {
                e.preventDefault();
                validerVente();
            }
            if (e.key === 'Escape') {
                if (showRaccourcis) setShowRaccourcis(false);
                if (showModalClient) setShowModalClient(false);
                if (showFacture) setShowFacture(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showRaccourcis, showModalClient, showFacture]);
    
    // Navigation slides
    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    
    // Fonctions pour la vente (simulées)
    const ajouterAuPanier = (produit) => {
        const produitAvecUnite = {
            ...produit,
            unite: produit.unites[0],
            quantite: 1,
            prix_unitaire_vente: produit.unites[0].prix_vente_ttc,
            remise_ligne: 0
        };
        
        const existant = panier.find(item => item.id === produit.id);
        if (existant) {
            setPanier(panier.map(item =>
                item.id === produit.id
                    ? { ...item, quantite: item.quantite + 1 }
                    : item
            ));
        } else {
            setPanier([...panier, produitAvecUnite]);
        }
        
        showNotification(`${produit.nom} ajouté au panier`, 'success');
    };
    
    const modifierQuantite = (id, delta) => {
        setPanier(panier.map(item => {
            if (item.id === id) {
                const newQuantite = item.quantite + delta;
                if (newQuantite < 1) return item;
                return { ...item, quantite: newQuantite };
            }
            return item;
        }));
    };
    
    const supprimerDuPanier = (id) => {
        setPanier(panier.filter(item => item.id !== id));
        showNotification('Produit retiré du panier', 'success');
    };
    
    const viderPanier = () => {
        if (panier.length > 0 && window.confirm('Vider tout le panier ?')) {
            setPanier([]);
            showNotification('Panier vidé', 'success');
        }
    };
    
    const calculerTotalLigne = (item) => {
        return (item.prix_unitaire_vente * item.quantite) - item.remise_ligne;
    };
    
    const sousTotal = panier.reduce((sum, item) => sum + calculerTotalLigne(item), 0);
    const totalAPayer = sousTotal + Number(fraisTransport || 0);
    
    // Simulation de validation
    const validerVente = () => {
        if (panier.length === 0) {
            showNotification('Panier vide', 'error');
            return;
        }
        
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowFacture(true);
            showNotification('Vente validée avec succès !', 'success');
        }, 1500);
    };
    
    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };
    
    // Filtrage des produits
    const produitsFiltres = produits.filter(produit => {
        if (selectedCategory === 'all') return true;
        return produit.categorie === selectedCategory;
    });
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg">
                                <ShoppingCart className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">NewSales</h1>
                                <p className="text-sm text-gray-600">Système de vente intelligent</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="font-semibold">Vendeur: Admin</p>
                                <p className="text-sm text-gray-600">Centre: Principal</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Hero Section */}
            <section className="pt-6">
                <div className="relative h-[35vh] md:h-[40vh] overflow-hidden rounded-2xl mx-4">
                    {slides.map((slide, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: index === currentSlide ? 1 : 0,
                                scale: index === currentSlide ? 1 : 1.1
                            }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    transform: `scale(${index === currentSlide ? 1 : 1.05})`,
                                    transition: 'transform 10s ease-out'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70"></div>
                            
                            <div className="relative h-full flex items-center">
                                <div className="container mx-auto px-6">
                                    <div className="max-w-2xl text-white">
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                                            <Zap className="h-4 w-4" />
                                            NOUVELLE VENTE
                                        </span>
                                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                                            {slide.title}
                                        </h1>
                                        <p className="text-lg opacity-90">
                                            {slide.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    {/* Navigation Slides */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-3 rounded-full shadow-xl transition-all group"
                    >
                        <ChevronLeft className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-3 rounded-full shadow-xl transition-all group"
                    >
                        <ChevronRight className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                    </button>
                    
                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all ${
                                    index === currentSlide
                                        ? 'bg-white w-6'
                                        : 'bg-white/30 w-2 hover:bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Quick Stats */}
                <div className="container mx-auto px-4 mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: <ShoppingCart className="h-6 w-6" />, title: "Articles en panier", value: panier.length.toString(), color: "from-blue-500 to-cyan-500" },
                            { icon: <DollarSign className="h-6 w-6" />, title: "Total panier", value: `${totalAPayer.toLocaleString()} F`, color: "from-green-500 to-emerald-500" },
                            { icon: <User className="h-6 w-6" />, title: "Client actuel", value: clientSelectionne?.nom || "Aucun", color: "from-purple-500 to-pink-500" },
                            { icon: <Package className="h-6 w-6" />, title: "Produits disponibles", value: produits.length.toString(), color: "from-orange-500 to-red-500" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all"
                            >
                                <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${item.color} mb-3`}>
                                    <div className="text-white">
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl mb-1">{item.value}</h3>
                                <p className="text-gray-600 text-sm">{item.title}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Products */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Search and Filters */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        ref={produitInputRef}
                                        type="text"
                                        placeholder="Rechercher un produit (code ou nom)... [F2]"
                                        value={searchProduit}
                                        onChange={(e) => setSearchProduit(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                                        >
                                            <Grid className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                                        >
                                            <List className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setShowRaccourcis(true)}
                                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        <Keyboard className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Categories */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                            selectedCategory === cat.id
                                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat.icon}
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Products Grid */}
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {produitsFiltres.map(produit => (
                                        <motion.div
                                            key={produit.id}
                                            whileHover={{ y: -5 }}
                                            className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all border border-gray-200"
                                        >
                                            <div className="relative">
                                                <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                    <Package className="h-16 w-16 text-white/50" />
                                                </div>
                                                <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                                    {produit.stock} en stock
                                                </span>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-gray-900 truncate">
                                                    {produit.nom}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2 truncate">
                                                    {produit.description}
                                                </p>
                                                <p className="text-xl font-bold text-blue-600 mb-3">
                                                    {produit.prix.toLocaleString()} F
                                                </p>
                                                <button
                                                    onClick={() => ajouterAuPanier(produit)}
                                                    disabled={produit.stock === 0}
                                                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Ajouter au panier
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {produitsFiltres.map(produit => (
                                        <div key={produit.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <Package className="h-8 w-8 text-white/50" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900">{produit.nom}</h4>
                                                <p className="text-sm text-gray-600">{produit.code}</p>
                                                <p className="text-xs text-gray-500">Stock: {produit.stock}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-blue-600">{produit.prix.toLocaleString()} F</p>
                                                <button
                                                    onClick={() => ajouterAuPanier(produit)}
                                                    className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg"
                                                >
                                                    Ajouter
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Right Column - Cart and Payment */}
                    <div className="space-y-6">
                        {/* Cart Section */}
                        <div className="bg-white rounded-2xl shadow-xl">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <ShoppingCart className="w-7 h-7 text-blue-600" />
                                        Panier ({panier.reduce((s, i) => s + i.quantite, 0)})
                                    </h2>
                                    {panier.length > 0 && (
                                        <button
                                            onClick={viderPanier}
                                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-6 max-h-96 overflow-y-auto">
                                {panier.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">Panier vide</p>
                                        <p className="text-sm text-gray-400 mt-2">Ajoutez des produits pour commencer</p>
                                    </div>
                                ) : (
                                    panier.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-4 mb-3 bg-gray-50 rounded-xl">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <Package className="h-6 w-6 text-white/50" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 truncate">
                                                    {item.nom}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {item.prix_unitaire_vente.toLocaleString()} F × {item.quantite}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <p className="font-bold text-blue-600">
                                                    {calculerTotalLigne(item).toLocaleString()} F
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => modifierQuantite(item.id, -1)}
                                                        className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="font-medium w-8 text-center">{item.quantite}</span>
                                                    <button
                                                        onClick={() => modifierQuantite(item.id, 1)}
                                                        className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            {/* Cart Summary */}
                            {panier.length > 0 && (
                                <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 border-t border-gray-200">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Sous-total</span>
                                            <span className="font-semibold">{sousTotal.toLocaleString()} F</span>
                                        </div>
                                        
                                        {/* Transport */}
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                            <Truck className="w-5 h-5 text-blue-600" />
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Frais de transport
                                                </label>
                                                <input
                                                    type="number"
                                                    value={fraisTransport}
                                                    onChange={(e) => setFraisTransport(e.target.value)}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 text-right border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <span className="text-sm text-gray-500">F</span>
                                        </div>
                                        
                                        <div className="pt-3 border-t border-gray-200">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Total à payer</span>
                                                <span className="text-blue-600">{totalAPayer.toLocaleString()} F</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Client Section */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <User className="w-6 h-6 text-purple-600" />
                                Client
                            </h3>
                            
                            <div className="relative mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    ref={clientInputRef}
                                    type="text"
                                    placeholder="Rechercher un client... [F3]"
                                    value={searchClient}
                                    onChange={(e) => setSearchClient(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                                />
                            </div>
                            
                            {clientSelectionne ? (
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-lg text-purple-900">
                                                {clientSelectionne.nom} {clientSelectionne.prenom}
                                            </p>
                                            <p className="text-sm text-purple-700 flex items-center gap-1 mt-1">
                                                <Phone className="w-3 h-3" />
                                                {clientSelectionne.telephone}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setClientSelectionne(null)}
                                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 px-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Client comptoir</p>
                                    <button
                                        onClick={() => setShowModalClient(true)}
                                        className="mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm"
                                    >
                                        + Nouveau client
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Payment Section */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 text-green-600" />
                                Paiement
                            </h3>
                            
                            <div className="space-y-4">
                                {/* Payment Methods */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {[
                                        { id: 'especes', label: 'Espèces', icon: <DollarSign className="w-6 h-6" />, color: 'green' },
                                        { id: 'mobile_money', label: 'Mobile Money', icon: <Phone className="w-6 h-6" />, color: 'blue' },
                                        { id: 'carte', label: 'Carte bancaire', icon: <CreditCard className="w-6 h-6" />, color: 'purple' },
                                        { id: 'credit', label: 'Crédit', icon: <Clock className="w-6 h-6" />, color: 'orange' }
                                    ].map(method => (
                                        <button
                                            key={method.id}
                                            onClick={() => setModePaiement(method.id)}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                modePaiement === method.id
                                                    ? `border-${method.color}-500 bg-${method.color}-50`
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <div className="text-center">
                                                <div className={`mb-2 ${modePaiement === method.id ? `text-${method.color}-600` : 'text-gray-600'}`}>
                                                    {method.icon}
                                                </div>
                                                <span className="text-sm font-medium">{method.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Amount Input */}
                                {['especes', 'mobile_money'].includes(modePaiement) && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Montant reçu</label>
                                        <input
                                            ref={montantInputRef}
                                            type="number"
                                            value={montantPaye}
                                            onChange={(e) => setMontantPaye(e.target.value)}
                                            className="w-full px-4 py-3 text-xl text-right border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                )}
                                
                                {/* Rendu */}
                                {montantPaye > 0 && montantPaye > totalAPayer && (
                                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl text-center">
                                        <p className="text-sm text-green-700 font-medium">À rendre au client</p>
                                        <p className="text-3xl font-bold text-green-900 my-2">
                                            {(montantPaye - totalAPayer).toLocaleString()} F
                                        </p>
                                    </div>
                                )}
                                
                                {/* Validation Button */}
                                <button
                                    onClick={validerVente}
                                    disabled={loading || panier.length === 0}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                                    Valider la vente [F12]
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600">© 2024 NewSales - Système de vente intelligent</p>
                    <p className="text-sm text-gray-500 mt-2">Interface moderne pour gestion de ventes</p>
                </div>
            </footer>
            
            {/* Modals */}
            
            {/* Modal Nouveau Client */}
            {showModalClient && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold">Nouveau client</h3>
                            <button onClick={() => setShowModalClient(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Nom</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                                    placeholder="Nom du client"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Prénom</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                                    placeholder="Prénom"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Téléphone</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                                    placeholder="+229 XX XX XX XX"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModalClient(false)}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold"
                            >
                                Créer
                            </button>
                            <button
                                onClick={() => setShowModalClient(false)}
                                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal Raccourcis */}
            {showRaccourcis && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <Keyboard className="w-7 h-7 text-blue-600" />
                                Raccourcis clavier
                            </h3>
                            <button onClick={() => setShowRaccourcis(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { key: 'F1', label: "Afficher l'aide" },
                                { key: 'F2', label: 'Focus produit' },
                                { key: 'F3', label: 'Focus client' },
                                { key: 'F5', label: 'Actualiser' },
                                { key: 'F8', label: 'Vider le panier' },
                                { key: 'F9', label: 'Historique' },
                                { key: 'F10', label: 'Nouveau client' },
                                { key: 'ESC', label: 'Annuler/Fermer' },
                                { key: 'Enter', label: 'Ajouter produit' },
                            ].map(({ key, label }) => (
                                <div key={key} className="p-4 bg-gray-50 rounded-xl hover:shadow-md">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{label}</span>
                                        <kbd className="px-3 py-1 bg-white border border-gray-300 rounded-lg font-mono text-sm">
                                            {key}
                                        </kbd>
                                    </div>
                                </div>
                            ))}
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl col-span-full border-2 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-blue-900">Valider la vente</span>
                                    <kbd className="px-3 py-1 bg-blue-600 text-white border border-blue-700 rounded-lg font-mono text-sm">
                                        F12
                                    </kbd>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowRaccourcis(false)}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold"
                        >
                            Compris !
                        </button>
                    </div>
                </div>
            )}
            
            {/* Modal Facture */}
            {showFacture && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                        <div className="p-8">
                            <div className="text-center mb-8 pb-6 border-b-4 border-blue-600">
                                <h1 className="text-3xl font-bold text-blue-600 mb-2">FACTURE</h1>
                                <p className="text-gray-600">N° FACT-2024-00123</p>
                                <p className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR')}</p>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Informations */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-bold text-gray-700 mb-2">Client</h3>
                                        <p>{clientSelectionne ? `${clientSelectionne.nom} ${clientSelectionne.prenom}` : 'Client comptoir'}</p>
                                        <p className="text-sm text-gray-600">{clientSelectionne?.telephone}</p>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-bold text-gray-700 mb-2">Vendeur</h3>
                                        <p>Admin</p>
                                        <p className="text-sm text-gray-600">Centre Principal</p>
                                    </div>
                                </div>
                                
                                {/* Articles */}
                                <div className="border rounded-xl overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left">Article</th>
                                                <th className="px-4 py-3 text-center">Qté</th>
                                                <th className="px-4 py-3 text-right">Prix</th>
                                                <th className="px-4 py-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {panier.map((item, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium">{item.nom}</p>
                                                        <p className="text-sm text-gray-600">{item.code}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">{item.quantite}</td>
                                                    <td className="px-4 py-3 text-right">{item.prix_unitaire_vente.toLocaleString()} F</td>
                                                    <td className="px-4 py-3 text-right font-bold">{calculerTotalLigne(item).toLocaleString()} F</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Totaux */}
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Sous-total</span>
                                        <span className="font-bold">{sousTotal.toLocaleString()} F</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Transport</span>
                                        <span>+ {Number(fraisTransport).toLocaleString()} F</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold pt-4 border-t">
                                        <span>TOTAL</span>
                                        <span className="text-blue-600">{totalAPayer.toLocaleString()} F</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 pt-2">
                                        <span>Mode de paiement: {modePaiement === 'especes' ? 'Espèces' : modePaiement === 'mobile_money' ? 'Mobile Money' : modePaiement}</span>
                                        <span>Montant reçu: {montantPaye || '0'} F</span>
                                    </div>
                                </div>
                                
                                {/* Message de remerciement */}
                                <div className="text-center pt-6 border-t">
                                    <p className="text-lg font-semibold text-blue-600 mb-2">Merci pour votre confiance !</p>
                                    <p className="text-sm text-gray-500">Votre facture a été générée avec succès.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t flex gap-3 rounded-b-2xl">
                            <button
                                onClick={() => setShowFacture(false)}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                                <Printer className="w-5 h-5" />
                                Imprimer
                            </button>
                            <button
                                onClick={() => setShowFacture(false)}
                                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
                    notification.type === 'success'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                }`}>
                    {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium">{notification.msg}</span>
                </div>
            )}
        </div>
    );
};

export default NewSales;