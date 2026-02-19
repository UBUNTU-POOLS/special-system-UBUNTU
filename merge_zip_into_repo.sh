#!/usr/bin/env bash
set -euo pipefail

ZIP_PATH="/mnt/data/special-system-UBUNTU.zip"
TMP_DIR="/tmp/ubuntu_zip_merge"

git checkout -b "backup/pre-zip-merge-$(date +%Y%m%d-%H%M)" || true
git checkout main
git pull origin main

rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
unzip -o "$ZIP_PATH" -d "$TMP_DIR" >/dev/null

ZIPROOT="$(find "$TMP_DIR" -maxdepth 3 -type f -name package.json -print -quit | xargs -r dirname)"
if [ -z "${ZIPROOT:-}" ]; then
  echo "ERROR: Could not find package.json in the zip. Please inspect $TMP_DIR"
  exit 1
fi

echo "Detected zip project root: $ZIPROOT"

rsync -av --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='.vercel' \
  "$ZIPROOT/" "./"

git status
git add -A
git commit -m "Merge amended build from special-system-UBUNTU.zip" || {
  echo "No changes to commit."
  exit 0
}
git push origin main
echo "Done: pushed to GitHub. Vercel should redeploy automatically (if Git-connected)."
