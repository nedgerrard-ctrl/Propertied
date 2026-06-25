@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
echo Testing login credentials... > test-login-log.txt
powershell -ExecutionPolicy Bypass -Command "$body = @{email='nedgerrard@gmail.com';password='PpmAdmin2026!'} | ConvertTo-Json; try { $r = Invoke-RestMethod -Uri 'https://propertied.netlify.app/api/auth/login' -Method POST -Body $body -ContentType 'application/json'; Write-Output \"LOGIN OK: $($r.message)\" } catch { Write-Output \"LOGIN FAIL: $($_.Exception.Message)\"; Write-Output $_.ErrorDetails.Message }" >> test-login-log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> test-login-log.txt
type test-login-log.txt
pause
