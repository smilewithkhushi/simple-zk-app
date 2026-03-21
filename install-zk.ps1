$zkTools = "C:\Users\ADMIN\.zk-tools"
mkdir $zkTools -Force
cd $zkTools

Write-Host "Downloading Barretenberg..."
$bb_url = "https://github.com/AztecProtocol/barretenberg/releases/latest/download/bb-windows.exe"
try {
    Invoke-WebRequest -Uri $bb_url -OutFile "bb.exe"
    Write-Host "Barretenberg installed."
} catch {
    Write-Host "Failed to download Barretenberg: $_"
}

Write-Host "Downloading Nargo..."
$nargo_url = "https://github.com/noir-lang/noir/releases/latest/download/nargo-x86_64-pc-windows-msvc.zip"
try {
    Invoke-WebRequest -Uri $nargo_url -OutFile "nargo.zip"
    Expand-Archive -Path "nargo.zip" -DestinationPath "nargo-bin" -Force
    Write-Host "Nargo installed."
} catch {
    Write-Host "Failed to download Nargo: $_"
}

Write-Host "Updating PATH variable..."
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$pathsToAdd = @($zkTools, "$zkTools\nargo-bin\nargo-x86_64-pc-windows-msvc")

foreach ($p in $pathsToAdd) {
    if ($userPath -notmatch [regex]::Escape($p)) {
        $userPath += ";$p"
    }
}
[Environment]::SetEnvironmentVariable("Path", $userPath, "User")
Write-Host "PATH updated successfully."
