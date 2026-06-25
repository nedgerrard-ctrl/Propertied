@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Removing stale git locks... > push12_log.txt
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
echo Locks cleared. >> push12_log.txt
echo. >> push12_log.txt

echo Committing all remaining project files... >> push12_log.txt
"%GIT%" add -u >> push12_log.txt 2>&1
"%GIT%" commit -m "Sync all accumulated changes: content defaults, page components, models, auth, CMS, footer email fix" >> push12_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push12_log.txt
echo. >> push12_log.txt
echo Pushing to GitHub... >> push12_log.txt
"%GIT%" push https://github.com/nedgerrard-ctrl/Propertied.git main >> push12_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push12_log.txt
echo. >> push12_log.txt
echo Remote last 3 commits after push: >> push12_log.txt
"%GIT%" log --oneline -3 >> push12_log.txt 2>&1
echo Done. >> push12_log.txt
