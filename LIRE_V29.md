# ZAYRA V29 — FRONT UNIQUEMENT

## Contenu
Boutique bilingue (FR/AR) et maquette `/admin/`. Aucun backend, aucune API de paiement ou commande réelle. 41 offres du catalogue, avec packs existants.

## Espace administration
Ouvrir `/admin/` (ou `admin/index.html`) pour :
- Tableau de bord et alertes de stock de démonstration
- Catalogue : noms FR/AR, catégories, prix, disponibilité, images, activation
- Stocks : journal des entrées/sorties simulées et seuil d'alerte
- Packs : sélection locale des références et prix
- Commandes : simulation des statuts, création de commandes fictives, export CSV
- Brouillons, médiathèque, export et import JSON

Les modifications se répercutent sur les pages publiques **sur la même origine et le même navigateur**, après actualisation. Elles ne changent pas les fichiers HTML sur disque et ne sont pas partagées avec les clients.

### Photos importées
Une photo importée dans l'admin est compressée en WebP et stockée dans localStorage. Pour un site réel, les photos doivent être intégrées dans les fichiers publics et validées. L'export JSON inclut les changements locaux, mais les navigateurs imposent une limite de stockage.

## Installation de prévisualisation Windows
Extraire le ZIP. Pour tester la cohérence des données entre les pages, ouvrir un terminal dans le dossier racine contenant `index.html`, puis utiliser `py -m http.server 8000` (Python requis) et visiter `http://localhost:8000/` et `http://localhost:8000/admin/`.
Le serveur sert uniquement des fichiers statiques, ce n'est **pas** un backend commercial.

## Limites essentielles
L'URL `/admin/` est volontairement non listée dans la navigation, MAIS ELLE N'EST PAS PROTÉGÉE. Aucun moyen de sécuriser les stocks, les commandes ni un login avec uniquement du JavaScript côté client. Aucun système de commande réel ne collecte les données de clients. Les quantités sont démonstratives, et un achat ne réserve pas d'unités.

## Images
Les 4 dernières compositions ajoutées concernent 9PM Rebel, Valentino Born in Roma Intense, Arabians Tonka et Ultra Male. Les autres images précédemment générées sont conservées. Les images produites par IA ne garantissent pas que les flacons et les étiquettes correspondent aux références officielles ; valider chaque visuel avant publication.

## Publication future
Renseigner les données commerciales réelles, mettre en place une API / base de données et une authentification sécurisée pour un vrai espace admin, et remplacer les visuels illustratifs problématiques par des photos autorisées.
