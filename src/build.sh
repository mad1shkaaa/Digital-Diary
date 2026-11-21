#!/bin/sh
cd "$(dirname "$0")"
cat head.html engine.js i18n.js theme.js avatar.js voices.js albums.js app.js > ../index.html
printf '\n</script></body></html>\n' >> ../index.html
