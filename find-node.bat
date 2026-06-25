@echo off
echo Searching for node.exe on this machine... > find-node-log.txt
echo. >> find-node-log.txt

echo --- AppData Local --- >> find-node-log.txt
dir /s /b "C:\Users\nedge\AppData\Local\node.exe" 2>>find-node-log.txt >> find-node-log.txt
dir /s /b "C:\Users\nedge\AppData\Local\*node*\node.exe" 2>>find-node-log.txt >> find-node-log.txt

echo --- AppData Roaming --- >> find-node-log.txt
dir /s /b "C:\Users\nedge\AppData\Roaming\node.exe" 2>>find-node-log.txt >> find-node-log.txt

echo --- Program Files --- >> find-node-log.txt
dir /s /b "C:\Program Files\*node*\node.exe" 2>>find-node-log.txt >> find-node-log.txt

echo --- PATH variable --- >> find-node-log.txt
echo %PATH% >> find-node-log.txt

echo Done. >> find-node-log.txt
