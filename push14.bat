@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
set GIT=C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe

echo Removing stale git locks... > push14_log.txt
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"

echo Committing DB resilience fix (all public pages)... >> push14_log.txt
"%GIT%" add app/page.tsx app/about/page.tsx app/buyers/investors/page.tsx app/buyers/owner-occupiers/page.tsx app/blog/page.tsx "app/blog/[slug]/page.tsx" app/developer/page.tsx app/full-disclaimer/page.tsx app/insights/page.tsx "app/more/[slug]/page.tsx" app/off-the-plan-explainer/page.tsx app/our-people/page.tsx app/past-projects/page.tsx app/privacy-policy/page.tsx app/resources/page.tsx app/testimonial/page.tsx >> push14_log.txt 2>&1
"%GIT%" commit -m "fix: wrap all public page DB calls in try-catch so cold-start timeout never crashes the page" >> push14_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push14_log.txt
echo. >> push14_log.txt

echo Pushing to GitHub... >> push14_log.txt
"%GIT%" push https://github.com/nedgerrard-ctrl/Propertied.git main >> push14_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push14_log.txt
echo. >> push14_log.txt
echo Remote last 3 commits: >> push14_log.txt
"%GIT%" log --oneline -3 >> push14_log.txt 2>&1
echo Done. >> push14_log.txt
