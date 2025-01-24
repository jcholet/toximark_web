# Toximark Web | Tennaxia x ESIEA [![My Skills](https://skillicons.dev/icons?i=react,supabase,js)](https://skillicons.dev)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Ce projet a été développé dans le cadre de la 8ᵉ édition de la Digital Consulting Week (DCW), un événement collaboratif organisé conjointement par l'ESIEA et SKEMA Business School (20 au 25 janvier 2025). Cet événement offre l'opportunité de développer des solutions innovantes en réponse aux défis actuels du secteur numérique.

---
## Objectif du projet 🎯 

L'objectif de ce projet était de développer un prototype d'application permettant à un producteur de déchets et un transporteur d'effectuer sur smartphone une signature électronique manuscrite et géolocalisée, en réponse à la problématique posée par Tennaxia, partenaire de la performance durable des entreprises et des investisseurs depuis plus de 20 ans.

---
## Technologies utilisées 🛠️

* **[React](https://reactjs.org/)** : Bibliothèque JavaScript pour la création d'interfaces utilisateur modernes et réactives
  
* **[Supabase](https://supabase.com/)** : Plateforme open-source offrant des services backend tels que l'authentification, la base de données et le stockage
  
* **[JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)** : Langage de programmation utilisé pour le développement frontend

---
## Fonctionnalités principales ✨

* Signature électronique manuscrite géolocalisée
* Affichage des différents ramassages
* Interface responsive adaptée aux appareils mobiles
* Authentification sécurisée
* Stockage des données en temps réel

---
## Structure du Projet 🏗️

Le projet suit une architecture modulaire basée sur les composants React :
src/
├── components/ # Composants réutilisables
├── pages/ # Pages de l'application
├── services/ # Services (API Supabase)
├── hooks/ # Hooks personnalisés
└── utils/ # Utilitaires et helpers

---
## Démarrer l'application 🚀

1. Clonez le repository
```
git clone https://github.com/jcholet/toximark_web.git
```

2. Installez les dépendances :
```
npm install
```


3. Créez un fichier `.env` avec vos variables d'environnement :
```
REACT_APP_SUPABASE_URL=votre_url_supabase
REACT_APP_SUPABASE_ANON_KEY=votre_clé_anon
```

4. Lancez l'application en mode développement :
```
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

---
### Scripts disponibles

* `npm start` : Lance l'application en mode développement
* `npm test` : Lance les tests
* `npm run build` : Crée une version de production
* `npm run eject` : Permet d'éjecter la configuration CRA

_\*Toximark Web fonctionne sur tous les navigateurs modernes._

---
## Licence 📄

Ce projet est sous licence GPL v3. Voir le fichier LICENSE pour plus de détails.
