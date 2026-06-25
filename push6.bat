@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Pushing testimonial + insights link fix... > push6_log.txt
"%GIT%" add lib/testimonial-defaults.ts >> push6_log.txt 2>&1
"%GIT%" add app/LandingPage.tsx >> push6_log.txt 2>&1
"%GIT%" commit -m "Condense Ashwin Lemaye testimonial and fix Insights link on landing page" >> push6_log.txt 2>&1
"%GIT%" push https://github.com/nedgerrard-ctrl/Propertied.git main >> push6_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push6_log.txt
echo Done. >> push6_log.txt
