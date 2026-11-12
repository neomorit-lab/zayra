#!/usr/bin/env python3
"""Prepare ZAYRA static site for a verified HTTPS domain.
Usage: python tools/publish_seo.py --domain https://your-actual-domain.ma --output ../ZAYRA_PUBLIC
No network access needed. Outputs a COPY; leaves editable source unchanged.
"""
import argparse,json,re,shutil,sys
from pathlib import Path
from urllib.parse import urljoin,urlsplit
from xml.etree.ElementTree import Element,SubElement,ElementTree,register_namespace
try: from bs4 import BeautifulSoup
except ImportError: sys.exit('Installez bs4: python -m pip install beautifulsoup4')

SOURCE=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description='Préparer les URL canoniques, hreflang, données JSON-LD et sitemap ZAYRA.')
parser.add_argument('--domain',required=True,help='Le vrai domaine HTTPS, ex. https://www.votre-site.ma')
parser.add_argument('--output',required=True,help='Dossier NOUVEAU destiné à publication (ne pas mettre dans ZAYRA_SITE).')
args=parser.parse_args()
base=args.domain.rstrip('/')
pr=urlsplit(base)
if pr.scheme!='https' or not pr.netloc or pr.path or pr.query or pr.fragment or '..' in base or '<' in base:
    parser.error('Utilisez une origine HTTPS vérifiée, sans chemin : https://www.votre-domaine.ma')
if pr.hostname in {'localhost','example.com','example.org','example.net','your-domain.com'} or str(pr.hostname).endswith('.example'):
    parser.error('Remplacez le domaine d’exemple par votre domaine réel.')
OUT=Path(args.output).expanduser().resolve()
if OUT==SOURCE or OUT in SOURCE.parents or SOURCE in OUT.parents or OUT.exists():
    parser.error('Choisissez un nouveau dossier de sortie hors de ZAYRA_SITE (sans écraser).')
shutil.copytree(SOURCE,OUT)
register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
register_namespace('xhtml','http://www.w3.org/1999/xhtml')
url=lambda rel:base+'/'+rel.lstrip('/')
indexable=[]
all_pages=sorted(OUT.rglob('*.html'))
for page in all_pages:
    rel=page.relative_to(OUT).as_posix()
    soup=BeautifulSoup(page.read_text(encoding='utf-8'),'html.parser')
    if not soup.head:continue
    this_url=url(rel)
    robots=soup.find('meta',attrs={'name':'robots'})
    noindex=(rel.startswith('admin/') or (robots and 'noindex' in robots.get('content','').lower()))
    if noindex:
        for old_canonical in soup.select('link[rel=canonical]'):
            old_canonical.decompose()
    if not noindex:
        canonical=soup.find('link',rel=lambda r:r and 'canonical' in r)
        if not canonical:
            canonical=soup.new_tag('link',rel='canonical');soup.head.append(canonical)
        canonical['href']=this_url
        indexable.append(rel)
        ogurl=soup.find('meta',attrs={'property':'og:url'})
        if not ogurl:
            ogurl=soup.new_tag('meta',attrs={'property':'og:url'});soup.head.append(ogurl)
        ogurl['content']=this_url
        for link in soup.select('link[hreflang]'):
            href=link.get('href','')
            if href and not urlsplit(href).scheme:
                link['href']=urljoin(this_url,href)
        for key,attr in (('og:image','property'),('twitter:image','name')):
            tag=soup.find('meta',attrs={attr:key})
            if tag and tag.get('content') and not urlsplit(tag['content']).scheme:
                tag['content']=urljoin(this_url,tag['content'])
    for script in soup.select('script[type="application/ld+json"]'):
        try: data=json.loads(script.string or '')
        except Exception:continue
        if not isinstance(data,dict):continue
        def convert(node):
            if isinstance(node,list):
                for item in node: convert(item)
            elif isinstance(node,dict):
                node_type=node.get('@type')
                if node_type in ('Store','Organization','WebSite') and 'url' not in node:node['url']=base+'/'
                if node_type=='Product': node['@id']=this_url+'#product'
                if node_type=='BreadcrumbList': node['@id']=this_url+'#breadcrumb'
                for k,v in list(node.items()):
                    if k in ('image','url','item') and isinstance(v,str) and not v.startswith(('https:','http:','data:')):
                        node[k]=urljoin(this_url,v)
                    elif isinstance(v,(list,dict)):convert(v)
        convert(data)
        script.string=json.dumps(data,ensure_ascii=False,separators=(',',':'))
    page.write_text(str(soup),encoding='utf-8')

namespaces={'ns':'http://www.sitemaps.org/schemas/sitemap/0.9','xh':'http://www.w3.org/1999/xhtml'}
root=Element('{http://www.sitemaps.org/schemas/sitemap/0.9}urlset')
for rel in indexable:
    entry=SubElement(root,'{http://www.sitemaps.org/schemas/sitemap/0.9}url')
    SubElement(entry,'{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text=url(rel)
    soup=BeautifulSoup((OUT/rel).read_text(encoding='utf-8'),'html.parser')
    for tag in soup.select('link[hreflang]'):
        SubElement(entry,'{http://www.w3.org/1999/xhtml}link',{'rel':'alternate','hreflang':tag['hreflang'],'href':tag['href']})
ElementTree(root).write(OUT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
(OUT/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: '+base+'/sitemap.xml\n',encoding='utf-8')
report={'domain':base,'indexable_html':len(indexable),'html_total':len(all_pages),'sitemap':'sitemap.xml','note':'Contrôlez les prix, les stocks et les politiques de retour avant publication; ne balisez jamais de faux avis.'}
(OUT/'SEO_PUBLICATION_REPORT.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print('Publication préparée :',OUT,'| URLs indexables :',len(indexable),'| Domaine :',base)
