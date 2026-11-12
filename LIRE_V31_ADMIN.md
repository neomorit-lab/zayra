# ZAYRA V31 — Le nouvel espace de gestion, conçu pour les débutants

## Ce qui change dans cette version

La boutique complète V30 (FR + AR), les fiches parfum, les **9 images ajoutées**, le catalogue et les fichiers SEO existants sont conservés. La V31 apporte surtout un nouvel espace `/admin/` plus facile pour une personne non technique.

### Les rubriques

1. **Accueil** — commandes à traiter, produits à surveiller, clients enregistrés, montants de commandes de démonstration et accès directs aux tâches courantes.
2. **Commandes** — créer manuellement une commande, sélectionner le client fictif, les articles, quantités et frais de livraison ; suivre « À confirmer », « Confirmée », « En préparation », « Expédiée », « Livrée », « Annulée ». Enregistrer paiement, canal, référence de livraison et commentaires. Export Excel/CSV.
3. **Stocks** — saisir le stock de départ pour les 41 références, enregistrer toutes les quantités en une fois, saisir les arrivages, la casse et les corrections. Indicateurs rupture/stock faible, seuil réglable, historique et export Excel/CSV.
4. **Produits** — chercher, filtrer, changer nom/prix/catégorie/photo, masquer/rendre visible, préparer un nouveau parfum comme brouillon (non publié) et exporter les listes.
5. **Clients** — ajouter/modifier/archiver des **clients fictifs**, filtrer le répertoire, voir les commandes associées et exporter Excel/CSV.
6. **Rapports** — nombre de commandes, statuts, montant de commandes livrées de démonstration, produits les plus commandés et trois exports.
7. **Sauvegardes** — export JSON complet, restauration JSON V31 et V30, seuil d'alerte et remise à zéro de la démo.
8. **Aide** — guide très simple des gestes du quotidien.

### Comment l'ouvrir facilement

- **Windows** : décompressez le ZIP puis ouvrez `ZAYRA_SITE/OUVRIR_ADMIN_WINDOWS.bat`. Il lance un serveur local Python et ouvre `http://127.0.0.1:8765/admin/` dans le navigateur.
- **Mac/Linux** : lancez `ZAYRA_SITE/OUVRIR_ADMIN_MAC_LINUX.sh` et ouvrez l'adresse affichée.
- Ou si le site est déjà hébergé, ouvrez `https://votre-domaine/admin/`.
- S'il manque Python, il faut l'installer pour la prévisualisation locale. Il n'est pas nécessaire à l'usage d'un site déjà hébergé.

## Démonstration sans serveur sécurisé — limites importantes

**Ce ZIP n'est PAS un véritable back-office en production.** Il conserve les données dans le stockage du navigateur (localStorage), uniquement sur l'appareil et l'origine du site utilisés. Il n'y a **ni compte administrateur protégé, ni synchronisation multi-appareils, ni gestion réelle des visiteurs, ni paiement sécurisé**. Une URL `/admin/` cachée ou marquée `noindex` ne constitue pas une protection. **Ne saisissez pas de vraies données de clients** (noms, numéros, emails, adresses, etc.) : utilisez des exemples fictifs.

La boutique prépare actuellement des demandes de commande par WhatsApp : les demandes du public ne sont pas envoyées automatiquement à l'admin. Vous devez créer manuellement les commandes fictives pour tester. Les nouveaux produits restent des brouillons non publiés. Les modifications de prix/stock/images locales ne se répercutent pas chez les autres visiteurs, même sur un site hébergé.

Lors de la **confirmation** d'une commande de test, le stock est déduit une seule fois. Une annulation **avant expédition** remet les unités dans le stock local. Après expédition, les retours nécessitent une correction manuelle ; il ne faut pas décrémenter une seconde fois.

Pour un véritable outil de gestion commerciale avec données clients et commandes réelles, prévoir ensuite un **backend, une base de données, une authentification robuste, une gestion des droits d'accès et une synchronisation du catalogue et des commandes**.

## Structure

`ZAYRA_SITE/admin/index.html`, `admin/admin.css`, `admin/admin.js` sont les nouvelles pages de gestion. Le reste de la boutique statique est conservé. Les exports CSV utilisent le point-virgule, compatible avec Excel configuré pour le français.
