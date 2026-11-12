# ZAYRA V32 — Administration repensée

## Démarrage

Ouvrir `admin/index.html` depuis le site ou lancer `OUVRIR_ADMIN_WINDOWS.bat`.

## Rubriques

- Tableau de bord : indicateurs, dernières commandes, stock à surveiller.
- Commandes : ajout, suivi, paiement, réservation de stock à confirmation.
- Clients : fiches de démonstration.
- Produits : prix, photos, visibilité.
- Packs & coffrets : les **4 packs historiques** sont conservés. Modifier nom, prix, composition et visibilité. Les deux duos sont préremplis dans l’éditeur, puis enregistrables. Les compositions des deux autres coffrets sont à renseigner, pas à deviner. Après enregistrement de la composition, la disponibilité du pack dépend des stocks des produits composants.
- Stocks : ajustement quantités et historique. Lors d’une confirmation de commande contenant un pack composé, les unités des produits composants sont déduites ; l’annulation avant expédition restaure les quantités réservées.
- Promotions : réduction en pourcentage ou en DH, boutique entière, une catégorie, packs ou produit précis ; dates optionnelles, activation et pause. La remise la plus favorable s’applique sans cumul. Le panier de la boutique locale reprend les tarifs remisés dans ce navigateur.
- Rapports, sauvegardes et CSV. La sauvegarde V32 inclut les promotions et la composition des packs ; les anciennes sauvegardes V31 restent importables.

## Important : prototype sans backend

Les opérations sont stockées dans le navigateur avec `localStorage`. Il **n’existe aucune connexion sécurisée**, aucun multi-utilisateur et aucune synchronisation des visiteurs ou commandes WhatsApp. Les changements de l’admin sont prévisualisés dans la boutique du **même navigateur sur la même origine** ; ils ne sont pas publiés aux autres visiteurs. Ne saisir aucune donnée client réelle. Un backend, une authentification et une base de données seront indispensables pour une mise en production.

## Portée des modifications

L’admin est remanié visuellement. La boutique et les fiches produit existantes, les neuf visuels V30 et les fonctionnalités précédentes sont conservés. Aucune intervention SEO n’a été faite dans cette version.
