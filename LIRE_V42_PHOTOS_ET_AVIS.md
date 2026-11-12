# ZAYRA V42 — Photos par parfum et avis clients

- Les fiches produits FR/AR affichent une galerie de visuels **ZAYRA** propre à chaque référence, avec plusieurs vues du décant lorsque disponibles.
- Les photos de cette galerie sont des visuels de présentation de la boutique, **pas** des photos d’acheteurs.
- Les avis publiés restent des avis clients réels, autorisés et modérés. Aucun faux avis n’a été publié.
- Pour prévisualiser des cartes au style marketplace (étoiles, prénoms et photos de produits), ouvrez une fiche avec `?previewAvis=1`. L’aperçu est clairement marqué **fictif** et `noindex`.
- Dans **Admin → Après livraison**, le message invite désormais le client à prendre une photo de son décant avec son téléphone. Les retours reçus sont gérés dans **Avis clients**.
- Sans backend, les avis reçus sur d’autres appareils ne se synchronisent pas automatiquement : importez leur fichier JSON, puis exportez `reviews.js` pour publier les avis confirmés.

## Conseils pour collecter de vraies photos

Envoyez un message de remerciement après la livraison, demandez un retour libre (positif ou négatif) et proposez de joindre une photo du flacon dans sa situation d’usage. Utilisez uniquement des photos pour lesquelles l’acheteur a autorisé la publication.
