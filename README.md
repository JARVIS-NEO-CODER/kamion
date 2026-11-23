# KAMION

Site de la marque KAMION : la Boutique (mods et produits), le Convoi (communauté gamers), le Dépôt (espace communautaire).

## Structure
- `index.html` : accueil
- `boutique.html` : la boutique, rend les produits depuis `products.json`
- `convoi.html` : la branche communauté
- `depot.html` : galerie, tutos, news
- `products.json` : LA source des produits. Pour ajouter un produit : ajouter un objet `{"id","name","type" ("digital"|"physique"),"price","status","desc"}` puis push, Netlify redéploie tout seul.
- `img/` : visuels.

## Enrichissement automatique
Toutes les 2 jours : ajouter 1 à 10 produits viraux dans `products.json` (digitaux ET physiques), sans dépenser un euro, puis commit + push. Les images de produits arrivent plus tard (photos réelles de Carl).
