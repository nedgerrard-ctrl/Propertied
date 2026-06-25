@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Pushing logo + hero video update... > push5_log.txt
"%GIT%" add app/components/Navbar.tsx >> push5_log.txt 2>&1
"%GIT%" add public/ppm-hero.mp4 >> push5_log.txt 2>&1
"%GIT%" commit -m "Update logo to chevron mark and hero video to user clips 1,3,4,5,6" >> push5_log.txt 2>&1
"%GIT%" push https://github.com/nedgerrard-ctrl/Propertied.git main >> push5_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push5_log.txt
echo Done. >> push5_log.txt
