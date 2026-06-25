@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
echo Starting dev server...
call pnpm dev
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo ERROR: pnpm dev failed. Trying npx next dev...
  npx next dev
)
pause
