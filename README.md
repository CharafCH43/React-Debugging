# TechStore — Checkpoint Débogage React

Application web développée avec **React 19** et **Vite**, réalisée dans le cadre du checkpoint sur le débogage avec **React Developer Tools**.

---

## Fonctionnalités de l'Application

- **Catalogue Produits :** Recherche par mot-clé, filtrage par catégorie (Audio, Périphériques, Écrans, Accessoires, Stockage), tri dynamique par prix et note.
- **Gestion du Panier :** Ajustement des quantités, suppression d'articles, gestion de codes promotionnels (`DEV10`, `GMC20`, `CHARF30`), calcul de TVA (19%) et simulation de commande.
- **Compte Client (Charf Eddine) :** Coordonnées de livraison, statut fidélité et gestion défensive des données nulles.
- **Bascule de Simulation d'Anomalies :** Un bouton dans l'en-tête permet de basculer à tout moment entre la version corrigée et la version présentant les anomalies afin de reproduire et diagnostiquer les 5 bugs pas à pas dans React DevTools.
- **Espace Diagnostic Intégré :** Synthèse comparative présentant le code avant/après correction pour chaque cas étudié.
- **Guide React DevTools :** Documentation méthodologique intégrée rappelant le fonctionnement des onglets Components, Profiler et du raccourci console `$r`.

---

## Installation et Démarrage

### 1. Prérequis
- Node.js (version 18 ou supérieure)
- L'extension **React Developer Tools** installée sur votre navigateur (Chrome, Firefox ou Edge).

### 2. Lancement en Mode Développement
```bash
cd react-debugging-checkpoint
npm run dev
```
L'application est accessible à l'adresse : `http://localhost:5173`.

### 3. Compilation pour Production
```bash
npm run build
```

---


---

## Documentation Complète

Le rapport complet de débogage détaillant chaque anomalie, sa cause et son correctif est consultable dans :
- [DEBUGGING_REPORT.md](./DEBUGGING_REPORT.md)
