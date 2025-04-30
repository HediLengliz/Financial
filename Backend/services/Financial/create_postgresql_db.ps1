$pgBin = "C:\Program Files\PostgreSQL\14\bin"

# Make sure the PostgreSQL service is running
$service = Get-Service postgresql-x64-14 -ErrorAction SilentlyContinue
if ($service -and $service.Status -ne "Running") {
    Write-Host "Starting PostgreSQL service..."
    Start-Service postgresql-x64-14 -ErrorAction SilentlyContinue
}

# If service is still not running, try to start PostgreSQL manually
if (-not $service -or $service.Status -ne "Running") {
    Write-Host "Service not running. Attempting to start PostgreSQL manually..."
    Start-Process -FilePath "$pgBin\pg_ctl.exe" -ArgumentList "start -D `"C:\Program Files\PostgreSQL\14\data`"" -NoNewWindow
    Start-Sleep -Seconds 5
}

Write-Host "Creating financialdb database and user..."

# Create the SQL file to execute
$sqlFile = "$PSScriptRoot\create_db.sql"
@"
DROP DATABASE IF EXISTS financialdb;
DROP ROLE IF EXISTS financial_admin;
CREATE ROLE financial_admin WITH LOGIN PASSWORD 'financial_password';
ALTER ROLE financial_admin CREATEDB;
CREATE DATABASE financialdb OWNER financial_admin;
GRANT ALL PRIVILEGES ON DATABASE financialdb TO financial_admin;
"@ | Out-File -FilePath $sqlFile -Encoding UTF8

# Execute the SQL file using psql
try {
    $env:PGPASSWORD = "postgres"
    & "$pgBin\psql.exe" -U postgres -f $sqlFile
    Write-Host "Database created successfully!"
} catch {
    Write-Host "Error creating database: $_"
}

# Clean up
Remove-Item $sqlFile -ErrorAction SilentlyContinue

Write-Host "Done!" 