@echo off
setlocal
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"

set LOG=push16_log.txt
echo === Push16 Log === > %LOG%

REM --- Auto-find GitHub Desktop git.exe (handles any version) ---
set GIT=
for /d %%i in ("C:\Users\nedge\AppData\Local\GitHubDesktop\app-*") do (
  if exist "%%i\resources\app\git\cmd\git.exe" (
    set GIT="%%i\resources\app\git\cmd\git.exe"
  )
)

REM --- Fallback: try git from PATH ---
if not defined GIT (
  where git >nul 2>&1
  if %ERRORLEVEL% EQU 0 set GIT=git
)

if not defined GIT (
  echo ERROR: Could not find git.exe >> %LOG%
  echo ERROR: Could not find git.exe
  pause
  exit /b 1
)

echo Using git: %GIT% >> %LOG%
echo Using git: %GIT%

echo. >> %LOG%
echo Removing stale locks... >> %LOG%
if exist .git\index.lock del /f .git\index.lock

echo Pushing to GitHub... >> %LOG%
echo Pushing to GitHub...

%GIT% push https://github.com/nedgerrard-ctrl/Propertied.git main >> %LOG% 2>&1
set PUSH_CODE=%ERRORLEVEL%

echo Exit code: %PUSH_CODE% >> %LOG%
echo Exit code: %PUSH_CODE%

echo. >> %LOG%
%GIT% log --oneline -3 >> %LOG% 2>&1

echo. >> %LOG%
type %LOG%

echo.
pause
