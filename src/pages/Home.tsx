// src/pages/HomeCRM.jsx
import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Users, TrendingUp, DollarSign, 
  BarChart3, Shield, Clock, Phone, ArrowRight,
  Mail, MapPin, Facebook, Twitter, Instagram, Linkedin,
  Activity, Target, Award, CheckCircle, Zap,
  MessageSquare, Calendar, Settings, Cloud, Lock,
  Star, Package, ShoppingBag, Tag
} from 'lucide-react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const productsRef = useRef(null);
  const dashboardRef = useRef(null);
  const contactRef = useRef(null);

  const controls = {
    hero: useAnimation(),
    features: useAnimation(),
    products: useAnimation(),
    dashboard: useAnimation(),
    contact: useAnimation()
  };

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const productsInView = useInView(productsRef, { once: true });
  const dashboardInView = useInView(dashboardRef, { once: true });
  const contactInView = useInView(contactRef, { once: true });

  // Slides pour le hero avec chemins depuis le dossier public
  const slides = [
    { 
      image: "/i1.jpg", 
      title: "Gérez vos relations client efficacement", 
      subtitle: "Augmentez vos ventes de 45% avec notre CRM intelligent", 
      cta: "Essai gratuit 30 jours" 
    },
    { 
      image: "/i2.jpg", 
      title: "Automatisez vos processus commerciaux", 
      subtitle: "Réduisez le temps administratif de 70%", 
      cta: "Voir les fonctionnalités" 
    },
    { 
      image: "/i3.jpg", 
      title: "Suivez vos performances en temps réel", 
      subtitle: "Tableaux de bord personnalisés pour une meilleure prise de décision", 
      cta: "Découvrir les rapports" 
    }
  ];

  // Produits phares simplifiés
  const featuredProductsData = [
    {
      id: 1,
      name: "CRM Enterprise Pro",
      price: "2500FCFA",
      image: "a1.jpg",
    },
    {
      id: 2,
      name: "CRM Business",
      price: "1000FCFA",
      image: "f2.jpg",
    },
    {
      id: 3,
      name: "CRM Starter",
      price: "5000FCFA",
      image: "a3.jpg",
    },
    {
      id: 4,
      name: "CRM Mobile",
      price: "2000FCFA",
      image: "f5.png",
    },
   
  
  ];

  // Fonctionnalités principales
  const features = [
    {
      id: 1,
      title: "Gestion des Clients",
      description: "Centralisez toutes les informations clients, historiques et interactions",
      icon: Users,
      stats: "500+ entreprises",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Pipeline des Ventes",
      description: "Suivez chaque opportunité de la prospection à la facturation",
      icon: TrendingUp,
      stats: "Conversion +35%",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      title: "Automatisation",
      description: "Automatisez vos emails, rappels et tâches répétitives",
      icon: Zap,
      stats: "70% de temps gagné",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Analytics & Rapports",
      description: "Tableaux de bord personnalisables avec indicateurs clés",
      icon: BarChart3,
      stats: "50+ rapports disponibles",
      color: "from-orange-500 to-red-500"
    }
  ];

  // Témoignages clients
  const testimonials = [
    {
      name: "Sarah Martin",
      company: "TechSolutions Inc",
      role: "Directrice Commerciale",
      content: "Depuis l'implémentation de ce CRM, notre équipe a augmenté sa productivité de 40%. La gestion des leads est devenue beaucoup plus efficace.",
      avatar: "SM"
    },
    {
      name: "Thomas Dubois",
      company: "Innovatech",
      role: "CEO",
      content: "L'automatisation des processus nous a permis de réduire le temps administratif de 60%. Un outil indispensable pour notre croissance.",
      avatar: "TD"
    },
    {
      name: "Marie Lambert",
      company: "Global Consulting",
      role: "Responsable Marketing",
      content: "Les rapports en temps réel nous permettent de prendre des décisions éclairées rapidement. L'intégration avec nos autres outils est parfaite.",
      avatar: "ML"
    }
  ];

  // Services CRM
  const services = [
    {
      icon: <Cloud className="w-12 h-12" />,
      title: "Cloud Sécurisé",
      description: "Données stockées sur des serveurs sécurisés avec sauvegarde automatique",
      color: "bg-blue-500"
    },
    {
      icon: <Settings className="w-12 h-12" />,
      title: "Personnalisation",
      description: "Adaptez le CRM à vos processus métiers spécifiques",
      color: "bg-purple-500"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Sécurité RGPD",
      description: "Conforme aux dernières réglementations de protection des données",
      color: "bg-green-500"
    },
    {
      icon: <MessageSquare className="w-12 h-12" />,
      title: "Support Premium",
      description: "Assistance technique 7j/7 par nos experts CRM",
      color: "bg-orange-500"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simuler le chargement des produits
  useEffect(() => {
    setFeaturedProducts(featuredProductsData);
  }, []);

  useEffect(() => {
    if (heroInView) controls.hero.start({ opacity: 1, y: 0 });
    if (featuresInView) controls.features.start({ opacity: 1, y: 0 });
    if (productsInView) controls.products.start({ opacity: 1, y: 0 });
    if (dashboardInView) controls.dashboard.start({ opacity: 1, y: 0 });
    if (contactInView) controls.contact.start({ opacity: 1, y: 0 });
  }, [heroInView, featuresInView, productsInView, dashboardInView, contactInView]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      <Header />

      {/* Hero Section CRM - Sans filtre */}
      <section id="accueil" className="pt-16 md:pt-20" ref={heroRef}>
        <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1 : 1.1
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* Image de fond sans filtre */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  transform: `scale(${index === currentSlide ? 1 : 1.05})`,
                  transition: 'transform 10s ease-out'
                }}
              />
              
              {/* Overlay léger seulement pour améliorer la lisibilité du texte */}
              <div className="absolute inset-0 bg-black/20"></div>

              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="max-w-xl md:max-w-2xl text-white"
                  >
                    <span className="inline-block px-4 py-2 bg-blue-600/80 backdrop-blur-sm rounded-full text-sm font-semibold mb-4 border border-white/20 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      NOUVEAU!
                    </span>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl mb-6 text-white drop-shadow-lg">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-2">
                      <button className="group relative bg-gradient-to-r from-blue-600 to-primary-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                          {slide.cta}
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                      <button className="group bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-base font-semibold hover:bg-white/30 transition-all duration-300">
                        <span className="flex items-center justify-center gap-2">
                          <Phone className="h-5 w-5 group-hover:animate-pulse" />
                          Demander une démo
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center gap-6 mt-8">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-300" />
                        <span className="text-sm text-white drop-shadow">Sans engagement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-300" />
                        <span className="text-sm text-white drop-shadow">Configuration gratuite</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-300" />
                        <span className="text-sm text-white drop-shadow">Support 24/7</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Contrôles du slider */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-3 rounded-full shadow-xl transition-all duration-300 group"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-3 rounded-full shadow-xl transition-all duration-300 group"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Indicateurs de slide */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/30 w-3 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statistiques rapides */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls.hero}
          className="container mx-auto px-4 md:px-6 lg:px-8 -mt-8 md:-mt-12 relative z-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: <Users className="h-7 w-7" />, title: "Clients actifs", value: "15,000+", color: "from-blue-500 to-cyan-500" },
              { icon: <TrendingUp className="h-7 w-7" />, title: "Ventes augmentées", value: "+45%", color: "from-green-500 to-emerald-500" },
              { icon: <DollarSign className="h-7 w-7" />, title: "ROI moyen", value: "300%", color: "from-purple-500 to-pink-500" },
              { icon: <Clock className="h-7 w-7" />, title: "Temps gagné", value: "70%", color: "from-orange-500 to-red-500" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-5 md:p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${item.color} mb-4`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-bold text-2xl md:text-3xl mb-2">{item.value}</h3>
                <p className="text-gray-600 text-base">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section Fonctionnalités */}
      <section id="fonctionnalites" className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50" ref={featuresRef}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls.features}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm mb-4">
              Pourquoi choisir notre CRM
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Transformez votre gestion commerciale</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Un CRM complet conçu pour simplifier vos processus et booster vos résultats
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${feature.color}`}></div>
                <div className="p-6 md:p-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600">{feature.stats}</span>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Produits Phares - Simplifiée */}
      <section id="produits" className="py-16 md:py-24 bg-white" ref={productsRef}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls.products}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-sm mb-4">
              Nos Solutions
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Produits Phares</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos meilleures solutions CRM
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Image du produit */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Prix superposé sur l'image */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium truncate">{product.name}</span>
                      <span className="text-white text-lg font-bold">{product.price}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bouton Voir plus */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all">
              <ShoppingBag className="h-5 w-5" />
              Voir tous nos produits
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section Dashboard Preview */}
      <section id="dashboard" className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-black text-white" ref={dashboardRef}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls.dashboard}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full font-semibold text-sm mb-4">
                Interface intuitive
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Tableaux de bord puissants et personnalisables
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Visualisez toutes vos données commerciales en un coup d'œil. Suivez vos KPIs, analysez vos performances et prenez des décisions éclairées.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <Activity className="h-6 w-6" />, text: "Suivi en temps réel des opportunités" },
                  { icon: <Target className="h-6 w-6" />, text: "Objectifs personnalisés par équipe" },
                  { icon: <BarChart3 className="h-6 w-6" />, text: "Rapports automatiques par email" },
                  { icon: <Calendar className="h-6 w-6" />, text: "Planification intelligente des rendez-vous" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      {item.icon}
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all">
                  Essayer la démo
                </button>
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all">
                  Voir tous les rapports
                </button>
              </div>
            </div>

            <div className="relative">
              {/* Preview du dashboard */}
              <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Dashboard Ventes</h3>
                      <p className="text-gray-400 text-sm">Mise à jour en temps réel</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">Aujourd'hui</div>
                </div>

                {/* Mini graphiques */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900/50 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold">€125,430</p>
                    <p className="text-green-500 text-sm">+12.5%</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">Nouveaux clients</p>
                    <p className="text-2xl font-bold">42</p>
                    <p className="text-green-500 text-sm">+8.2%</p>
                  </div>
                </div>

                {/* Barres de progression */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Pipeline des ventes</span>
                      <span>75%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-3/4"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Taux de conversion</span>
                      <span>42%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-2/5"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Éléments flottants */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl shadow-2xl">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-xl shadow-2xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm mb-4">
              Ils nous font confiance
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Ce que disent nos clients</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.content}"</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Nos services inclus</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour réussir avec votre CRM
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`${service.color} p-8`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <button className="flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="mr-2">En savoir plus</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-16 md:py-24 bg-white" ref={contactRef}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls.contact}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Informations de contact */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Prêt à transformer votre business ?</h2>
                <p className="text-lg md:text-xl text-gray-600 mb-12">
                  Contactez-nous pour une démonstration personnalisée de notre solution CRM
                </p>

                <div className="space-y-8">
                  {[
                    { 
                      icon: <Phone className="h-6 w-6" />, 
                      title: "Téléphone", 
                      detail: "+33 1 23 45 67 89", 
                      action: "Appeler maintenant",
                      link: "tel:+33123456789"
                    },
                    { 
                      icon: <Mail className="h-6 w-6" />, 
                      title: "Email", 
                      detail: "contact@votre-crm.com", 
                      action: "Envoyer un email",
                      link: "mailto:contact@votre-crm.com"
                    },
                    { 
                      icon: <MapPin className="h-6 w-6" />, 
                      title: "Siège social", 
                      detail: "123 Avenue des Champs-Élysées, 75008 Paris", 
                      action: "Voir sur la carte",
                      link: "#"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <div className="text-blue-600">{item.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-gray-700 text-base mb-2">{item.detail}</p>
                        <a 
                          href={item.link}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          {item.action} →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Réseaux sociaux */}
                <div className="mt-12">
                  <h3 className="font-bold text-xl mb-6">Suivez-nous</h3>
                  <div className="flex space-x-4">
                    {[
                      { icon: <Facebook className="h-6 w-6" />, color: "bg-blue-600", link: "#" },
                      { icon: <Twitter className="h-6 w-6" />, color: "bg-sky-500", link: "#" },
                      { icon: <Instagram className="h-6 w-6" />, color: "bg-pink-600", link: "#" },
                      { icon: <Linkedin className="h-6 w-6" />, color: "bg-blue-700", link: "#" }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${social.color} text-white p-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formulaire de contact */}
              <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold mb-2">Demandez une démo gratuite</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Entreprise</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Parlez-nous de vos besoins..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    Demander ma démo gratuite
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;