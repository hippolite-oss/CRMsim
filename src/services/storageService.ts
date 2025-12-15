import { Client, Opportunite, Contact, Project , User } from '../types';

/* =======================
   STORAGE KEYS
======================= */
const STORAGE_KEYS = {
  CLIENTS: 'crm_clients',
  OPPORTUNITES: 'crm_opportunites',
  CONTACTS: 'crm_contacts',
  PROJECTS: 'crm_projects',
  USERS: 'crm_users',
};

/* =======================
   CLIENT SERVICE
======================= */
export const clientService = {
  getAll: (): Client[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Client | undefined =>
    clientService.getAll().find(c => c.id === id),

  create: (client: Omit<Client, 'id' | 'dateCreation'>): Client => {
    const clients = clientService.getAll();
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString(),
    };
    clients.push(newClient);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    return newClient;
  },
};

/* =======================
   PROJECT SERVICE (✅ MANQUANT)
======================= */
export const projectService = {
  getAll: (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Project | undefined =>
    projectService.getAll().find(p => p.id === id),

  create: (project: Omit<Project, 'id' | 'dateCreation'>): Project => {
    const projects = projectService.getAll();
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString(),
      status: project.status ?? 'En attente',
      priority: project.priority ?? 'Moyenne',
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProject;
  },

  update: (id: string, updates: Partial<Project>): Project | null => {
    const projects = projectService.getAll();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return projects[index];
  },

  delete: (id: string): boolean => {
    const projects = projectService.getAll();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    return filtered.length < projects.length;
  },

  archive: (id: string): void => {
    projectService.update(id, { status: 'Archivé' });
  },
};

/* =======================
   USER SERVICE (✅ MANQUANT)
======================= */
export const userService = {
  getAll: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  create: (user: Omit<User, 'id'>): User => {
    const users = userService.getAll();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },
};

/* =======================
   OPPORTUNITÉ SERVICE
======================= */
export const opportuniteService = {
  getAll: (): Opportunite[] => {
    const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITES);
    return data ? JSON.parse(data) : [];
  },
};

/* =======================
   CONTACT SERVICE
======================= */
export const contactService = {
  getAll: (): Contact[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return data ? JSON.parse(data) : [];
  },
};
