# ZAYRA V30 — Version intégrale front-end (FR / AR)

## Nouveaux visuels
9 compositions envoyées dans la conversation sont intégrées aux **bonnes références** : HYPNOTIC POISON, DEVOTION D&G WOMEN, KAYALI MARSHMALLOW 81, DELINA EXCLUSIF, BIANCO LATTE, SANDALE WOOD, YSL Y EDP, SCANDAL JEAN PAUL GAULTIER, FRENCH TOBACCO.

Fichiers WebP optimisés dans `assets/images/v30/products/`. La boutique, les fiches parfum, les données de l'administration et les vignettes déjà existantes de ces références renvoient aux nouveaux fichiers. Les autres parfums restent intégrés.

## Tableau de bord `/admin/`
- Tableau de bord : KPIs de démo, 9 nouveaux visuels, alertes stocks.
- Produits : modifier prix, titre FR/AR, catégorie, disponibilité, chemin de l'image, stock et brouillons de métadonnées SEO.
- Mouvements de stock : entrées/sorties fictives avec historique et CSV.
- **Inventaire rapide** : mettre à jour les quantités en masse ; CSV export/import par `id` et `stock`.
- Commandes : simulation de demandes et statuts, export CSV. **Aucune commande réelle.**
- Packs : composition locale, prix et paramètres de démonstration.
- Médias : grille des 41 références, aperçu et import WebP local.
- **SEO & référencement** : aperçu des snippets, recommandations de longueur, brouillons SEO, export CSV et checklist de publication.
- Sauvegardes : import/export JSON des modifications.

Les modifications locales sont stockées dans le navigateur (localStorage) et ne changent pas les fichiers HTML. Un autre navigateur ou visiteur ne les verra pas. Les produits *nouveaux* sont seulement des brouillons jusqu'à génération de véritables pages statiques.

### ⚠️ Ne pas déployer comme un vrai back-office protégé
L'adresse `/admin/` n'est pas dans le menu public mais reste **accessible à toute personne connaissant l'URL**. `robots.txt` et `noindex` ne fournissent aucune sécurité. Il faut une authentification serveur, une base de données et des contrôles d'accès pour une véritable gestion de produits, stocks et commandes. Aucun paiement et aucune commande client réelle ne sont sécurisés par ce ZIP.

## SEO — préparation au déploiement
- Balises `title` et `description` soignées ; descriptions de fiches distinctes avec notes olfactives visibles.
- `og:image` / `twitter:image` et images Product JSON-LD alignées avec les vrais fichiers de chaque fiche.
- Balises canoniques relatives en prévisualisation : **renseigner le domaine HTTPS réel** pour obtenir le canonique absolu, les hreflang FR/AR et le fichier `sitemap.xml`.
- Commande depuis le dossier racine : `python scripts/configurer_domaine.py https://votre-domaine-reel.ma` (remplacer par le véritable domaine que vous contrôlez).
- Puis contrôler : `python scripts/audit_seo.py`.
- Vérifier le nom commercial, les informations légales, les prix, le stock, la disponibilité réelle, la conformité des photos et les droits des marques avant mise en ligne. Les photos sont des compositions illustratives : les flacons des marques ne sont **pas inclus** dans le décant de 10 ml.

## Prévisualisation
Extraire le ZIP. Dans `ZAYRA_SITE/` exécuter `python -m http.server 8000` (ou `py -m http.server 8000` sous Windows) puis ouvrir `http://localhost:8000/`, `http://localhost:8000/catalogue.html` et `http://localhost:8000/admin/`. Ce serveur sert seulement des fichiers statiques, ce n'est **pas** un backend.

Ne pas confondre les brouillons SEO de l’admin (locaux uniquement) avec les balises HTML déjà présentes dans cette version. Après modifications admin, réexporter puis intégrer les métadonnées aux fichiers statiques avant redéploiement.
