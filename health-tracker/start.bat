@echo off
chcp 65001 >nul
title 健康记录助手 - 本地服务器
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║   🏥 健康记录助手 本地服务器                           ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

:: 检查Node.js
where node >nul 2>nul
if %errorlevel% == 0 (
    echo [✓] 找到Node.js
    echo.
    echo 正在启动服务器...
    node server.js
) else (
    echo [✗] 未找到Node.js
    echo.
    echo 请安装Node.js: https://nodejs.org
    echo.
    echo 或者使用其他方式：
    echo 1. 使用Python: python -m http.server 8080
    echo 2. 使用VS Code Live Server扩展
    echo 3. 将文件部署到Web服务器
    echo.
    pause
)
