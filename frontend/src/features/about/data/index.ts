import type { TechItem, TimeEntry, DockerService, ApproachCard } from '../types';

export const backendTechs: TechItem[] = [
  { name: 'PHP', version: '8.2', role: 'Langage' },
  { name: 'Symfony', version: '6.4', role: 'Framework' },
  { name: 'API Platform', version: '3.2', role: 'API REST / Hydra JSON-LD' },
  { name: 'Doctrine ORM', version: '2.17', role: 'ORM Base de données' },
  { name: 'MySQL', version: '8.0', role: 'Base de données' },
  { name: 'PHPUnit', version: '10.5', role: 'Tests unitaires' },
];

export const frontendTechs: TechItem[] = [
  { name: 'React', version: '19', role: 'Bibliothèque UI' },
  { name: 'TypeScript', version: '5.6', role: 'Langage' },
  { name: 'Vite', version: '6', role: 'Outil de build / Serveur Dev' },
  { name: 'TailwindCSS', version: '3.4', role: 'CSS utilitaire' },
  { name: 'React Query', version: '5', role: 'Gestion état serveur' },
  { name: 'React Router', version: '7', role: 'Routage côté client' },
  { name: 'Axios', version: '1.6', role: 'Client HTTP' },
  { name: 'Vitest', version: '2', role: 'Tests unitaires / composants' },
  { name: 'Testing Library', version: '16', role: 'Tests DOM / React' },
];

export const infraTechs: TechItem[] = [
  { name: 'Docker', version: '20.10+', role: 'Conteneurisation' },
  { name: 'Docker Compose', version: '2.0+', role: 'Orchestration multi-services' },
  { name: 'Nginx', version: 'Alpine', role: 'Reverse Proxy' },
];

export const timeEntries: TimeEntry[] = [
  {
    task: 'Configuration du projet & Docker',
    hours: 1.5,
    description: "Docker Compose, volumes, networking, fichiers d'environnement",
  },
  {
    task: 'Backend — Entités & Migrations',
    hours: 1.0,
    description: 'Entités Client & Commande, Doctrine ORM, migration auto',
  },
  {
    task: 'Backend — API Platform',
    hours: 1.5,
    description: 'Endpoints REST, Hydra JSON-LD, pagination, filtres recherche',
  },
  {
    task: 'Backend — Commande import CSV',
    hours: 2.0,
    description: 'ImportOrdersCommand, validation, rapports erreurs, fichiers erreurs CSV',
  },
  {
    task: 'Backend — Tests',
    hours: 1.5,
    description: 'Tests PHPUnit: validation import, fichiers erreurs, intégration API',
  },
  {
    task: 'Frontend — Architecture & Configuration',
    hours: 1.0,
    description: 'Architecture basée features, React Query, Axios, routage',
  },
  {
    task: 'Frontend — Composants partagés',
    hours: 2.0,
    description: 'Button, Table, Spinner, ErrorMessage, Pagination, SearchInput',
  },
  {
    task: 'Frontend — Pages (Clients, Commandes)',
    hours: 2.0,
    description: 'Liste clients paginée, détails commandes, recherche, états erreurs',
  },
  {
    task: 'Frontend — Système de thème & Mode sombre',
    hours: 2.0,
    description: 'Variables CSS, config Tailwind, hook useTheme, ThemeToggle',
  },
  {
    task: 'Frontend — Tests',
    hours: 1.5,
    description: 'Vitest + Testing Library: hooks, pages, couche service',
  },
  {
    task: 'Documentation & README',
    hours: 0.5,
    description: 'README simplifié avec setup, import, commandes test',
  },
];

export const dockerServices: DockerService[] = [
  {
    name: 'ugo_db',
    desc: 'MySQL 8.0 — volume de données persistant, health-check avant dépendants',
  },
  {
    name: 'ugo_php',
    desc: 'PHP 8.2-FPM — installe auto deps Composer, exécute migrations, démarre PHP-FPM',
  },
  { name: 'ugo_nginx', desc: 'Nginx Alpine — reverse proxy exposé sur port 8080' },
  {
    name: 'ugo_frontend',
    desc: 'Node 20 / Vite — serveur dev hot-reload port 3000, node_modules protégés par volume',
  },
  { name: 'ugo_phpmyadmin', desc: 'phpMyAdmin — interface GUI base de données port 8081' },
];

export const approachCards: ApproachCard[] = [
  {
    title: 'Docker en premier',
    body: 'La pile entière est conteneurisée dès le départ — aucune installation locale de PHP ou Node requise. Les volumes nommés préservent les dépendances installées entre redémarrages conteneurs pour une expérience développeur rapide.',
  },
  {
    title: 'API Platform + Hydra',
    body: 'API Platform génère des endpoints REST avec Hydra JSON-LD, offrant pagination intégrée, filtrage et documentation OpenAPI à /api/docs sans écrire un seul contrôleur.',
  },
  {
    title: 'Frontend basé features',
    body: "Le frontend suit une architecture basée features: shared (composants, hooks, types, utils) et modules features (customers). React Query gère l'état serveur, gardant les composants libres de logique fetch.",
  },
  {
    title: 'Sécurité des types',
    body: 'TypeScript strict partout — les types et interfaces sont co-localisés avec leur composant ou feature, plutôt que dans un fichier central, gardant chaque module autonome et plus facile à maintenir.',
  },
  {
    title: 'Import CSV robuste',
    body: "La commande d'import valide chaque ligne (détection vides, champs requis, vérifications format), persiste enregistrements valides par lots de 50, et écrit lignes rejetées dans data/errorImport/ avec colonne raison lisible.",
  },
  {
    title: 'Variables CSS + Mode sombre',
    body: 'Un thème global est défini comme propriétés custom CSS dans global.css, référencé par config Tailwind. Le toggle mode sombre bascule classe .dark sur <html> et persiste préférence dans localStorage.',
  },
];
