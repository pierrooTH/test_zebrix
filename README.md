## Fonctionnalités

-   Authentification JWT avec le web service national
-   Récupération des produits disponibles
-   Filtrage des produits hors stock
-   Mise en avant des produits avec DLC à J+3 (remise de 30%)
-   Tri des produits par prix décroissant
-   Mise en cache des données avec Redis

## Prérequis

-   Node.js
-   Docker et Docker Compose

## Installation

1. Cloner le dépôt:

```bash
git clone
cd test_zebrix
```

2. Copier le fichier `.env.example` en `.env` et configurer les variables d'environnement:

```bash
cp .env.example .env
```

## Démarrage avec Docker

```bash
docker compose up -d
```

L'API sera disponible à l'adresse: `http://localhost:3000`

## Démarrage sans Docker

1. Installer les dépendances:

```bash
npm install
```

2. Démarrer Redis séparément (ou modifier la configuration pour utiliser une instance Redis externe).

3. Démarrer l'application:

```bash
npm start
```

Pour le développement:

```bash
npm run dev
```

## Utilisation de l'API

### Récupérer les produits filtrés

```
GET /api/products
```

Réponse:

```json
{
    "featuredProducts": [
        {
            "id": "9999",
            "name": "Produit Test",
            "price": "6.99",
            "dlc": "2022-01-31T00:28:13.383Z",
            "stock": 32
        }
    ],
    "standardProducts": [
        {
            "id": "1",
            "name": "Produit Standard",
            "price": "200",
            "dlc": "2022-02-14T20:05:05.102Z",
            "stock": 25
        }
    ]
}
```

## Architecture

-   `src/app.js`: Point d'entrée de l'application
-   `src/routes/`: Définition des routes de l'API
-   `src/controllers/`: Contrôleurs pour gérer les requêtes
-   `src/services/`: Services métier
-   `src/config/`: Configuration de l'application
-   `src/middleware/`: Middleware pour gérer le cache et les erreurs
-   `src/utils/`: Utilitaires

## Stratégie de cache

Pour limiter les appels vers le web service national, les stratégies suivantes ont été mises en place:

1. **Cache du token JWT**: Le token est mis en cache pendant une durée légèrement inférieure à sa validité
2. **Cache des produits**: Les produits sont mis en cache pour éviter des appels répétés
