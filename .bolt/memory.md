# Project memory

## Product intent & audience

- Projet web avec page d'accueil `index.html` et dossier `public/` pour les assets statiques.
- Public et objectifs précis non encore déterminés.

## Brand personality & voice

- Communication utilisateur en français, ton technique et direct.
- Instructions précises orientées vérification/conformité (ne rien modifier d'autre).

## Visual design & UX direction

- Favicons configurés avec 3 balises dans le `<head>` de `index.html` : `/favicon.ico`, `/favicon-192.png`, `/apple-touch-icon.png`.
- Fichiers favicon présents dans `public/` : `favicon.ico`, `favicon-48.png`, `favicon-192.png`, `apple-touch-icon.png`.
- Tailles standard : 48×48 (favicon-48), 192×192 (favicon-192), apple-touch-icon.

## Decisions, constraints & rationale

- Le projet n'est pas un dépôt git dans cet environnement ; synchronisation GitHub impossible directement (branche main attendue côté utilisateur).
- Vérification favicon confirmée : balises `<head>` et fichiers `public/` corrects, intégrés au build de sortie.
- Contrainte explicite : ne rien modifier d'autre lors des vérifications.

## Open questions & assumptions

- URL/propriétaire du dépôt GitHub distant inconnus.
- Stack/framework de build non identifié (un dossier de sortie de build existe).
- Audience cible et objectifs produit restent à préciser.