# UGO - Gestion des commandes clients

Application fullstack : backend Symfony 6.4 / API Platform + frontend React 19 / TailwindCSS, entièrement conteneurisée avec Docker Compose.

---

## Démarrage rapide

```bash
docker compose up --build -d
```

| Service         | URL                   |
| --------------- | --------------------- |
| Frontend (Vite) | http://localhost:3000 |
| API (Nginx)     | http://localhost:8080 |
| phpMyAdmin      | http://localhost:8081 |

Les migrations de base de données s'exécutent automatiquement au premier démarrage.

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
