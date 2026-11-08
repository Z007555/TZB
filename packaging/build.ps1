param([string]$Output = (Join-Path $PSScriptRoot '../dist'))
$ErrorActionPreference = 'Stop'
$source = Split-Path $PSScriptRoot -Parent
$outputDir = (New-Item -Path $Output -ItemType Directory -Force).FullName
$page = [IO.File]::ReadAllText((Join-Path $source 'index.html'))
$css = [IO.File]::ReadAllText((Join-Path $source 'style.css'))
$controller = [IO.File]::ReadAllText((Join-Path $source 'controller.js'))
$app = [IO.File]::ReadAllText((Join-Path $source 'app.js'))
$page = $page.Replace('<link rel="stylesheet" href="style.css">', "<style>$css</style>")
$page = $page.Replace('<script src="controller.js"></script>', "<script>$controller</script>")
$page = $page.Replace('<script src="app.js"></script>', "<script>$app</script>")
$html = Join-Path $outputDir 'SleepGuardian.html'
[IO.File]::WriteAllText($html, $page, [Text.UTF8Encoding]::new($false))
$framework = Join-Path $env:WINDIR 'Microsoft.NET/Framework64/v4.0.30319'
$exe = Join-Path $outputDir 'SleepGuardian-Windows-x64.exe'
& (Join-Path $framework 'csc.exe') /nologo /target:winexe /platform:x64 /codepage:65001 /optimize+ "/out:$exe" "/resource:$html,SleepGuardian.html" "/reference:$framework/System.Windows.Forms.dll" (Join-Path $PSScriptRoot 'Launcher.cs')
if ($LASTEXITCODE -ne 0) { throw "Windows launcher compilation failed: $LASTEXITCODE" }
$probe = Join-Path $outputDir 'extraction-check.html'
$process = Start-Process -FilePath $exe -ArgumentList "--extract `"$probe`"" -WindowStyle Hidden -Wait -PassThru
if ($process.ExitCode -ne 0 -or (Get-FileHash $probe).Hash -ne (Get-FileHash $html).Hash) {
    throw 'Windows launcher did not extract the expected demo.'
}
Remove-Item -LiteralPath $probe
Get-FileHash -LiteralPath $exe,$html
