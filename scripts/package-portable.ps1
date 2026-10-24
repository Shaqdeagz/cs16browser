$ErrorActionPreference = 'Stop'
$exe = 'src-tauri/target/x86_64-pc-windows-msvc/release/cs16browser.exe'
if (!(Test-Path $exe)) { throw "Missing compiled EXE: $exe" }
$bytes = [IO.File]::ReadAllBytes((Resolve-Path $exe))
if ([BitConverter]::ToUInt16($bytes, 0) -ne 0x5A4D) { throw 'Not MZ' }
$pe = [BitConverter]::ToInt32($bytes, 0x3C)
if ([BitConverter]::ToUInt32($bytes, $pe) -ne 0x4550) { throw 'Not PE' }
if ([BitConverter]::ToUInt16($bytes, $pe + 4) -ne 0x8664) { throw 'Not AMD64' }
if ([BitConverter]::ToUInt16($bytes, $pe + 24) -ne 0x20B) { throw 'Not PE32+' }
New-Item -ItemType Directory -Force portable | Out-Null
Copy-Item $exe portable/cs16browser-portable.exe
Copy-Item LICENSE portable/LICENSE-GPL-3.0.txt
Copy-Item PORTABLE.md portable/README.txt
$sha = git rev-parse HEAD
"GPL source: https://github.com/Shaqdeagz/cs16browser/tree/$sha" | Set-Content portable/SOURCE.txt
git archive --format=zip --output=portable/source.zip HEAD
$probe = Start-Process -FilePath (Resolve-Path 'portable/cs16browser-portable.exe') -WorkingDirectory (Resolve-Path portable) -PassThru -WindowStyle Hidden
try {
  $deadline = (Get-Date).AddSeconds(40)
  do {
    Start-Sleep -Milliseconds 500
    $probe.Refresh()
    if ($probe.HasExited) { throw "Application exited: $($probe.ExitCode)" }
  } while ($probe.MainWindowHandle -eq 0 -and (Get-Date) -lt $deadline)
  if ($probe.MainWindowHandle -eq 0) { throw 'No application window' }
  "PASS: MZ, PE32+, AMD64; window: $($probe.MainWindowTitle)" | Set-Content portable/VERIFICATION.txt
} finally {
  if (!$probe.HasExited) {
    $null = $probe.CloseMainWindow()
    if (!$probe.WaitForExit(5000)) { $probe.Kill() }
  }
}
$files = 'cs16browser-portable.exe','LICENSE-GPL-3.0.txt','README.txt','SOURCE.txt','source.zip','VERIFICATION.txt'
Get-FileHash portable/cs16browser-portable.exe -Algorithm SHA256 | ForEach-Object { "$($_.Hash)  cs16browser-portable.exe" } | Set-Content portable/SHA256.txt
$files += 'SHA256.txt'
Compress-Archive -Path ($files | ForEach-Object { Join-Path portable $_ }) -DestinationPath cs16browser-custom-portable-win64.zip -Force
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::OpenRead((Resolve-Path cs16browser-custom-portable-win64.zip))
try {
  $entry = $zip.GetEntry('cs16browser-portable.exe')
  if (!$entry -or $entry.Length -ne $bytes.Length) { throw 'Packaged EXE missing or size differs' }
} finally { $zip.Dispose() }
Get-Content portable/VERIFICATION.txt
Get-FileHash cs16browser-custom-portable-win64.zip
