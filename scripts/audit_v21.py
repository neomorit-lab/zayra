#!/usr/bin/env python3
"""Local static checks; no web claims or fabricated availability validation."""
from pathlib import Path
from bs4 import BeautifulSoup
import json, sys, re
root=Path(__file__).resolve().parent.parent
pages=list(root.glob('*.html'))+list(root.glob('ar/*.html'))+list(root.glob('parfums/*.html'))+list(root.glob('ar/parfums/*.html'))+list(root.glob('parfums-arabes/*.html'))+list(root.glob('ar/parfums-arabes/*.html'))
missing=[]; structural=[]; gallery=[]; total=0
for page in pages:
    soup=BeautifulSoup(page.read_text(encoding='utf-8'),'html.parser')
    rel=page.relative_to(root).as_posix()
    if not soup.title or not soup.select_one('meta[name=description]') or len(soup.select('h1'))!=1: structural.append(rel)
    for attr,selector in [('href','a[href]'),('src','img[src],script[src]'),('href','link[rel=stylesheet]'),('data-gallery-src','[data-gallery-src]')]:
        for tag in soup.select(selector):
            value=tag.get(attr,'')
            if not value or value.startswith(('#','http:','https:','mailto:','tel:','data:','javascript:')):continue
            value=value.split('?',1)[0].split('#',1)[0]
            if not value:continue
            total+=1
            if not (page.parent/value).resolve().is_file():missing.append((rel,attr,value))
    if '/parfums/' in '/'+rel and '/parfums-arabes/' not in '/'+rel:
        if not any(x in rel for x in ('coffret-','pack-')) and len(soup.select('[data-gallery-src]'))<5:gallery.append(rel)
    counterpart=(rel[3:] if rel.startswith('ar/') else 'ar/'+rel)
    if not (root/counterpart).exists(): structural.append('no translation for '+rel)
product=json.loads((root/'assets/data.js').read_text(encoding='utf-8').split('=',1)[1].rstrip().removesuffix(';'))
print('PAGES',len(pages),'CATALOG',len(product),'LOCAL_REFERENCES',total,'MISSING',len(missing),'STRUCTURAL',len(structural),'GALLERY_LT5',len(gallery))
for k,v in [('MISSING',missing[:10]),('STRUCTURAL',structural[:10]),('GALLERY_LT5',gallery[:10])]:
 if v:print(k,v)
sys.exit(bool(missing or structural or gallery))
