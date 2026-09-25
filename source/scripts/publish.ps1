# Build and publish to GitHub Pages:
#   powershell -File scripts\publish.ps1 "what changed"
# publish-repo/ is a working copy of https://github.com/yukonagamitsu-a11y/hitotabi
# (repo root = published site, source/ = code). ASCII only: Windows PowerShell 5.1 misreads UTF-8 without BOM.
param([string]$Message = 'Update')
$ErrorActionPreference = 'Continue'  # git writes progress to stderr, so do not use Stop
$env:Path = 'C:\Program Files\Git\cmd;' + $env:Path
$root = Split-Path $PSScriptRoot
$repo = Join-Path $root 'publish-repo'
Set-Location $root
npm run build | Out-Null

# Replace the site files (keep .git)
Get-ChildItem $repo -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force
Copy-Item (Join-Path $root 'dist\*') $repo -Recurse
$src = Join-Path $repo 'source'
New-Item -ItemType Directory $src | Out-Null
foreach ($f in 'package.json', 'vite.config.js', 'index.html', 'README.md', '.gitignore') { Copy-Item (Join-Path $root $f) $src }
foreach ($d in 'src', 'scripts', 'public') { Copy-Item (Join-Path $root $d) (Join-Path $src $d) -Recurse }

Set-Location $repo
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) { Write-Host 'No changes'; exit 0 }
git commit -q -m $Message
git push origin main
Write-Host "exit code: $LASTEXITCODE"
