# ZAYRA V43 — Liste d’avis sur les fiches produit

## Ce qui change

- Sur les 41 références (82 fiches en français/arabe), la section **Avis clients** affiche maintenant une **liste de cartes d’avis** : auteur, étoiles, commentaire, image, date lorsque disponible.
- Quand des avis authentiques, autorisés et publiés existent, ils sont affichés avec note moyenne, répartition des étoiles et tri.
- En l’absence d’avis publié, quatre **exemples de mise en page**, différents selon la référence, montrent le futur design. Ils portent visiblement la mention **« Avis fictif — présentation uniquement »** et ne sont jamais comptabilisés dans les notes ou présentés comme des achats.
- La galerie de présentation du produit ne remplace plus la liste des avis. Les photos de produits associées aux exemples sont signalées comme illustrations ZAYRA et non comme photos envoyées par des acheteurs.
- Les visuels et les textes s’adaptent à la version française et arabe, sur ordinateur et mobile.

## Pour publier de vrais avis

1. Ouvrir `ZAYRA_SITE/admin/` puis **Avis clients**.
2. Ajouter le témoignage tel que fourni par le client, sélectionner le parfum, renseigner note / date / texte / photo et confirmer l’authenticité ainsi que son accord de publication.
3. Enregistrer et publier. L’avis apparaît immédiatement dans le même navigateur.
4. Cliquer sur **Exporter pour la boutique** et remplacer `ZAYRA_SITE/assets/reviews.js` par le fichier téléchargé pour publier sur le site statique pour tous les visiteurs.
5. Les clients peuvent fournir un avis après livraison via `avis-commande.html`. Sans backend, les avis saisis depuis d’autres navigateurs nécessitent un import depuis l’admin.

## Notes techniques

- Pas de backend ni d’envoi automatique ; cette version conserve la logique locale de V42.
- Les données publiques restent contenues dans `assets/reviews.js`.
- Les exemples fictifs ne sont jamais inclus dans cet export.
- Aucun score `AggregateRating` artificiel n’a été ajouté.
- Les modules antérieurs de la boutique, du panier, des packs, de la gestion admin et du suivi après livraison sont conservés.
