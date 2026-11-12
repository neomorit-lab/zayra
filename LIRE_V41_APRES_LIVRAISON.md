# ZAYRA V41 — Parcours après livraison et collecte d’avis

## Nouveautés

- `/admin/#postSale` : commandes au statut **Livrée**, messages de remerciement préparés par commande, liens d'avis selon les références achetées, suivi À envoyer / Envoyé / Avis reçu.
- Boutons WhatsApp, Email, Copier et Aperçu. WhatsApp et Email ouvrent un message préparé ; **l’envoi reste manuel**.
- `/avis-commande.html` et `/ar/avis-commande.html` : page client avec choix du parfum, 1 à 5 étoiles, nom affiché, commentaire, photo facultative et consentement de publication.
- L’avis déposé depuis le même navigateur/origine est conservé en **brouillon** et apparaît dans l’admin : `/admin/#reviews`.
- Le client peut **télécharger son retour en JSON** pour l’envoyer à ZAYRA ; l’admin l’importe via **Après livraison → Importer un retour client**.
- Après contrôle de l’authenticité et de l'accord client, l'admin peut publier l’avis ; il apparaît sur la fiche du parfum dans le même navigateur et, après export du fichier `reviews.js`, chez tous les visiteurs.
- Crédit *Powered by NeoMorIT* et autres modules V40 conservés.

## Comment tester le parcours

1. Ouvrir `admin/`, créer une **fiche client fictive** avec numéro ou email fictif, puis saisir une commande de test.
2. Définir le stock fictif de la référence, confirmer la commande, la passer en **Expédiée**, puis **Livrée**.
3. Aller dans **Après livraison**. Ajouter l’adresse HTTPS publique **réelle** du site (exemple `https://exemple.ma`, sans `index.html`).
4. Choisir **WhatsApp**, **Email** ou **Copier**. Les applications s’ouvrent avec le texte préparé. Pour l’instant, rien n’est expédié sans intervention humaine. Cliquer sur **Marquer envoyé** uniquement après un envoi réel.
5. Cliquer sur **Aperçu** pour tester le questionnaire localement. Les réponses sont transmises au stockage local du navigateur si celui-ci l'autorise.
6. Depuis un autre appareil, demander au client de transmettre le fichier JSON téléchargé après la saisie. **Après livraison → Importer un retour client** (pas de synchronisation automatique entre appareils).
7. Dans **Avis clients**, ouvrir le brouillon, vérifier l'expérience réelle et le consentement, cocher l'authenticité, enregistrer et publier.
8. Pour publication dans la boutique statique, **Avis clients → Exporter pour la boutique**, puis remplacer `assets/reviews.js` sur l’hébergement et recharger le site.

## Limites de la version sans serveur

- **Aucun SMS, WhatsApp ni email ne part automatiquement.** Le statut Livrée déclenche uniquement la préparation dans l'admin local.
- Les clients sur leurs téléphones ne partagent **pas** le localStorage de l'admin. L'import JSON est un pont manuel ; les avis ne sont pas synchronisés via Internet.
- Le numéro client doit être valide pour ouvrir WhatsApp ; la messagerie email doit être configurée côté opérateur.
- Ne pas envoyer de liens `file:///` : pour être consultable sur le téléphone du client, la page doit être mise en ligne en HTTPS.
- Le lien client ne constitue pas une preuve d'achat : il est nécessaire de vérifier les commandes avant de marquer « Achat vérifié » ou de publier un avis.
- Pas de vraie authentification ni de base de données. Ne pas stocker de données personnelles sensibles dans cette démonstration.
- Pour un fonctionnement réellement automatique : backend + base commandes/clients/avis, webhook du transporteur ou confirmation de livraison, fournisseur de messagerie autorisé, vérification d'identité et consentement, notifications, modération et publication via API.

## Contrôles

- Analyse syntaxique des scripts modifiés : validée.
- Test isolé du suivi après livraison : insertion une seule fois, détection d'un avis reçu : validé.
- Contrôle de 109 pages HTML et de leurs liens fichiers locaux : aucune référence manquante.
- Tests UI automatisés non effectués : le navigateur de test bloque l'accès aux pages locales dans cet environnement.
