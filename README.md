# 📝 Blog Laravel Personnel

Un blog moderne et complet développé avec Laravel et React, offrant une expérience utilisateur riche et un système d'administration avancé.

## 🌟 Aperçu du Projet

Ce projet est un système de blog personnel full-stack qui combine la puissance de Laravel pour le backend avec une interface moderne React/TypeScript. Il propose un système de gestion de contenu complet, un tableau de bord administrateur, un système de newsletter intégré, et bien plus encore.

## ✨ Fonctionnalités Principales

### 🔐 Système d'Authentification
- **Inscription et connexion** avec validation email
- **Réinitialisation de mot de passe** sécurisée
- **Vérification d'email** obligatoire
- **Gestion des profils** utilisateur avec avatar et bio
- **Système de rôles** (Administrateur/Utilisateur)

### 📚 Gestion de Blog
- **CRUD complet des articles** avec éditeur rich-text
- **Système de brouillons** et publication différée
- **Gestion des catégories** avec hiérarchie
- **Système de tags** pour l'organisation du contenu
- **Upload d'images** et gestion des médias
- **URLs SEO-friendly** avec slugs automatiques

### 💬 Système de Commentaires
- **Commentaires modérés** avec workflow d'approbation
- **Réponses imbriquées** pour les discussions
- **Protection anti-spam** intégrée
- **Notifications** pour les nouveaux commentaires

### 📧 Newsletter Intégrée
- **Gestion des abonnements** avec double opt-in
- **Envoi automatique** des nouveaux articles
- **Templates personnalisables** pour les emails
- **Intégration Gmail SMTP** configurée
- **Statistiques d'ouverture** et de clics

### 📊 Tableau de Bord Admin
- **Dashboard complet** avec métriques en temps réel
- **Gestion des utilisateurs** et permissions
- **Statistiques détaillées** des vues et interactions
- **Modération des commentaires** centralisée
- **Gestion des newsletters** et abonnés

### 🔍 Fonctionnalités Avancées
- **Recherche full-text** dans les articles
- **Système de vues** et analytics
- **Mode sombre** automatique
- **Design responsive** mobile-first
- **Cache intelligent** pour les performances
- **Optimisation SEO** intégrée

## 🛠️ Stack Technologique

### Backend
- **Framework**: Laravel 12
- **PHP**: Version 8.2+
- **Base de données**: MySQL
- **Cache**: Redis (optionnel)
- **Queue**: Database/Redis
- **Email**: Gmail SMTP

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **CSS Framework**: Tailwind CSS
- **State Management**: Inertia.js
- **UI Components**: 
  - Radix UI
  - Headless UI
  - Heroicons
  - Lucide React

### Outils de Développement
- **Testing**: Pest PHP
- **Linting**: ESLint
- **Formatting**: Prettier
- **Package Manager**: npm/Composer
- **Version Control**: Git

## 📋 Prérequis

- **PHP 8.2+** avec extensions requises
- **Composer** pour la gestion des dépendances PHP
- **Node.js 18+** et npm
- **MySQL 8.0+** ou MariaDB
- **Git** pour le contrôle de version

## 🚀 Installation

### 1. Clonage du Projet
```bash
git clone https://github.com/Rafik226/Blog-Laravel-React.git
cd blog
```

### 2. Installation des Dépendances Backend
```bash
composer install
```

### 3. Installation des Dépendances Frontend
```bash
npm install
```

### 4. Configuration de l'Environnement
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate
```

### 5. Configuration de la Base de Données
Éditez le fichier `.env` avec vos paramètres de base de données :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blog_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Configuration Email (Gmail)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### 7. Migration et Données de Test
```bash
# Exécuter les migrations
php artisan migrate

# Seeder (optionnel)
php artisan db:seed
```

### 8. Génération des Assets
```bash
# Développement
npm run dev

# Production
npm run build
```

### 9. Démarrage du Serveur
```bash
# Serveur de développement Laravel
php artisan serve

# Serveur Vite (dans un autre terminal)
npm run dev
```

## 🔧 Configuration Avancée

### Newsletter Gmail
1. Activez l'authentification à 2 facteurs sur votre compte Gmail
2. Générez un mot de passe d'application spécifique
3. Testez la configuration avec : `php artisan test:email your@email.com`

### Optimisation Production
```bash
# Cache des configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimisation Composer
composer install --optimize-autoloader --no-dev
```

## 📖 Utilisation

### Interface Utilisateur
- Accédez à `http://localhost:8000` pour l'interface publique
- Créez un compte ou connectez-vous
- Explorez les articles, catégories et fonctionnalités

### Panel Administrateur
- Connectez-vous avec un compte administrateur
- Accédez à `/admin` pour le tableau de bord
- Gérez les articles, utilisateurs, commentaires et newsletter

### Commandes Artisan Utiles
```bash
# Test de configuration email
php artisan test:email user@example.com

# Nettoyage des caches
php artisan optimize:clear

# Génération de données de test
php artisan db:seed
```

## 🏗️ Structure du Projet

```
blog/
├── app/
│   ├── Console/Commands/     # Commandes Artisan personnalisées
│   ├── Http/Controllers/     # Contrôleurs de l'application
│   ├── Models/              # Modèles Eloquent
│   ├── Mail/                # Classes de mail
│   └── Policies/            # Politiques d'autorisation
├── resources/
│   ├── js/                  # Code React/TypeScript
│   ├── css/                 # Styles Tailwind
│   └── views/               # Templates Blade
├── routes/
│   ├── web.php              # Routes principales
│   ├── auth.php             # Routes d'authentification
│   └── settings.php         # Routes de paramètres
└── database/
    ├── migrations/          # Migrations de base de données
    └── seeders/            # Seeders de données
```

## 🧪 Tests

```bash
# Exécuter tous les tests
php artisan test

# Tests avec couverture
php artisan test --coverage
```

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request


## 🐛 Rapporter des Bugs

Si vous trouvez un bug, veuillez ouvrir une issue en décrivant :
- Le comportement attendu
- Le comportement actuel
- Les étapes pour reproduire
- Votre environnement (OS, PHP, etc.)

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à me contacter.

---

**Développé avec ❤️ en utilisant Laravel et React**
