# MedSpace AI - Medical Student SaaS Platform

Une plateforme complète d'éducation médicale pour les étudiants en Algérie, inspirée par MedSpaceDZ mais modernisée avec Next.js 15, shadcn/ui et l'IA.

## Fonctionnalités

- **Landing Page Premium** : Design moderne avec glassmorphism, sections dynamiques et responsive.
- **Tableau de Bord Étudiant** : Suivi de progression, accès aux supports de cours et moteurs de quiz.
- **Moteur de Quiz** : Correction instantanée, explications détaillées et références aux cours.
- **Administration** : Gestion complète des spécialités, facultés, cours, quiz et étudiants.
- **Authentification** : Système sécurisé avec NextAuth.js (Auth.js v5).
- **Dockerisé** : Déploiement facile avec Docker et Docker Compose.

## Tech Stack

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **Base de données** : PostgreSQL + Prisma ORM
- **Auth** : NextAuth.js
- **Animations** : Framer Motion
- **Icônes** : Lucide React

## Installation Locale

### 1. Cloner le projet
```bash
git clone <repository-url>
cd medspacedz
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
Créez un fichier `.env` à la racine du projet :
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medspacedz?schema=public"
NEXTAUTH_SECRET="votre-secret-ici"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Lancer la base de données (Docker)
```bash
docker compose up -d db
```

### 5. Initialiser Prisma et Seeder les données
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 6. Lancer le serveur de développement
```bash
npm run dev
```

## Utilisation de Docker

Pour lancer toute l'application (App + DB) avec Docker :

```bash
docker compose up --build
```

L'application sera accessible sur `http://localhost:3000`.

## Données de Test (Seed)

L'utilisateur administrateur par défaut :
- **Email** : `admin@medspace.dz`
- **Mot de passe** : `admin123`

## Structure du Projet

- `src/app` : Routes et pages Next.js
- `src/components` : Composants UI (landing, dashboard, admin)
- `src/lib` : Utilitaires et configurations (Prisma, Auth)
- `prisma` : Schéma de base de données et scripts de seed
- `public` : Assets statiques
