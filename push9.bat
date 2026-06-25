@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Adding content defaults updates... > push9_log.txt
"%GIT%" add lib/our-people-defaults.ts lib/developer-defaults.ts lib/insights-defaults.ts lib/resources-defaults.ts lib/buyer-defaults.ts >> push9_log.txt 2>&1
"%GIT%" commit -m "Update all content defaults from recovered Claude Design JSX files" >> push9_log.txt 2>&1
"%GIT%" push https://github.com/nedgerrard-ctrl/Propertied.git main >> push9_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push9_log.txt
echo Done. >> push9_log.txt
