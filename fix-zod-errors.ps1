Get-ChildItem -Path 'src\app\api\admin' -Recurse -Filter 'route.ts' | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content $path -Raw
    $changed = $false
    if ($content -match '\.ZodError\)\.errors') {
        $content = $content -replace '\(error as z\.ZodError\)\.errors', '(error as any).issues'
        $changed = $true
    }
    if ($content -match 'error\.errors') {
        $content = $content -replace 'error\.errors', '(error as any).issues'
        $changed = $true
    }
    if ($changed) {
        Set-Content -Path $path -Value $content -NoNewline
        Write-Host "Fixed: $path"
    }
}
