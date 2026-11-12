# ZAYRA V57 — Interface de gestion

## Ce qui change

- Navigation et tableau de bord épurés, avec moins de séparateurs et d'explications répétées.
- La rubrique Aide et le bandeau de démonstration ont été retirés de l'interface.
- Le tableau de bord affiche les indicateurs de commandes et stocks, ainsi que des graphiques de ventes livrées et de provenance des commandes.
- Rapports : évolution des ventes, sources, répartition par statut et produits les plus commandés.
- Les graphiques sont réalisés en SVG avec une bibliothèque de visualisation intégrée au site (fonctionne hors ligne) ; ils ne contiennent pas de statistiques préremplies. L'absence de données affiche un état vide.
- Gestion des sauvegardes simplifiée, accès aux exports conservé.

## Accès

Ouvrir `ZAYRA_SITE/admin/index.html`, ou `/admin/` sur le site hébergé. `ZAYRA_SITE/OUVRIR_ADMIN_WINDOWS.bat` est également disponible.

## Important

Cette version reste **sans backend ni authentification**. Les données et graphiques restent locaux au navigateur ; ce n'est pas une console de gestion prête pour des commandes de vrais clients. Ne pas enregistrer de coordonnées personnelles réelles.

Les graphiques n'utilisent que les commandes saisies dans ce navigateur et ne constituent pas des ventes en ligne synchronisées. Un panier sur la boutique publique ne crée toujours pas automatiquement une commande admin.

## Source de visualisation

D3.js v3.5.6 inclus dans `admin/vendor/d3.v3.min.js`, licence BSD-3-Clause. Attribution/licence dans `admin/vendor/`.

## Contrôles

- JavaScript validé par analyse syntaxique Node.
- Navigations tableau de bord / rapports / commandes / sauvegardes, formulaire Nouvelle commande : testés dans un rendu isolé.
- Quatre graphiques testés avec données synthétiques uniquement **dans la session de test** (ces données ne figurent pas dans le ZIP), navigation 14/30 jours et cas sans vente.
- Responsive 390 px : aucun débordement horizontal observé dans le rendu isolé.
- Le test du site complet servi en HTTP ou ouvert en fichier a été bloqué par le navigateur de test de l'environnement ; il faut encore valider dans un navigateur utilisateur.
