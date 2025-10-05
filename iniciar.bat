@echo off
title Iniciando Jogo Unigran...
color 0A

:: Caminho do projeto
::cd /d "C:\jogo_unigran"
cd D:/pastas pessoais/Area de Trabalho/jogo_unigran

:: Inicia o servidor Node.js
echo Iniciando o servidor Node.js...
start "" node server.js

:: Aguarda alguns segundos para o servidor iniciar
timeout /t 5 >nul

:: Abre o navegador em modo tela cheia (Google Chrome)
echo Abrindo o jogo no navegador...
start "" "chrome.exe" --start-fullscreen http://localhost:3000

:: Caso use outro navegador (Edge), use esta linha em vez da de cima:
:: start "" "msedge.exe" --start-fullscreen http://localhost:3000

echo Servidor e jogo iniciados com sucesso!
pause
