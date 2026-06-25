@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Pushing commit 476f401 (MongoDB timeouts + Netlify nft bundler)... > push-fix-log.txt
"%GIT%" push https://github.com/nedgerrard-ctrl/Propertied.git main >> push-fix-log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push-fix-log.txt
echo. >> push-fix-log.txt
echo Remote last 3 commits after push: >> push-fix-log.txt
"%GIT%" fetch origin >> push-fix-log.txt 2>&1
"%GIT%" log --oneline origin/main -3 >> push-fix-log.txt 2>&1
echo Done. >> push-fix-log.txt
