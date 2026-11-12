# ZAYRA V53 — Design, responsive, performances et SEO

## Livré
- Couche de finitions responsive `assets/v53-polish.css` et ergonomie admin `admin/v53-admin.css`.
- 82 fiches produit : données structurées `Product` et images sociales orientées vers **le décant vendu**, pas le grand flacon d'illustration.
- Paires linguistiques FR/AR balisées `hreflang` en aperçu local ; conversion en URL absolues prévue pour publication.
- 109 pages HTML inspectées, images avec dimensions intrinsèques pour limiter les décalages de mise en page.
- Hero : seule la première diapositive est chargée en priorité, la suivante ne bloque plus inutilement le démarrage.
- Meilleure visibilité du clavier, contrastes, boutons, RTL arabe et cartes de recommandations produits.
- Réglages de cache/compression facultatifs pour Netlify et Apache.
- Aucun nouvel avis fictif ni note artificielle ajoutés aux données structurées.

## Avant de publier, utiliser votre **vrai** domaine HTTPS

```bash
python -m pip install beautifulsoup4
python tools/publish_seo.py --domain https://VOTRE-VRAI-DOMAINE.ma --output ../ZAYRA_PUBLIC
```

Remplacer l'adresse ci-dessus par le domaine HTTPS que vous possédez. **Ne mettez pas en ligne la commande d'exemple telle quelle.** Le script crée une copie `ZAYRA_PUBLIC` avec :
- URL canoniques HTTPS absolues ;
- `hreflang` FR/AR absolus (et x-default) ;
- `og:url`, images sociales et URL JSON-LD absolues ;
- `sitemap.xml` listant les pages indexables ;
- `robots.txt` avec le bon domaine.

Uploader ensuite le **contenu** de `ZAYRA_PUBLIC` à la racine du site. Déclarer `sitemap.xml` dans Google Search Console et tester les pages dans Rich Results Test.

## Ce qui ne peut pas être validé uniquement depuis un ZIP

- Core Web Vitals réels / PageSpeed sur domaine public et appareils mobiles.
- Indexation Google et Search Console.
- Avis et prix synchronisés en production : l'admin est toujours front-end uniquement.
- Sécurité et comptes administrateurs, base partagée, confirmations d'achat, livraisons effectives.
- Numéro WhatsApp/API/email : à renseigner dans `assets/settings.js` avant ouverture commerciale.
- Informations légales et politique de retour : à compléter et à faire vérifier.

**Attention :** ouvrir `index.html` sur l'ordinateur sert à prévisualiser. Pour la production, utiliser un serveur HTTPS et la sortie du script SEO.
