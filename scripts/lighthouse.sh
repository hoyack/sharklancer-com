#!/usr/bin/env bash
set -euo pipefail
PORT="${LIGHTHOUSE_PORT:-4174}"
npm run build >/dev/null
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory dist >/tmp/sharklancer-lighthouse-server.log 2>&1 &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT
for _ in $(seq 1 30); do
  curl -fsS "http://127.0.0.1:$PORT/" >/dev/null && break
  sleep 0.2
done
npx lighthouse "http://127.0.0.1:$PORT/" \
  --output=json \
  --output-path=docs/lighthouse.json \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo \
  --quiet
node - <<'NODE'
const report=require('./docs/lighthouse.json');
const minimum={performance:.9,accessibility:.95,'best-practices':.95,seo:.95};
let failed=false;
for(const [name,min] of Object.entries(minimum)){
  const score=report.categories[name].score;
  console.log(`${name}: ${Math.round(score*100)}`);
  if(score<min){console.error(`${name} below ${Math.round(min*100)}`);failed=true;}
}
if(failed)process.exit(1);
NODE
