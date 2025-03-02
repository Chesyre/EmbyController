# Emby Controller V2

## Description
Version 2 de l'application Emby Controller, développée avec Vue.js 3 et Strapi.

## Prérequis
- Node.js 18+
- MySQL 8+
- npm ou yarn

## Installation

### Frontend (Vue.js)
cd frontend
npm install
npm run dev

### Backend (Strapi)
cd strapi
npm install
npm run develop

## Structure du Projet

### Frontend (/frontend)
- `/src/components` - Composants Vue réutilisables
- `/src/views` - Pages de l'application
- `/src/stores` - Stores Pinia pour la gestion d'état
- `/src/router` - Configuration des routes
- `/src/assets` - Ressources statiques
- `/src/locales` - Fichiers de traduction

### Backend (/strapi)
- `/api` - Modèles et contrôleurs Strapi
- `/config` - Configuration de Strapi
- `/public` - Fichiers statiques
- `/src` - Extensions et personnalisations

## Modèles de Données

### Utilisateurs
- Authentification standard
- Profils utilisateurs
- Rôles et permissions

### Médias
- Gestion des films et séries
- Métadonnées
- Historique de visionnage

### Configuration
- Paramètres système
- Configuration Emby
- Paramètres utilisateur

## API Endpoints

### Authentification
- POST /api/auth/local - Connexion
- POST /api/auth/local/register - Inscription
- GET /api/users/me - Profil utilisateur

### Médias
- GET /api/media - Liste des médias
- GET /api/media/:id - Détails d'un média
- POST /api/media/search - Recherche de médias

### Configuration
- GET /api/settings - Paramètres système
- PUT /api/settings - Mise à jour des paramètres

## Sécurité
- JWT pour l'authentification
- Validation des données
- Protection CSRF
- Rate limiting

## Déploiement
Instructions détaillées pour le déploiement en production à venir.

## Contribution
Merci de suivre les conventions de code et de créer des pull requests pour toute modification.

## Licence
Apache License 2.0