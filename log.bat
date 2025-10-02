@echo off
:: 콘솔 코드페이지를 UTF-8로 변경
chcp 65001 >nul

:: PowerShell에서 출력 인코딩도 UTF-8로 명시
powershell -NoLogo -NoProfile -Command ^
  "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-Content -Path 'logs\\dowinsys_app.log' -Encoding UTF8 -Tail 20 -Wait"
