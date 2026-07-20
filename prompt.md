Agis comme un Architecte logiciel senior spécialisé en React, TypeScript et UX/UI.

Tu dois développer une application web complète permettant de créer, gérer et personnaliser plusieurs CV professionnels entièrement en français.

Le projet doit être pensé comme un véritable gestionnaire de CV moderne, évolutif et prêt pour la production.

Le code doit respecter les meilleures pratiques de développement, être fortement typé, modulaire, réutilisable et facilement maintenable.

# Technologies

- React 19
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- Zustand
- TanStack Query
- Material UI ou Shadcn UI
- Lucide React
- Framer Motion
- DnD Kit
- html2pdf.js

Architecture claire par fonctionnalités (Feature-Based Architecture).

---

# Langue

Toute l'application est en français :

- menus
- boutons
- formulaires
- messages
- validations
- notifications
- aperçu du CV

---

# Identité graphique

L'application doit posséder une interface moderne.

Couleur principale :

#2563EB

Palette :

Primaire : #2563EB

Fond : #FFFFFF

Fond secondaire : #F8FAFC

Texte : #1F2937

Texte secondaire : #6B7280

Bordures : #E5E7EB

Le design doit être minimaliste avec beaucoup d'espaces blancs.

Les composants doivent utiliser :

- coins légèrement arrondis
- ombres très discrètes
- animations fluides
- transitions élégantes

---

# Tableau de bord

Afficher tous les CV créés.

Chaque carte contient :

- Nom du CV
- Nom du candidat
- Nombre d'expériences
- Nombre de compétences
- Date de création
- Dernière modification

Actions :

Modifier

Dupliquer

Supprimer

Exporter PDF

Aperçu

Prévoir :

- recherche
- tri
- filtres
- pagination

---

# Gestion des CV

L'utilisateur peut :

Créer un nouveau CV

Modifier un CV

Supprimer un CV

Dupliquer un CV existant

Lors de la duplication :

Toutes les données sont copiées.

Un nouvel identifiant est généré.

Le nom devient automatiquement :

Nom du CV (Copie)

---

# Sections du CV

## Informations personnelles

- Nom complet
- Titre professionnel
- Téléphone
- Email
- Adresse
- Années d'expérience

---

## Expériences professionnelles

Chaque expérience contient :

- Poste
- Entreprise
- Ville
- Pays
- Date de début
- Date de fin

Une liste dynamique de missions.

L'utilisateur peut :

Ajouter

Modifier

Supprimer

Dupliquer

Réordonner les expériences par glisser-déposer

Réordonner les missions

---

## Compétences techniques

Présenter sous forme d'un tableau dynamique.

Chaque ligne contient :

Catégorie

Liste des technologies

Exemple :

Backend

FastAPI, Django

Frontend

React, Next.js

Langages

Python, TypeScript

L'utilisateur peut :

Ajouter

Modifier

Supprimer

Dupliquer une ligne

Réordonner

---

## Hard Skills

Liste dynamique de badges.

Ajouter

Modifier

Supprimer

Réordonner

---

## Soft Skills

Même fonctionnement.

---

## Parcours académique

Chaque élément contient :

Établissement

Ville

Diplôme

Parcours

Date d'obtention

Ajouter

Modifier

Supprimer

Dupliquer

Réordonner

---

## Langues

Chaque langue contient :

Nom

Niveau

Ajouter

Modifier

Supprimer

Réordonner

---

# Fonctionnalités avancées

Auto-sauvegarde.

Validation des formulaires avec Zod.

Notifications Toast.

Confirmation avant suppression.

Historique Annuler / Rétablir (Undo / Redo).

Gestion des brouillons.

Prévisualisation en temps réel.

Mode plein écran pour l'aperçu.

---

# Personnalisation

L'utilisateur peut :

Choisir parmi plusieurs modèles de CV.

Modifier la couleur principale.

Changer les polices.

Réorganiser les sections par glisser-déposer.

Afficher ou masquer des sections.

Modifier l'ordre des sections.

Créer plusieurs versions d'un même CV.

---

# Export

Exporter en PDF.

Respecter exactement le design du CV.

Conserver les polices, les espacements et les couleurs.

---

# UX

Interface très fluide.

Temps de réponse instantané.

Animations discrètes avec Framer Motion.

Responsive Desktop / Tablette / Mobile.

Accessibilité (ARIA).

Dark Mode.

Navigation clavier.

---

# Architecture

Utiliser une architecture Feature-Based.

Séparer :

- composants UI
- logique métier
- hooks
- services
- stores
- types
- validations
- utilitaires

Chaque composant doit être réutilisable.

Le code doit être propre, documenté et facilement extensible.

---

# Évolutions futures

Prévoir une architecture permettant d'ajouter facilement :

- authentification utilisateur
- synchronisation cloud
- import/export JSON
- import LinkedIn
- import PDF
- génération automatique du CV avec une IA
- traduction multilingue
- gestion de thèmes
- partage public du CV
- modèles premium
- système de versions
- historique complet des modifications

L'objectif est de produire une application de qualité professionnelle, comparable à Resume.io, Novoresume ou Canva, tout en conservant une interface épurée utilisant principalement la couleur #2563EB.