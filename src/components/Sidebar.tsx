import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  Receipt,
  Package,
  Warehouse,
  Calendar,
  BarChart3,
  User,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  History,
  Briefcase,
  Box,
  ClipboardList,
  X,
  Menu, // 1. Ajout de l'icône Menu
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void; // 2. Ajout de la fonction pour ouvrir
}

interface MenuItem {
  id: string;
  title: string;
  icon: any;
  path?: string;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  icon: any;
  path: string;
}

const Sidebar = ({ isOpen, onClose, onOpen }: SidebarProps) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setExpanded((p) => ({ ...p, [key]: !p[key] }));
  const isActive = (path?: string) => path && location.pathname === path;

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) onClose();
  };

  const menu: MenuItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "clients",
      title: "Clients",
      icon: Users,
      submenu: [
        { title: "Liste", icon: List, path: "/clients/list" },
        { title: "Nouveau", icon: Plus, path: "/clients/new" },
      ],
    },
    {
      id: "ventes",
      title: "Ventes",
      icon: ShoppingCart,
      submenu: [
        { title: "Nouvelle vente", icon: Plus, path: "/ventes/new" },
        { title: "Historique", icon: History, path: "/ventes/list" },
      ],
    },
    { id: "devis", title: "Devis", icon: FileText, path: "/devis/list" },
    {
      id: "factures",
      title: "Factures",
      icon: Receipt,
      path: "/factures/list",
    },
    {
      id: "produits",
      title: "Produits",
      icon: Package,
      submenu: [
        { title: "Liste", icon: List, path: "/produits/list" },
        { title: "Nouveau", icon: Plus, path: "/produits/new" },
      ],
    },
    {
      id: "stock",
      title: "Stock",
      icon: Warehouse,
      submenu: [
        { title: "Mouvements", icon: ClipboardList, path: "/stock/mouvements" },
        { title: "Historique", icon: History, path: "/stock/historique" },
        { title: "Sortie Stock", icon: Box, path: "/stock/sortir" },
        { title: "Ajouter Stock", icon: Box, path: "/stock/ajouter" },
      ],
    },
    { id: "activites", title: "Activités", icon: Calendar, path: "/activites" },
    { id: "rapports", title: "Rapports", icon: BarChart3, path: "/rapports" },
    {
      id: "utilisateurs",
      title: "Utilisateurs",
      icon: User,
      path: "/utilisateurs",
    },
    { id: "caisse", title: "Caisse", icon: CreditCard, path: "/caisse" },
    {
      id: "paramètres",
      title: "Paramètres",
      icon: Settings,
      submenu: [
        { title: "Utilisateurs", icon: User, path: "/paramètres/utilisateurs" },
        { title: "Société", icon: Briefcase, path: "/paramètres/societe" },
        { title: "Centre", icon: Settings, path: "/paramètres/centre" },
        { title: "Categories", icon: Settings, path: "/paramètres/categories" },
        { title: "Marques", icon: Settings, path: "/paramètres/marques" }
      ],
    },
  ];

  return (
    <>
      {/* 3. BOUTON DÉCLENCHEUR (TIROIR) */}
      {/* Ce bouton apparaît uniquement quand la sidebar est fermée sur mobile */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay mobile (Fond grisé avec effet de flou amélioré) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-md transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        role="navigation"
        aria-label="Menu principal"
        className={`
          fixed top-0 left-0 z-40 h-screen w-72
          bg-gradient-to-b from-slate-900 via-gray-900 to-slate-900 text-gray-100 shadow-2xl border-r border-slate-700
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
          
          /* Gestion du scroll sans barre visible */
          overflow-y-auto 
          [scrollbar-width:none] 
          [-ms-overflow-style:none] 
          [&::-webkit-scrollbar]:hidden
        `}
      >
        {/* Header - Sticky pour rester visible lors du scroll */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 h-20 bg-gradient-to-r from-slate-900 to-gray-900 border-b border-slate-700 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 animate-pulse">
              <Briefcase className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight text-white">UATM</h1>
              <p className="text-sm text-slate-400">Gasa-formation</p>
            </div>
          </div>
          {/* Bouton Fermer (Visible uniquement sur mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-all duration-200 text-slate-400 hover:text-white hover:scale-110"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu - Pas de overflow ici pour utiliser celui du parent */}
        <nav className="px-4 py-6 space-y-2">
          {menu.map((item) =>
            item.submenu ? (
              <div key={item.id}>
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:shadow-md transition-all duration-200 group"
                  aria-expanded={expanded[item.id]}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                    <span className="font-medium text-slate-200 group-hover:text-white">{item.title}</span>
                  </div>
                  {expanded[item.id] ? (
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  )}
                </button>

                {expanded[item.id] && (
                  <div className="ml-8 mt-2 space-y-1 border-l-2 border-purple-500/50 pl-4 animate-fadeIn">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={closeOnMobile}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105 ${
                          isActive(sub.path)
                            ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-300 font-semibold shadow-md"
                            : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
                        }`}
                      >
                        <sub.icon className="w-4 h-4" />
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.id}
                to={item.path!}
                onClick={closeOnMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-300 font-semibold shadow-lg"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            )
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;