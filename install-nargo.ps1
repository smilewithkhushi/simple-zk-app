Write-Host "Installing Noirup via Git Bash..."
$env:CURL_CA_BUNDLE = ""
& "C:\Program Files\Git\bin\bash.exe" -c "curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash"
& "C:\Program Files\Git\bin\bash.exe" -c "source ~/.bash_profile 2>/dev/null; source ~/.bashrc 2>/dev/null; noirup"
