#!/bin/sh
cd "$(dirname "$0")" || exit 1
printf 'ZAYRA Admin: http://127.0.0.1:8765/admin/\n'
( command -v open >/dev/null && open 'http://127.0.0.1:8765/admin/' ) || ( command -v xdg-open >/dev/null && xdg-open 'http://127.0.0.1:8765/admin/' ) || true
python3 -m http.server 8765 --bind 127.0.0.1
