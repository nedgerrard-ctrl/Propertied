@echo off
cd /d "C:\Users\nedge\Desktop\ppmonlineprojects"
echo Running via PowerShell... > reset-admin-log.txt
powershell -ExecutionPolicy Bypass -File "C:\Users\nedge\Desktop\ppmonlineprojects\reset-admin.ps1" >> reset-admin-log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> reset-admin-log.txt
