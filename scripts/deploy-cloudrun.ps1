# ============================================================================
# Botler360 — one-shot Cloud Run deploy script (PowerShell)
# ============================================================================
# Usage (from the project root, in PowerShell):
#   .\scripts\deploy-cloudrun.ps1 -SaKey "C:\path\to\sa.json"
#
# Optional: -Region europe-west1 -Service botler-api -SecretName gemini-api-key
# ============================================================================

[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)] [string] $SaKey,
  [string] $Region = "europe-west1",
  [string] $Service = "botler-api",
  [string] $SecretName = "gemini-api-key",
  [string] $FrontendOrigin = "*"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $SaKey)) {
  Write-Host "Service account key not found: $SaKey" -ForegroundColor Red
  exit 1
}

# Read project_id from the SA JSON
$saJson = Get-Content $SaKey -Raw | ConvertFrom-Json
$ProjectId = $saJson.project_id
if (-not $ProjectId) {
  Write-Host "Could not read project_id from $SaKey" -ForegroundColor Red
  exit 1
}

Write-Host "project: $ProjectId"
Write-Host "region:  $Region"
Write-Host "service: $Service"

# ---------- auth ----------
Write-Host "authenticating gcloud..."
gcloud auth activate-service-account --key-file="$SaKey" --quiet
gcloud config set project $ProjectId --quiet

# ---------- enable APIs ----------
Write-Host "enabling required APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com artifactregistry.googleapis.com --quiet

# ---------- read GEMINI_API_KEY from .env.local ----------
if (-not (Test-Path ".env.local")) {
  Write-Host ".env.local not found. Add GEMINI_API_KEY=... first." -ForegroundColor Red
  exit 1
}
$GeminiKey = ""
foreach ($line in Get-Content .env.local) {
  if ($line -match "^GEMINI_API_KEY=(.*)$") {
    $GeminiKey = $Matches[1].Trim()
    break
  }
}
if (-not $GeminiKey -or $GeminiKey -eq "REPLACE_WITH_YOUR_NEW_KEY_FROM_AISTUDIO") {
  Write-Host "GEMINI_API_KEY missing or placeholder in .env.local" -ForegroundColor Red
  exit 1
}

# ---------- secret ----------
Write-Host "creating/updating Secret Manager secret '$SecretName'..."
$exists = (gcloud secrets describe $SecretName --quiet 2>$null)
if ($LASTEXITCODE -eq 0) {
  $GeminiKey | gcloud secrets versions add $SecretName --data-file=- --quiet
  Write-Host "  added new version"
} else {
  $GeminiKey | gcloud secrets create $SecretName --replication-policy=automatic --data-file=- --quiet
  Write-Host "  secret created"
}

# ---------- grant access ----------
$ProjectNumber = (gcloud projects describe $ProjectId --format="value(projectNumber)")
$RuntimeSA = "$ProjectNumber-compute@developer.gserviceaccount.com"
Write-Host "granting secretAccessor to runtime SA ($RuntimeSA)..."
gcloud secrets add-iam-policy-binding $SecretName --member="serviceAccount:$RuntimeSA" --role="roles/secretmanager.secretAccessor" --quiet | Out-Null

# ---------- deploy ----------
Write-Host "deploying to Cloud Run..."
gcloud run deploy $Service `
  --source . `
  --region $Region `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10 `
  --timeout 300 `
  --set-secrets="GEMINI_API_KEY=$($SecretName):latest" `
  --set-env-vars="GEMINI_MODEL=gemini-2.5-flash,GEMINI_LIVE_MODEL=gemini-2.5-flash-native-audio-preview-12-2025,FRONTEND_ORIGIN=$FrontendOrigin" `
  --quiet

$Url = (gcloud run services describe $Service --region $Region --format="value(status.url)")

Write-Host ""
Write-Host "============================================================"
Write-Host "DEPLOYED"
Write-Host "URL: $Url"
Write-Host "============================================================"
Write-Host ""
Write-Host "Next:"
Write-Host "  `$env:VITE_API_BASE = `"$Url`"; npm run build:client"
Write-Host "  gsutil -m rsync -r -d dist/public/ gs://YOUR_BUCKET/"
