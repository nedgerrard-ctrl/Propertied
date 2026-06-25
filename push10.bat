@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Adding admin content API routes... > push10_log.txt
"%GIT%" add app/api/admin/ app/admin/dashboard/reset-content-button.tsx app/admin/dashboard/page.tsx >> push10_log.txt 2>&1
"%GIT%" commit -m "Add admin content API routes (GET/PATCH/DELETE per page) + reset-all endpoint + Reset Content button in dashboard" >> push10_log.txt 2>&1
"%GIT%" push origin main >> push10_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push10_log.txt
echo Done. >> push10_log.txt
