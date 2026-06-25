@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Adding admin password reset route... > push11_log.txt
"%GIT%" add app/api/admin/reset-admin-password/ >> push11_log.txt 2>&1
"%GIT%" commit -m "Add one-time admin password reset endpoint" >> push11_log.txt 2>&1
"%GIT%" push https://github.com/nedgerrard-ctrl/Propertied.git main >> push11_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push11_log.txt
echo Done. >> push11_log.txt
