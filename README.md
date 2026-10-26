# RISHI

RISHI est une application communautaire de collection de cartes anime/manga, pensée pour une V1 fonctionnelle en mode démonstration locale et prête à évoluer vers Supabase.

## Démarrage

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```

## GitHub Pages

Le projet est prêt pour le déploiement statique sur GitHub Pages avec Vite.

```bash
npm run deploy
```

Ou bien publiez le dossier `dist/` via GitHub Pages / GitHub Actions.

## Modes

- Mode local : sauvegarde dans le navigateur via localStorage.
- Mode cloud : prêt pour l’authentification Supabase et les données distantes.

## Structure principale

- `src/App.tsx` : application et navigation
- `src/data/cards.ts` : catalogues, univers, cartes et boosters de démonstration
- `src/styles.css` : UI premium sombre

## Variables d’environnement

Un exemple public est fourni dans `.env.example`.

## Limites

Cette V1 correspond à une démonstration jouable locale, conçue pour être étendue avec Supabase, sécurité serveur et données partagées.
