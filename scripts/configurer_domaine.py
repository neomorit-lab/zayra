#!/usr/bin/env python3
"""Compatibility launcher for the safer V53 static publication build.
Usage: python scripts/configurer_domaine.py https://www.VOTRE-VRAI-DOMAINE.ma
Creates ../ZAYRA_PUBLIC instead of editing the original files.
"""
from pathlib import Path
import subprocess,sys
if len(sys.argv)!=2:
    print('Usage: python scripts/configurer_domaine.py https://votre-domaine-https.ma')
    sys.exit(2)
root=Path(__file__).resolve().parents[1]
out=root.parent/'ZAYRA_PUBLIC'
print('Prépare une COPIE pour publication et conserve votre source intacte :', out)
rc=subprocess.call([sys.executable,str(root/'tools/publish_seo.py'),'--domain',sys.argv[1],'--output',str(out)])
sys.exit(rc)
