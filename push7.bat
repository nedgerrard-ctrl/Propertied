@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Pushing email consistency fix... > push7_log.txt
"%GIT%" add lib/developer-defaults.ts >> push7_log.txt 2>&1
"%GIT%" add lib/full-disclaimer-sections.ts >> push7_log.txt 2>&1
"%GIT%" add lib/privacy-policy-sections.ts >> push7_log.txt 2>&1
"%GIT%" add app/developer/DeveloperPage.tsx >> push7_log.txt 2>&1
"%GIT%" add app/terms/page.tsx >> push7_log.txt 2>&1
"%GIT%" add app/admin/dashboard/content/developer/page.tsx >> push7_log.txt 2>&1
"%GIT%" add app/admin/dashboard/content/resources/page.tsx >> push7_log.txt 2>&1
"%GIT%" commit -m "Standardise admin email to admin@ppmproperty.com.au across all pages" >> push7_log.txt 2>&1
"%GIT%" push https://github.com/nedgerrard-ctrl/Propertied.git main >> push7_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push7_log.txt
echo Done. >> push7_log.txt
