# UGO - Gestion des commandes clients

Application fullstack : backend Symfony 6.4 / API Platform + frontend React 19 / TailwindCSS, entièrement conteneurisée avec Docker Compose.

---

## Démarrage rapide

### 1. Configurer les variables d'environnement

Copier les fichiers d'exemple et les adapter :

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

> Les fichiers `.env.example` contiennent tous les paramètres nécessaires avec des valeurs par défaut fonctionnelles pour un environnement local.

### 2. Lancer les conteneurs

```bash
docker compose up --build -d
```

| Service         | URL                       |
| --------------- | ------------------------- |
| Frontend (Vite) | http://localhost:3000     |
| API (Nginx)     | http://localhost:8080     |
| phpMyAdmin      | http://localhost:8081     |
| Swagger UI      | http://localhost:8080/api |

Les migrations de base de données s'exécutent automatiquement au premier démarrage.

---

## Documentation de l'API (Swagger / OpenAPI)

La documentation interactive est intégrée via **API Platform** — aucune configuration supplémentaire requise :

| Interface                              | URL                                   |
| -------------------------------------- | ------------------------------------- |
| **Swagger UI** (interface principale)  | http://localhost:8080/api             |
| **ReDoc** (lecture seule)              | http://localhost:8080/api/docs        |
| **JSON-LD / Hydra** (machine-readable) | http://localhost:8080/api/docs.jsonld |

Swagger UI permet de tester tous les endpoints directement depuis le navigateur (GET, POST, PUT, DELETE).

---

## Interface frontend

L'interface est accessible sur **http://localhost:3000** et comprend les sections suivantes :

| Page          | URL           | Description                                       |
| ------------- | ------------- | ------------------------------------------------- |
| **Accueil**   | `/`           | Page d'accueil avec liens de navigation           |
| **Clients**   | `/customers`  | Liste paginée et recherchable de tous les clients |
| **Commandes** | `/orders/:id` | Détail des commandes d'un client spécifique       |
| **À propos**  | `/about`      | Description détaillée du test technique           |

---

## Support IDE (autocomplétion locale)

Pour avoir l'autocomplétion et éviter les faux positifs dans VS Code, installer les dépendances en local :

```bash
# Backend
cd backend && composer install

# Frontend
cd frontend && npm install
```

> Les volumes Docker nommés (`backend_vendor`, `frontend_node_modules`) protègent les dépendances dans les conteneurs — l'installation locale n'affecte pas Docker.

---

## Importer les données CSV

```bash
docker exec ugo_php php bin/console ugo:orders:import
```

Lit `data/customers.csv` et `data/purchases.csv`.  
Les lignes invalides sont écrites dans :

- `data/errorImport/customers_errors.csv`
- `data/errorImport/purchases_errors.csv`

Chemins personnalisés :

```bash
docker exec ugo_php php bin/console ugo:orders:import \
  --customers-file=data/clients.csv \
  --purchases-file=data/commandes.csv
```

---

## Lancer les tests

**Backend (PHPUnit) :**

```bash
docker exec ugo_php vendor/bin/phpunit
```

**Frontend (Vitest) :**

```bash
docker exec ugo_frontend npm test
```

**Frontend - exécution unique (CI) :**

```bash
docker exec ugo_frontend npm run test -- --run
```

---

## Build frontend (production)

```bash
docker exec ugo_frontend npm run build
```

---

## Stack technique

| Couche            | Technologie                                   |
| ----------------- | --------------------------------------------- |
| Langage           | PHP 8.2 / TypeScript 5.6                      |
| Framework backend | Symfony 6.4                                   |
| API REST          | API Platform 3.2 (Hydra JSON-LD)              |
| ORM               | Doctrine ORM 2.17                             |
| Base de données   | MySQL 8.0                                     |
| Tests backend     | PHPUnit 10.5                                  |
| UI library        | React 19                                      |
| Build tool        | Vite 6                                        |
| CSS               | TailwindCSS 3.4 (variables CSS + mode sombre) |
| État serveur      | React Query 5                                 |
| Routing           | React Router 7                                |
| Tests frontend    | Vitest 2 + Testing Library 16                 |
| Infrastructure    | Docker Compose, Nginx Alpine                  |
