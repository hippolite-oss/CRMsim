import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  LogOut,
  Home,
  Briefcase,
  DollarSign,
  Box,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    clients: true,
    ventes: false,
    produits: false,
    stock: false,
    paramètres: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      id: 'clients',
      title: 'Clients',
      icon: Users,
      hasSubmenu: true,
      isExpanded: expandedSections.clients,
      subItems: [
        {
          title: 'Liste clients',
          icon: List,
          path: '/clients',
          active: location.pathname === '/clients',
        },
        {
          title: 'Nouveau client',
          icon: Plus,
          path: '/clients/nouveau',
          active: location.pathname === '/clients/nouveau',
        },
      ],
    },
    {
      id: 'ventes',
      title: 'Ventes',
      icon: ShoppingCart,
      hasSubmenu: true,
      isExpanded: expandedSections.ventes,
      subItems: [
        {
          title: 'Faire une vente',
          icon: Plus,
          path: '/ventes/nouvelle',
          active: location.pathname === '/ventes/nouvelle',
        },
        {
          title: 'Historique des ventes',
          icon: History,
          path: '/ventes',
          active: location.pathname === '/ventes',
        },
      ],
    },
    {
      id: 'devis',
      title: 'Devis',
      icon: FileText,
      path: '/devis',
      active: location.pathname === '/devis',
    },
    {
      id: 'factures',
      title: 'Factures',
      icon: Receipt,
      path: '/factures',
      active: location.pathname === '/factures',
    },
    {
      id: 'produits',
      title: 'Produits',
      icon: Package,
      hasSubmenu: true,
      isExpanded: expandedSections.produits,
      subItems: [
        {
          title: 'Liste produits',
          icon: List,
          path: '/produits',
          active: location.pathname === '/produits',
        },
        {
          title: 'Nouveau produit',
          icon: Plus,
          path: '/produits/nouveau',
          active: location.pathname === '/produits/nouveau',
        },
      ],
    },
    {
      id: 'stock',
      title: 'Stock',
      icon: Warehouse,
      hasSubmenu: true,
      isExpanded: expandedSections.stock,
      subItems: [
        {
          title: 'Entrées / Sorties',
          icon: ClipboardList,
          path: '/stock/mouvements',
          active: location.pathname === '/stock/mouvements',
        },
        {
          title: 'Historique des mouvements',
          icon: History,
          path: '/stock/historique',
          active: location.pathname === '/stock/historique',
        },
        {
          title: 'État des stocks',
          icon: Box,
          path: '/stock/etat',
          active: location.pathname === '/stock/etat',
        },
      ],
    },
    {
      id: 'activites',
      title: 'Activités',
      icon: Calendar,
      path: '/activites',
      active: location.pathname === '/activites',
    },
    {
      id: 'rapports',
      title: 'Rapports',
      icon: BarChart3,
      path: '/rapports',
      active: location.pathname === '/rapports',
    },
    {
      id: 'utilisateurs',
      title: 'Utilisateurs',
      icon: User,
      path: '/utilisateurs',
      active: location.pathname === '/utilisateurs',
    },
    {
      id: 'caisse',
      title: 'Caisse',
      icon: CreditCard,
      path: '/caisse',
      active: location.pathname === '/caisse',
    },
    {
      id: 'paramètres',
      title: 'Paramètres',
      icon: Settings,
      hasSubmenu: true,
      isExpanded: expandedSections.paramètres,
      subItems: [
        {
          title: 'Utilisateurs',
          icon: User,
          path: '/paramètres/utilisateurs',
          active: location.pathname === '/paramètres/utilisateurs',
        },
        {
          title: 'Vue globale société',
          icon: Briefcase,
          path: '/paramètres/societe',
          active: location.pathname === '/paramètres/societe',
        },
        {
          title: 'Configuration générale',
          icon: Settings,
          path: '/paramètres/general',
          active: location.pathname === '/paramètres/general',
        },
         {
          title: 'Centre',
          icon: Settings,
          path: '/paramètres/centre',
          active: location.pathname === '/paramètres/centre',
        },
      ],
    },
  ];

  return (
    <div className="w-64 bg-gray-900 text-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">UATM</h1>
            <p className="text-xs text-gray-400">Gasa-formation</p>
          </div>
        </div>
      </div>

      {/* Menu principal */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.hasSubmenu ? (
              <div className="mb-1">
                <button
                  onClick={() => toggleSection(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    item.subItems?.some(sub => sub.active)
                      ? 'bg-primary-500/20 text-primary-400 border-l-4 border-primary-500'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {item.isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {item.isExpanded && (
                  <div className="ml-4 pl-8 border-l border-gray-800 mt-1 space-y-1">
                    {item.subItems?.map((subItem, index) => (
                      <Link
                        key={index}
                        to={subItem.path}
                        className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                          subItem.active
                            ? 'bg-primary-500/10 text-primary-400'
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span className="text-sm">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path || '#'}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-primary-500/20 text-primary-400 border-l-4 border-primary-500'
                    : 'hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;