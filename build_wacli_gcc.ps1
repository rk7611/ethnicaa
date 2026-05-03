$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

Write-Host "Downloading WinLibs GCC (C compiler needed for SQLite)..."
if (-not (Test-Path "gcc.zip")) {
    Invoke-WebRequest -Uri "https://github.com/brechtsanders/winlibs_mingw/releases/download/13.2.0posix-17.0.6-11.0.1-ucrt-r5/winlibs-x86_64-posix-seh-gcc-13.2.0-mingw-w64ucrt-11.0.1-r5.zip" -OutFile "gcc.zip"
}

Write-Host "Extracting GCC... (This may take a minute)"
if (-not (Test-Path "mingw64\bin\gcc.exe")) {
    Expand-Archive -Path "gcc.zip" -DestinationPath "." -Force
}

Write-Host "Downloading Go 1.23.0..."
if (-not (Test-Path "go.zip")) {
    Invoke-WebRequest -Uri "https://go.dev/dl/go1.23.0.windows-amd64.zip" -OutFile "go.zip"
}

Write-Host "Extracting Go..."
if (-not (Test-Path "go\bin\go.exe")) {
    Expand-Archive -Path "go.zip" -DestinationPath "." -Force
}

Write-Host "Setting up environment for CGO..."
$env:Path = "$pwd\mingw64\bin;$pwd\go\bin;" + $env:Path
$env:CGO_ENABLED = "1"

Write-Host "Re-building wacli..."
cd d:\wacli
go build -tags sqlite_fts5 -o .\dist\wacli.exe .\cmd\wacli

Write-Host "Cleaning up GCC and Go..."
cd d:\ETHNICAA
Remove-Item -Recurse -Force "mingw64"
Remove-Item -Force "gcc.zip"
Remove-Item -Recurse -Force "go"
Remove-Item -Force "go.zip"

Write-Host "Done! The executable at d:\wacli\dist\wacli.exe has been rebuilt with SQLite support."
