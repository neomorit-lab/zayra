#!/usr/bin/env python3
"""V53 offline SEO QA (not a substitute for Lighthouse/Search Console)."""
from pathlib import Path
from bs4 import BeautifulSoup
from collections import Counter
import json,sys
R=Path(__file__).resolve().parents[1]
P=sorted(R.rglob('*.html'))
errors=[];warn=[]; counts=Counter()
for page in P:
 rel=page.relative_to(R).as_posix()
 s=BeautifulSoup(page.read_text(encoding='utf-8'),'html.parser')
 noindex=(rel.startswith('admin/') or any('noindex' in (tag.get('content','').lower()) for tag in s.select('meta[name=robots]')))
 if not s.title or not s.title.get_text(' ',strip=True):errors.append((rel,'titre absent'))
 if not s.select_one('meta[name=description]') and not rel.startswith('admin/'):
  errors.append((rel,'meta description absente'))
 if not rel.startswith('admin/') and len(s.select('h1'))!=1:errors.append((rel,f'H1 = {len(s.select("h1"))}'))
 if not noindex:
  counts['indexable']+=1
  if len(s.select('link[rel=canonical]'))!=1:errors.append((rel,'canonical absente ou multiple'))
  if len(s.select('link[hreflang]'))!=3:errors.append((rel,'hreflang FR/AR/x-default incomplets'))
 if rel.startswith(('parfums/','ar/parfums/')):counts['products']+=1
 for tag in s.select('script[type="application/ld+json"]'):
  try:json.loads(tag.string or '')
  except Exception as e:errors.append((rel,'JSON-LD invalide: '+str(e)[:70]))
 for tag in s.select('img[src]'):
  if not tag.has_attr('alt'):errors.append((rel,'image sans alt'))
  counts['images']+=1
  if not tag.has_attr('width') or not tag.has_attr('height'):warn.append((rel,'image sans dimensions explicites'))
 for tag in s.find_all(['img','script','link','a']):
  key='src' if tag.name in ('img','script') else 'href'
  ref=tag.get(key,'')
  if not ref or ref.startswith(('http:','https:','mailto:','tel:','javascript:','data:','#')):continue
  ref=ref.split('#',1)[0].split('?',1)[0]
  if ref and not (page.parent/ref).resolve().exists():errors.append((rel,'lien local manquant: '+ref))
report={'html_pages':len(P),'indexable':counts['indexable'],'product_pages':counts['products'],'images_checked':counts['images'],'errors':errors,'warnings':warn,'note':'Audit statique; ne mesure ni Core Web Vitals, ni indexation ni rendu interactif du site.'}
(R/'AUDIT_V53.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print('ZAYRA V53 — pages',len(P),'indexables',counts['indexable'],'produits',counts['products'],'images',counts['images'],'erreurs',len(errors),'avertissements',len(warn))
for err in errors[:20]:print('ERREUR',*err)
for w in warn[:7]:print('AVERTISSEMENT',*w)
if errors:sys.exit(1)
