# ZAYRA V37 — Fiches produits et gestion des avis

## Modifications visibles

- Suppression des cartes de témoignages fictifs de l'accueil (français et arabe).
- Suppression des liens « Voir les photos officielles chez ... » des fiches produits pour alléger leur affichage.
- Nouveau bloc Avis clients sur les fiches produits FR et AR, avec étoiles, note moyenne, répartition des notes, noms/pseudonymes, date, image du produit ou photo fournie avec accord, tri et nombre d'avis.
- Les fiches sans avis réels présentent un appel à partager son expérience, sans note fabriquée.
- L'ancien écran `avis-demo.html` présente désormais une entrée neutre vers les avis par produit.

## L'admin : /admin/#reviews

- Rubrique **Avis clients** dans la navigation latérale.
- Ajouter / modifier / masquer / supprimer un avis, filtrer par produit et statut, exporter CSV.
- Champ produit, auteur, titre, note sur 5, date, texte et photo facultative.
- Contrôles « achat confirmé/vérifié » et « accord de publication » obligatoires pour publier.
- Les avis sont **liés à l'identifiant du produit** et apparaissent sur la fiche correspondante lorsque leur publication est effective.
- Les avis sont inclus dans les sauvegardes V37. Import compatible avec les sauvegardes V34 précédentes.

## Publication : fonctionnement sans backend

1. Ajouter les avis authentiques et autorisés dans **Admin → Avis clients**.
2. Enregistrer un avis au statut « Publié » après vérification.
3. Cliquer sur **Exporter pour la boutique**. Cela télécharge `reviews.js`.
4. Remplacer `ZAYRA_SITE/assets/reviews.js` par le fichier téléchargé, puis déployer le site mis à jour.
5. Les visiteurs verront alors les avis approuvés sur les fiches des produits concernés.

Sur le même domaine et dans le même navigateur, l'admin peut afficher un aperçu local immédiatement. En ouvrant des pages directement via `file://`, les données locales des différentes pages peuvent être isolées par le navigateur. L'export `reviews.js` reste alors le moyen fiable de les mettre en commun.

**Aucun backend :** il n'existe pas de collecte centralisée des avis de visiteurs, de connexion sécurisée, ni d'envoi automatique au propriétaire. Le formulaire public « Partager mon expérience » renvoie vers le contact, pour collecte manuelle et consentement. Ne traitez pas d'informations sensibles dans cet admin local.

## Aperçu du design (sans faux avis publics)

Depuis **Admin → Avis clients**, cliquer sur « Prévisualiser le design » après avoir choisi un produit dans le filtre. Ou ouvrir une fiche produit avec `?previewAvis=1` dans l'URL. Cet aperçu utilise plusieurs exemples fictifs portant explicitement la mention « Aperçu privé — témoignages fictifs, non publiés ». Les exemples ne sont pas exportés et ne s'affichent pas sur les fiches publiques ordinaires.

## Conservation

La V37 conserve les 41 références, quatre packs, le site bilingue, le front premium et les modules d'administration V34/V36, ainsi que le crédit « Powered by NeoMorIT ».
