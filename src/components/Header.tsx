// src/components/Header.jsx
import { useState, useEffect } from 'react';
import {
    ShoppingCart, Menu, X, ArrowRight,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Ajoute useLocation et useNavigate

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [parametres, setParametres] = useState(null);

    const location = useLocation();     // Pour savoir sur quelle page on est
    const navigate = useNavigate();     // Pour rediriger programmatiquement

    const fetchParametres = async () => {
        try {
            const res = await Axios.get('/api/parametres');
            if (res.data.success) {
                setParametres(res.data.data);
            }
        } catch (error) {
            console.error('Erreur chargement paramètres:', error);
        }
    };

    useEffect(() => {
        fetchParametres();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Nouvelle fonction intelligente de navigation
    const goToSection = (id) => {
        const isHomePage = location.pathname === '/';

        if (isHomePage) {
            // Si on est déjà sur la page d'accueil → scroll direct
            const element = document.getElementById(id);
            if (element) {
                const offset = 80;
                const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        } else {
            // Sinon → on redirige vers Home avec un paramètre dans l'URL
            navigate(`/?section=${id}`);
        }

        setIsMenuOpen(false);
    };

    // Effet pour scroller automatiquement après redirection (sur Home)
    useEffect(() => {
        if (location.pathname === '/' && location.search) {
            const params = new URLSearchParams(location.search);
            const section = params.get('section');
            if (section) {
                // Petit délai pour laisser le DOM charger
                const timer = setTimeout(() => {
                    const element = document.getElementById(section);
                    if (element) {
                        const offset = 80;
                        const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                    // Nettoyer l'URL après scroll (optionnel, pour une URL propre)
                    navigate('/', { replace: true });
                }, 100);

                return () => clearTimeout(timer);
            }
        }
    }, [location, navigate]);

    const navItems = [
        { id: 'accueil', label: 'Accueil' },
        { id: 'produits', label: 'Produits' },
        { id: 'services', label: 'Services' },
        { id: 'contact', label: 'Contact' }
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-xl py-2' : 'bg-white/95 py-3'
            }`}>
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo → toujours vers accueil */}
                    <Link to="/" className="flex items-center space-x-2 md:space-x-3">
                        <img
                            src="logo.jpg"
                            alt="Logo"
                            className="h-8 w-8 md:h-10 md:w-10 object-contain rounded-lg"
                        />
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                            {parametres?.nom_societe || 'Quincaillerie'}
                        </span>
                    </Link>

                    {/* Navigation Desktop */}
                    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => goToSection(item.id)}
                                className="relative group text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 text-sm xl:text-base cursor-pointer"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                            </button>
                        ))}
                    </div>

                    {/* CTA + Menu mobile */}
                    <div className="flex items-center space-x-3 md:space-x-4">
                        {/* Bouton Commander */}
                        <Link to="/commande">
                            <button className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-blue-500/50 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                                <span>Commander</span>
                                <ShoppingCart className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>

                        {/* Bouton Connexion Admin */}
                        <Link to="/login">
                            <button className="hidden md:flex items-center space-x-2 bg-white border-2 border-cyan-500 text-cyan-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-cyan-50 hover:shadow-cyan-500/30 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                                <span>Connexion</span>
                                <User className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Menu mobile */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden mt-4 bg-white rounded-lg shadow-xl p-4 border border-gray-200"
                    >
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => goToSection(item.id)}
                                    className="block w-full text-left py-3 px-4 hover:bg-blue-50 rounded-lg transition-colors text-gray-700 font-medium"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 gap-y-2">
                            <Link to="/commande" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                                <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
                                    <span>Passer commande</span>
                                    <ShoppingCart className="h-4 w-4" />
                                </button>
                            </Link>
                             <Link to="/admin" className="block mt-3 w-full" onClick={() => setIsMenuOpen(false)}>
                                <button className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-cyan-500 text-cyan-600  px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
                                    <span>Se connecter</span>
                                    <User className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Header;