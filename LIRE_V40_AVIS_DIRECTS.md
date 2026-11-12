# ZAYRA V40 — Avis clients

## Modifications

- Suppression de l'étape de sélection « brouillon / publier » lors de la création d'un avis dans `/admin/#reviews`.
- Un avis authentique reçu d'un client, avec son accord pour la publication, est enregistré directement au statut « publié » dans le navigateur utilisé pour l'administration.
- Le badge « Achat confirmé » reste optionnel et ne doit être activé que si l'achat a effectivement été vérifié.
- Les étoiles, le nom affiché, les photos jointes (ou la photo du produit), les dates et les commentaires sont conservés.
- Le bouton « Masquer » permet de retirer un avis de l'affichage local. Les avis plus anciens restent compatibles.
- Sur les fiches sans avis publié, un état discret remplace l'appel insistant à déposer un témoignage.
- Les aperçus privés accessibles par `?previewAvis=1` montrent plusieurs exemples fictifs avec des noms, notes et images différents selon le parfum. Ils sont explicitement identifiés comme fictifs et exclus de l'indexation. **Aucun faux avis n'a été ajouté à la boutique publique**.

## Limitation importante du site statique

La V40 ne dispose toujours pas de serveur de base de données. Un avis publié depuis l'administration apparaît immédiatement sur les fiches dans le même navigateur (stockage local) mais **n'est pas synchronisé automatiquement avec les autres visiteurs**.

Pour publier de vrais avis à tous les visiteurs : Admin > Avis clients > Exporter pour la boutique, puis remplacer le fichier `assets/reviews.js` du site et publier les fichiers sur l'hébergement.

Pour un flux multi-utilisateurs entièrement automatique, il faudra connecter les formulaires publics et l'administration à un backend.

## Bonnes pratiques

Ne publiez que des avis réellement recueillis, autorisés, fidèlement reproduits et rattachés au bon produit. L'indication « Achat confirmé » n'est activée que si la commande correspondante a été vérifiée. Conservez l'accord de publication des photos et des prénoms.
