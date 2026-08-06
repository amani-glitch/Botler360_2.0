#!/usr/bin/env bash
# ============================================================================
# Botler360 — one-shot Cloud Run deploy script
# ============================================================================
# Usage (from the project root):
#   ./scripts/deploy-cloudrun.sh /path/to/service-account.json
#
# What it does:
#   1. Authenticates gcloud with your service account
#   2. Reads project_id from the SA JSON
#   3. Enables required APIs (Cloud Run, Cloud Build, Secret Manager, Artifact Registry)
#   4. Reads GEMINI_API_KEY from .env.local
#   5. Creates (or updates) a Secret Manager secret named "gemini-api-key"
#   6. Grants the Cloud Run runtime service account access to the secret
#   7. Deploys the backend to Cloud Run from source (uses Dockerfile)
#   8. Prints the resulting Cloud Run URL
#
# Re-running this script is safe — it only updates what changed.
# ============================================================================
set -euo pipefail

# ---------- args ----------
SA_KEY="${1:-}"
if [[ -z "$SA_KEY" ]]; then
  echo "Usage: $0 /path/to/service-account.json"
  exit 1
fi
if [[ ! -f "$SA_KEY" ]]; then
  echo "❌ Service account key not found: $SA_KEY"
  exit 1
fi

REGION="${REGION:-europe-west1}"
SERVICE="${SERVICE:-botler-api}"
SECRET_NAME="${SECRET_NAME:-gemini-api-key}"

# ---------- read project_id from SA JSON without leaking the file content ----------
# Convert git-bash path "/c/Users/..." to Windows path "C:/Users/..." for Node on Windows
SA_KEY_NATIVE="$SA_KEY"
if [[ "$SA_KEY" =~ ^/([a-zA-Z])/(.*)$ ]]; then
  drive="${BASH_REMATCH[1]^^}"
  rest="${BASH_REMATCH[2]}"
  SA_KEY_NATIVE="${drive}:/${rest}"
fi
PROJECT_ID=$(node -p "require('$SA_KEY_NATIVE').project_id" 2>/dev/null || true)
if [[ -z "$PROJECT_ID" ]]; then
  echo "❌ Could not read project_id from $SA_KEY"
  exit 1
fi

echo "▸ project: $PROJECT_ID"
echo "▸ region:  $REGION"
echo "▸ service: $SERVICE"

# ---------- auth ----------
echo "▸ authenticating gcloud…"
gcloud auth activate-service-account --key-file="$SA_KEY" --quiet
gcloud config set project "$PROJECT_ID" --quiet

# ---------- enable APIs (idempotent) ----------
echo "▸ enabling required APIs…"
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  --quiet

# ---------- gemini key from .env.local ----------
if [[ ! -f .env.local ]]; then
  echo "❌ .env.local not found. Add GEMINI_API_KEY=... to .env.local first."
  exit 1
fi
GEMINI_KEY=$(grep -E '^GEMINI_API_KEY=' .env.local | head -n1 | cut -d= -f2- | tr -d '\r' | tr -d '\n')
if [[ -z "$GEMINI_KEY" || "$GEMINI_KEY" == "REPLACE_WITH_YOUR_NEW_KEY_FROM_AISTUDIO" ]]; then
  echo "❌ GEMINI_API_KEY missing or placeholder in .env.local"
  exit 1
fi

# ---------- create or update the secret ----------
echo "▸ creating/updating Secret Manager secret '$SECRET_NAME'…"
if gcloud secrets describe "$SECRET_NAME" --quiet >/dev/null 2>&1; then
  printf "%s" "$GEMINI_KEY" | gcloud secrets versions add "$SECRET_NAME" --data-file=- --quiet
  echo "  ✓ added new version to existing secret"
else
  printf "%s" "$GEMINI_KEY" | gcloud secrets create "$SECRET_NAME" \
    --replication-policy=automatic \
    --data-file=- --quiet
  echo "  ✓ secret created"
fi

# ---------- grant the Cloud Run runtime SA access to the secret ----------
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
RUNTIME_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
echo "▸ granting secretAccessor to runtime SA ($RUNTIME_SA)…"
gcloud secrets add-iam-policy-binding "$SECRET_NAME" \
  --member="serviceAccount:$RUNTIME_SA" \
  --role="roles/secretmanager.secretAccessor" \
  --quiet >/dev/null

# ---------- deploy ----------
# FRONTEND_ORIGIN is set to "*" by default — override if you know your bucket URL.
FRONTEND_ORIGIN="${FRONTEND_ORIGIN:-*}"

echo "▸ deploying to Cloud Run…"
gcloud run deploy "$SERVICE" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --set-secrets="GEMINI_API_KEY=${SECRET_NAME}:latest" \
  --set-env-vars="GEMINI_MODEL=gemini-2.5-flash,GEMINI_LIVE_MODEL=gemini-2.5-flash-native-audio-preview-12-2025,FRONTEND_ORIGIN=${FRONTEND_ORIGIN}" \
  --quiet

# ---------- show URL ----------
URL=$(gcloud run services describe "$SERVICE" --region "$REGION" --format="value(status.url)")
echo ""
echo "============================================================"
echo "✅ DEPLOYED"
echo "URL: $URL"
echo "============================================================"
echo ""
echo "Next steps:"
echo "  1. Rebuild the frontend with this URL baked in:"
echo "       VITE_API_BASE=\"$URL\" npm run build:client"
echo "  2. Upload dist/public/ to your bucket:"
echo "       gsutil -m rsync -r -d dist/public/ gs://YOUR_BUCKET/"
echo ""
echo "  Smoke test:"
echo "    curl $URL/healthz"
echo "    curl -X POST $URL/api/chat/stream \\"
echo "         -H 'Content-Type: application/json' \\"
echo "         -d '{\"theme\":\"signature\",\"messages\":[{\"role\":\"user\",\"text\":\"ping\"}]}'"
