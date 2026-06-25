$body = @{
    resetKey    = "ppm-admin-reset-2026"
    email       = "nedgerrard@gmail.com"
    newPassword = "PpmAdmin2026!"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod `
        -Uri "https://propertied.netlify.app/api/admin/reset-admin-password" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    Write-Output "SUCCESS: $($result.message)"
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    Write-Output $_.ErrorDetails.Message
}
