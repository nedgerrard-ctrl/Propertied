@echo off
setlocal

set GIT="C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe"
set REMOTE=https://github.com/nedgerrard-ctrl/Propertied.git

cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"

echo Removing stale git locks...
if exist .git\index.lock del /f .git\index.lock

echo Staging changed files...
%GIT% add app/LandingPage.tsx
%GIT% add app/api/blogs/route.ts
%GIT% add app/api/contact/route.ts
%GIT% add app/api/countries/route.ts
%GIT% add app/api/admin/reset-admin-password/route.ts

echo Committing...
%GIT% commit -m "fix: blog API route, force-dynamic on API routes, disable reset-admin-password, fix testimonial link"
echo Exit code: %ERRORLEVEL%

echo.
echo Pushing to GitHub...
%GIT% push %REMOTE% main
echo Exit code: %ERRORLEVEL%

echo.
echo Remote last 3 commits:
%GIT% log --oneline -3 origin/main

echo.
echo Done.
pause
