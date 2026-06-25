@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Adding API routes... > push8_log.txt
"%GIT%" add app/api/ >> push8_log.txt 2>&1
"%GIT%" commit -m "Add missing API routes: contact, auth, countries, public/footer" >> push8_log.txt 2>&1
"%GIT%" push https://github.com/nedgerrard-ctrl/Propertied.git main >> push8_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push8_log.txt
echo Done. >> push8_log.txt
