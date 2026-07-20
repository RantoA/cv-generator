# CV Generator

Gestionnaire de CV professionnels multi-CV, entièrement en français : créez, personnalisez et exportez plusieurs CV depuis un tableau de bord unique.

## Stack

- **Frontend** : React 19, TypeScript, Vite, React Router, React Hook Form + Zod, Zustand, TanStack Query, Tailwind CSS (composants façon Shadcn UI), Lucide React, Framer Motion, dnd-kit, html2pdf.js
- **Backend** : Node.js + Express, persistance dans `server/data/db.json`

## Démarrage

```bash
pnpm install
pnpm dev
```

Cela lance en parallèle :
- le client Vite sur http://localhost:5173
- l'API Express sur http://localhost:4000 (proxifiée par Vite sous `/api`)

Un CV de démonstration ("Jean Dupont") est préchargé dans `server/data/db.json` au premier lancement.

## Scripts

| Commande | Description |
| --- | --- |
| `pnpm dev` | Client + serveur en développement |
| `pnpm dev:client` | Client Vite seul |
| `pnpm dev:server` | Serveur Express seul |
| `pnpm build` | Build de production du client |
| `pnpm lint` | Lint ESLint |

## Architecture

Architecture feature-based sous `src/` :

```
src/
  app/            Routage, providers, layout global
  features/
    dashboard/    Tableau de bord (liste, recherche/tri/filtres, actions CRUD)
    cv-editor/    Éditeur de CV (sections, glisser-déposer, undo/redo, autosave)
    cv-preview/   Templates de rendu, export PDF, aperçu plein écran
  shared/         Composants UI réutilisables (façon Shadcn), hooks partagés
  stores/         Zustand (éditeur + historique, thème/dark mode)
  services/       Client API + hooks TanStack Query
  validations/    Schémas Zod par section
  types/          Types TypeScript du modèle de CV
  utils/          Fabriques d'entités, formatage de dates, PDF, identifiants
server/
  index.js        Bootstrap Express
  routes/         Routes CRUD /api/cvs
  store/          Lecture/écriture du fichier JSON, valeurs par défaut
  data/db.json    Données persistées (généré/seedé automatiquement)
```

## Fonctionnalités

- Tableau de bord multi-CV : recherche, tri, filtre par modèle, pagination
- Édition par sections : informations personnelles, expériences (avec missions), compétences techniques, hard/soft skills, formation, langues
- Glisser-déposer (souris et clavier) pour réordonner expériences, missions, compétences, badges et sections
- Undo/Redo (`Ctrl+Z` / `Ctrl+Shift+Z`), auto-sauvegarde, confirmation avant suppression
- Aperçu en temps réel + mode plein écran
- Deux modèles de CV (Modern, Classique), couleur principale et police personnalisables par CV
- Export PDF fidèle au design, thème clair/sombre, responsive desktop/tablette/mobile

## Portée non couverte (évolutions futures)

L'architecture (couche `services/api` isolée, types extensibles) est prête à accueillir authentification, synchronisation cloud, import LinkedIn/PDF, génération IA, thèmes premium, etc., mais ces fonctionnalités ne sont pas implémentées dans cette version.
