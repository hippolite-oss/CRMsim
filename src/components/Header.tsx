// src/components/Header.jsx
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Correction de l'import Axios

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [parametres, setParametres] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // 1. Fetch des paramètres
  useEffect(() => {
    const fetchParametres = async () => {
      try {
        const res = await axios.get("/api/parametres"); // axios en minuscule
        if (res.data.success) setParametres(res.data.data);
      } catch (error) {
        console.error("Erreur chargement paramètres:", error);
      }
    };
    fetchParametres();
  }, []);

  // 2. Gestion du scroll pour l'effet visuel
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Navigation intelligente
  const goToSection = (id) => {
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
      }
    } else {
      navigate(`/?section=${id}`);
    }
    setIsMenuOpen(false);
  };

  // 4. Auto-scroll après redirection
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (location.pathname === "/" && section) {
      const timer = setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          const offset = 90;
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }
        navigate("/", { replace: true });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const navItems = [
    { id: "accueil", label: "Accueil" },
    { id: "produits", label: "Produits" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      {/* ÉLÉMENT CLÉ : Le "Spacer"
                Ce div occupe l'espace exact du header pour pousser le contenu vers le bas.
                On ajuste sa hauteur en fonction de l'état 'scrolled'.
            */}
      <div
        className={`${scrolled ? "h-16" : "h-20"} transition-all duration-300`}
      />

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg py-2"
            : "bg-white py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="logo3.jpg"
                alt="Logo"
                className="h-14 w-10 object-contain rounded-lg shadow-sm"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {parametres?.nom_societe || "CRM"}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => goToSection(item.id)}
                  className="text-gray-600 hover:text-blue-600 font-semibold transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 text-gray-700 font-semibold hover:text-blue-600 px-4 py-2 transition-all"
              >
                <User size={18} />
                <span>Connexion</span>
              </Link>
              <Link to="/commande" className="hidden md:block">
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md hover:shadow-blue-200 transition-all flex items-center gap-2">
                  <ShoppingCart size={18} />
                  <span>Commander</span>
                </button>
              </Link>

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu avec AnimatePresence */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                je pense que cest la 
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => goToSection(item.id)}
                    className="block w-full text-left p-3 text-gray-700 font-bold hover:bg-blue-50 rounded-xl"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl font-bold"
                  >
                    <User size={18} /> Connexion
                  </Link>
                  <Link
                    to="/commande"
                    className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-xl font-bold"
                  >
                    <ShoppingCart size={18} /> Commander
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Header;
