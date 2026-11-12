# ZAYRA — V30 FRONT-ONLY

**Nouveautés V30 :** 9 visuels optimisés et intégrés aux produits correspondants, inventaire rapide CSV, médiathèque complète, atelier SEO, amélioration des extraits de recherche et de Product JSON-LD. Voir `LIRE_V30.md` pour le détail.

Boutique statique de décants 10 ml et coffrets en français et arabe (RTL), avec images locales, catalogue, fiches, paniers, galerie et un espace `/admin/` de démonstration.

**Aucun backend, API, Node.js, base de données ou compte administrateur n'est inclus.**

## Ouvrir le site

- Pour un aperçu simple, ouvrez `index.html`.
- Recommandé pour tester le panier et les données de démonstration entre pages : lancez le fichier `OUVRIR_ZAYRA_WINDOWS.bat` (Python installé), ou sur Mac/Linux `OUVRIR_ZAYRA_MAC_LINUX.sh` (Python 3 requis). Ces scripts ouvrent uniquement un serveur statique local, **pas un backend**.
- Sous une URL statique, ouvrez `/admin/` ou `admin/index.html`. Aucun lien admin n'apparaît dans la navigation publique.

## Admin prototype

`/admin/` permet d'essayer un tableau de bord, de modifier localement les prix / stocks, de préparer des brouillons, de créer des **commandes fictives**, de modifier leur statut et d'exporter/importer les données de simulation JSON.

Les changements sont stockés dans `localStorage` et restent dans le navigateur et l'origine où ils ont été faits. Si le site est ouvert via `file://`, la persistance peut varier selon le navigateur. Pour visualiser les prix modifiés en boutique, actualisez les pages sur le même navigateur après modification dans `/admin/`.

**ATTENTION : `/admin/` n'est pas sécurisé.** L'absence de lien public ne rend pas la page privée. Ne stockez **aucune donnée client réelle**, ne saisissez **aucun secret**, et ne mettez pas cet admin en ligne pour gérer des vraies commandes. Les stocks et prix saisis côté client ne peuvent pas être considérés comme faisant autorité.

## Panier et commandes

Le panier fonctionne comme maquette. Il peut générer un récapitulatif à transmettre au marchand. Il n'enregistre pas et ne transmet pas automatiquement de commande. Dans `assets/settings.js`, les coordonnées pro doivent être définies par le propriétaire. Ne présentez pas une commande comme reçue tant qu'un canal de réception réel n'existe pas.

## SEO et mise en ligne

Remplacer les domaines d'exemple et URL relatives canoniques avec le domaine réel. Vérifier les textes légaux, la politique de confidentialité, les frais de livraison et conditions de vente. Certaines photographies et présentations d'emballage sont illustratives ; confirmer les véritables produits et autorisations d'image. Vérifier la composition des coffrets, les prix et la disponibilité avant publication.

## Structure

- `index.html` — accueil FR, `ar/index.html` — accueil arabe
- `catalogue.html`, `packs.html`, `parfums/` — boutique et fiches
- `admin/index.html` — interface de gestion en mode front-only
- `assets/data.js` — catalogue de démonstration fourni
- `assets/local-catalog.js` — applique les modifications `localStorage` avant affichage
- `assets/live-catalog.js` — met à jour les prix et états affichés sans API
- `assets/settings.js` — paramètres de démonstration
- `ADMIN_FRONTEND.md` — limitations / essai de l'admin
