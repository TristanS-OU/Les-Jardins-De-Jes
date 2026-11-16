import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { copyFileSync, existsSync } from 'node:fs';

// Site HTML statique de 7 pages. Tous les fichiers sont à la racine du projet (aucun dossier).
// Ce plugin adapte les chemins écrits dans les pages (css/…, js/…, photos/…, img/…) vers la racine.
const aplat = () => ({
  name: 'jardins-de-jes-chemins-a-plat',
  enforce: 'pre',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      return html
        .replace(/<script src="js\/main\.js"[^>]*><\/script>/g, '<script type="module" src="/main.js"></script>')
        .replace(/(["'(])css\/style\.css/g, '$1/style.css')
        .replace(/(["'(])photos\//g, '$1/')
        .replace(/(["'(])img\//g, '$1/')
        .replace(/lesjardinsdejes\.fr\/img\//g, 'lesjardinsdejes.fr/');
    },
  },
  closeBundle() {
    // fichiers à copier tels quels à la racine du site publié
    for (const f of ['robots.txt', 'sitemap.xml', 'llms.txt', 'og-image.jpg', 'logo.svg', 'icone.svg']) {
      if (existsSync(f)) copyFileSync(f, resolve('dist', f));
    }
  },
});

export default defineConfig({
  plugins: [aplat()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        gazon: resolve(__dirname, 'gazon-synthetique.html'),
        terrasses: resolve(__dirname, 'terrasses-bois.html'),
        allees: resolve(__dirname, 'allees-bordures-murets.html'),
        galerie: resolve(__dirname, 'galerie.html'),
        mentions: resolve(__dirname, 'mentions-legales.html'),
        confidentialite: resolve(__dirname, 'politique-confidentialite.html'),
      },
    },
  },
});
