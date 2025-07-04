# run-vspend.ps1

Write-Host "Loading .env variables..."

# Read .env and set environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]+?)\s*=\s*(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
        Write-Host "✅ Set $name"
    }
}

Write-Host "Starting Spring Boot application..."
cd BackendVspend
mvn spring-boot:run

#Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser