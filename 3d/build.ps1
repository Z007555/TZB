param([string]$Output = (Join-Path $PSScriptRoot 'dist'))
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$dist = (New-Item -ItemType Directory -Force -Path $Output).FullName
$work = (New-Item -ItemType Directory -Force -Path (Join-Path $dist 'build')).FullName
$source = Join-Path $PSScriptRoot '夺机追梦者.py'
$sphere = python -c "from pathlib import Path; import pybullet_data; print(Path(pybullet_data.getDataPath()) / 'sphere_smooth.obj')"
if (!(Test-Path -LiteralPath $sphere -PathType Leaf)) { throw 'PyBullet sphere model is missing.' }

python -m PyInstaller --noconfirm --onefile --windowed --noupx `
  --name SleepGuardian-3D-Windows-x64 --distpath $dist --workpath $work --specpath $work `
  --add-data "${sphere}:pybullet_data" $source

$exe = Join-Path $dist 'SleepGuardian-3D-Windows-x64.exe'
$frames = (New-Item -ItemType Directory -Path (Join-Path $work ([guid]::NewGuid().ToString('N')))).FullName
$process = Start-Process -FilePath $exe -ArgumentList @(
  '--capture', '--width', '640', '--height', '360', '--pose', 'prone', '--emergency',
  '--times', '0', '22.4', '25.5', '41', '47.4', '49.2', '51.5',
  '--output', ('"' + $frames + '"')
) -WindowStyle Hidden -PassThru
if (!$process.WaitForExit(120000)) { throw 'EXE rendering verification timed out.' }
if ($process.ExitCode -ne 0) { throw "EXE rendering failed: $($process.ExitCode)" }
foreach ($time in '000.0','022.4','025.5','041.0','047.4','049.2','051.5') {
  $image = Get-Item -LiteralPath (Join-Path $frames "story_${time}s.png")
  if ($image.Length -lt 1024) { throw "Invalid verification frame: $($image.Name)" }
}
Get-FileHash -LiteralPath $exe
