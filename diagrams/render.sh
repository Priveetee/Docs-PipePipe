#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$repo_root/diagrams/src"
output_dir="$repo_root/docs/public/diagrams"
puppeteer_config="$repo_root/diagrams/puppeteer.json"
font_template="$repo_root/diagrams/reddit-sans.css"
font_source="$repo_root/node_modules/@fontsource/reddit-sans/files/reddit-sans-latin-700-normal.woff2"
font_css="$(mktemp)"

cleanup() {
  rm -f "$font_css"
}

trap cleanup EXIT

if [[ ! -f "$font_source" ]]; then
  echo "Reddit Sans is missing. Run 'bun install' before rendering diagrams." >&2
  exit 1
fi

font_data="$(base64 --wrap=0 "$font_source")"
sed "s|__REDDIT_SANS_700__|$font_data|" "$font_template" > "$font_css"

render_variant() {
  local source="$1"
  local suffix="$2"
  local config="$3"
  local background="$4"
  local name

  name="$(basename "$source" .mmd)"

  bunx mmdc \
    --input "$source" \
    --output "$output_dir/$name$suffix.png" \
    --configFile "$config" \
    --cssFile "$font_css" \
    --puppeteerConfigFile "$puppeteer_config" \
    --backgroundColor "$background" \
    --scale 3
}

mkdir -p "$output_dir"

for source in "$source_dir"/*.mmd; do
  render_variant "$source" "" "$repo_root/diagrams/cfg-light.json" "#ffffff"
  render_variant "$source" "-dark" "$repo_root/diagrams/cfg-dark.json" "#1b1b1f"
done
