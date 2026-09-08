@echo off
title ToolNest Web Server
echo Starting ToolNest server on http://localhost:8080 ...
start http://localhost:8080
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080
pause
