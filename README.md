# RISHI

RISHI est une application web de collection de cartes anime/manga en mode local-first, pensée pour évoluer vers un backend Supabase réel.

## Démarrage rapide

1. Clonez le dépôt.
2. Installez les dépendances : `npm install`
3. Démarrez le projet : `npm run dev`
4. Construisez le projet : `npm run build`

## Modes disponibles

- Mode local : sauvegarde auto dans le navigateur, usage immédiat sans backend.
- Mode en ligne : configuration Supabase via variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.

## Déploiement GitHub Pages

Le projet est configuré avec `vite.config.ts` et `base: './'` pour un déploiement compatible GitHub Pages.

1. `npm install`
2. `npm run build`
3. Uploadez le dossier `dist/` dans GitHub Pages ou via GitHub Actions.

## Structure

- `src/App.tsx` : logique principale et navigation.
- `src/data/cards.ts` : catalogue, univers, boosters et données démonstration.
- `src/styles.css` : design system et interface.

## Supabase

Le dépôt contient un exemple de configuration publique dans `.env.example`.

Pour le mode en ligne, ajoutez ensuite les tables, migrations et politiques RLS dans votre instance Supabase.

## Limites connues

Cette V1 fonctionne en local, avec une démonstration prête à l'emploi et une architecture adaptée à l'ajout d'un backend réel. Elle ne prétend pas avoir un vrai système d'authentification ou de combat multijoueur sans configuration Supabase.
