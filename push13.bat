@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Removing stale git locks... > push13_log.txt
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"

echo Committing BuyersPage price fix... >> push13_log.txt
"%GIT%" add app/buyers/BuyersPage.tsx >> push13_log.txt 2>&1
"%GIT%" commit -m "fix: remove double 'From $' prefix in project price display on buyers pages" >> push13_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push13_log.txt
echo. >> push13_log.txt

echo Pushing to GitHub... >> push13_log.txt
"%GIT%" push https://github.com/nedgerrard-ctrl/Propertied.git main >> push13_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push13_log.txt
echo. >> push13_log.txt
echo Remote last 3 commits: >> push13_log.txt
"%GIT%" log --oneline -3 >> push13_log.txt 2>&1
echo Done. >> push13_log.txt
