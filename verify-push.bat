@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Checking remote status... > verify-push-log.txt
"%GIT%" fetch origin >> verify-push-log.txt 2>&1
echo. >> verify-push-log.txt
echo Local last 3 commits: >> verify-push-log.txt
"%GIT%" log --oneline -3 >> verify-push-log.txt 2>&1
echo. >> verify-push-log.txt
echo Remote last 3 commits: >> verify-push-log.txt
"%GIT%" log --oneline origin/main -3 >> verify-push-log.txt 2>&1
echo. >> verify-push-log.txt
echo Branch status: >> verify-push-log.txt
"%GIT%" status -sb >> verify-push-log.txt 2>&1
echo. >> verify-push-log.txt
echo Checking if push is needed... >> verify-push-log.txt
"%GIT%" log origin/main..main --oneline >> verify-push-log.txt 2>&1
echo (empty above = already pushed) >> verify-push-log.txt
echo Done. >> verify-push-log.txt
