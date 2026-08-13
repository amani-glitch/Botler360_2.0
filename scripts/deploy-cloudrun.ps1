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

# Piping a string straight into a native command's stdin (`$x | gcloud ... --data-file=-`)
# lets PowerShell's pipeline encoding prepend a UTF-8 BOM (U+FEFF) to the bytes gcloud
# receives — invisible in the console, but it corrupts the secret value itself. Write to
# a real no-BOM UTF8 temp file instead and pass --data-file=<path>.
function Set-GcloudSecretValue([string]$Name, [string]$Value, [bool]$SecretExists) {
  $tmp = [System.IO.Path]::GetTempFileName()
  try {
    [System.IO.File]::WriteAllText($tmp, $Value, [System.Text.UTF8Encoding]::new($false))
    if ($SecretExists) {
      gcloud secrets versions add $Name --data-file="$tmp" --quiet
    } else {
      gcloud secrets create $Name --replication-policy=automatic --data-file="$tmp" --quiet
    }
  } finally {
    Remove-Item $tmp -ErrorAction SilentlyContinue
  }
}

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
$secretExists = ($LASTEXITCODE -eq 0)
Set-GcloudSecretValue -Name $SecretName -Value $GeminiKey -SecretExists $secretExists
Write-Host $(if ($secretExists) { "  added new version" } else { "  secret created" })

# ---------- grant access ----------
$ProjectNumber = (gcloud projects describe $ProjectId --format="value(projectNumber)")
$RuntimeSA = "$ProjectNumber-compute@developer.gserviceaccount.com"
Write-Host "granting secretAccessor to runtime SA ($RuntimeSA)..."
gcloud secrets add-iam-policy-binding $SecretName --member="serviceAccount:$RuntimeSA" --role="roles/secretmanager.secretAccessor" --quiet | Out-Null

# ---------- SMTP (Contact form → email), optional ----------
# Only wired up if .env.local has real (non-placeholder) values — otherwise
# /api/contact just returns a clean "not configured" error, same as today.
$SmtpVars = @{}
foreach ($line in Get-Content .env.local) {
  if ($line -match "^(SMTP_HOST|SMTP_PORT|SMTP_SECURE|SMTP_USER|SMTP_PASS|MAIL_FROM|MAIL_TO)=(.*)$") {
    $SmtpVars[$Matches[1]] = $Matches[2].Trim()
  }
}
$SmtpConfigured = $SmtpVars.ContainsKey("SMTP_HOST") -and $SmtpVars["SMTP_HOST"] -and
  $SmtpVars["SMTP_HOST"] -notlike "REPLACE_WITH_*" -and
  $SmtpVars.ContainsKey("SMTP_USER") -and $SmtpVars["SMTP_USER"] -notlike "REPLACE_WITH_*" -and
  $SmtpVars.ContainsKey("SMTP_PASS") -and $SmtpVars["SMTP_PASS"] -notlike "REPLACE_WITH_*"

$SmtpSecretName = "smtp-pass"
$ExtraEnvVars = ""
$ExtraSecrets = ""
if ($SmtpConfigured) {
  Write-Host "SMTP configured — wiring up secret '$SmtpSecretName' + env vars..."
  $existsSmtp = (gcloud secrets describe $SmtpSecretName --quiet 2>$null)
  Set-GcloudSecretValue -Name $SmtpSecretName -Value $SmtpVars["SMTP_PASS"] -SecretExists ($LASTEXITCODE -eq 0)
  gcloud secrets add-iam-policy-binding $SmtpSecretName --member="serviceAccount:$RuntimeSA" --role="roles/secretmanager.secretAccessor" --quiet | Out-Null
  $ExtraSecrets = ",SMTP_PASS=$($SmtpSecretName):latest"
  $port = if ($SmtpVars.ContainsKey("SMTP_PORT")) { $SmtpVars["SMTP_PORT"] } else { "587" }
  $secure = if ($SmtpVars.ContainsKey("SMTP_SECURE")) { $SmtpVars["SMTP_SECURE"] } else { "false" }
  $mailFrom = if ($SmtpVars.ContainsKey("MAIL_FROM")) { $SmtpVars["MAIL_FROM"] } else { $SmtpVars["SMTP_USER"] }
  $mailTo = if ($SmtpVars.ContainsKey("MAIL_TO")) { $SmtpVars["MAIL_TO"] } else { "contact@botler360.com" }
  $ExtraEnvVars = ",SMTP_HOST=$($SmtpVars['SMTP_HOST']),SMTP_PORT=$port,SMTP_SECURE=$secure,SMTP_USER=$($SmtpVars['SMTP_USER']),MAIL_FROM=$mailFrom,MAIL_TO=$mailTo"
} else {
  Write-Host "SMTP not configured in .env.local (still placeholder) — skipping, /api/contact will return a clean error in prod." -ForegroundColor Yellow
}

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
  --set-secrets="GEMINI_API_KEY=$($SecretName):latest$ExtraSecrets" `
  --set-env-vars="GEMINI_MODEL=gemini-2.5-flash,GEMINI_LIVE_MODEL=gemini-2.5-flash-native-audio-preview-12-2025,FRONTEND_ORIGIN=$FrontendOrigin$ExtraEnvVars" `
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
