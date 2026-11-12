# ZAYRA V28 — FRONT UNIQUEMENT

Cette archive contient **le site complet FR/AR** et le prototype d’administration local `admin/index.html`. Aucune API, base de données ou connexion réelle n’est fournie.

## Visuels
Nouvelles compositions générées dans `assets/images/v24/products/` pour Mancera French Riviera, Gissah Imperial Valley (versions H/F), Louis Vuitton Imagination (H/F), Nishane Hacivat, Xerjoff Naxos, Jazz Club, Spicebomb Extreme, Le Beau, Le Beau Paradise Garden et 9PM Night Out. Les images sont **illustratives et non contractuelles** : elles doivent être confrontées aux véritables références, flacons et décants avant commercialisation. Certaines autres cartes restent des représentations graphiques; voir `CONTROLE_IMAGES_V28.json`.

## Stock
Depuis `/admin/` → Produits & stocks, définir une quantité. Sur la fiche correspondante apparaît un indicateur discret. Sans quantité renseignée, le site indique « Disponibilité à confirmer » plutôt que d’inventer un stock. Les données restent dans le stockage local du navigateur, **sur la même origine**, avec une mention « démo ». Aucune vente n’entraîne une réservation de stock réelle.

## Administration
`/admin/` est accessible directement et n’est PAS privée ni sécurisée (aucune authentification réelle sans backend). Produits, prix, stocks, activation, brouillons et commandes fictives sont simulés et exportables en JSON. Les modifications d’images sont possibles en saisissant un chemin local `assets/images/...`; il faut ajouter le fichier dans le site. Les mises à jour ne seront pas visibles depuis un autre appareil.

## Lancement
Extraire l’archive et ouvrir `ZAYRA_SITE/index.html`. Pour des essais plus cohérents entre les pages, servir le dossier avec un hébergeur statique local (ex. `python -m http.server 8000` dans `ZAYRA_SITE/`), puis consulter `http://localhost:8000/` et `http://localhost:8000/admin/`. Ce serveur de test ne constitue pas un backend commercial.

## Avant publication
Renseigner les coordonnées, les textes légaux, les conditions de livraison et les stocks réels. Remplacer les illustrations par des photos autorisées et des packagings réellement livrés. Un backend sécurisé reste indispensable pour les commandes et un stock partagé entre clients.
