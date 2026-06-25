@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT="C:\Program Files\Git\cmd\git.exe"
if not exist %GIT% set GIT="C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe"
%GIT% push origin main
echo Done. Press any key.
pause
