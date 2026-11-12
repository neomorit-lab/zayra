# ZAYRA V34 — Gestion boutique (prototype local)

## Nouveautés
- **Flacons & décants :** saisie du volume brut, coût d’achat, préparation 10 ml, traçabilité des retraits. Préparer 2 décants enlève 20 ml des flacons et ajoute 2 décants prêts.
- **Marges :** coût du parfum (calculé depuis le prix des flacons ou saisi), flacon de décant, emballage, expédition ; estimation de marge après promotion, y compris packs configurés.
- **Commandes :** état de préparation, bon imprimable, message WhatsApp à copier. Le stock est réservé une fois à la confirmation.
- **Paiements :** encaissements et remboursements, solde et historique, garde-fous contre les montants supérieurs au dû.
- **Retours :** enregistrement par ligne et quantité, retour au stock uniquement pour des unités intactes et si la composition d’origine est connue. Le remboursement est enregistré séparément.
- **Réapprovisionnement :** ventes sur 30 jours, délai fournisseur, couverture et minimum personnalisables, liste exportable.
- **Sauvegarde JSON :** données V34 incluses ; import des sauvegardes V29–V34 compatible.

## Démarrage
Ouvrir `ZAYRA_SITE/admin/` depuis un serveur local, ou `OUVRIR_ADMIN_WINDOWS.bat` sur Windows. La boutique publique, ses images et les pages produits sont conservées.

## Important
**Prototype local sans backend.** Les données sont sauvegardées dans le navigateur (localStorage) et non synchronisées avec les visiteurs ou les autres employés. Pas d’identification sécurisée, ni paiement en ligne, ni collecte autorisée de données personnelles réelles. Utiliser des données de test. Les prix de revient et prévisions restent des estimations.
