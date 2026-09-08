@echo off
title Push ToolNest to GitHub
cd /d "%~dp0"
echo ========================================================
echo Pushing ToolNest to GitHub (https://github.com/vyas2610/ToolNest.git)...
echo ========================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo SUCCESS: ToolNest has been uploaded to GitHub!
    echo ========================================================
) else (
    echo ========================================================
    echo Notice: If prompted, please complete the sign-in above.
    echo ========================================================
)
echo.
pause
