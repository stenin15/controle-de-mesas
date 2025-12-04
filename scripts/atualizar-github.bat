@echo off
REM Script batch para atualizar GitHub automaticamente
REM Uso: scripts\atualizar-github.bat [mensagem do commit]

setlocal enabledelayedexpansion

echo ============================================================
echo 🚀 ATUALIZADOR AUTOMÁTICO DO GITHUB
echo ============================================================
echo.

REM Verificar se há mudanças
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo ✅ Nenhuma mudança para commitar!
    exit /b 0
)

REM Mostrar mudanças
echo 📋 Mudanças detectadas:
git status --short
echo.

REM Obter mensagem do commit
set "mensagem=%~1"
if "!mensagem!"=="" (
    for /f "tokens=2 delims==" %%a in ('wmic os get localdatetime /value') do set datetime=%%a
    set "mensagem=Update: !datetime:~0,4!/!datetime:~4,2!/!datetime:~6,2! !datetime:~8,2!:!datetime:~10,2!:!datetime:~12,2!"
)

echo 📝 Mensagem do commit: !mensagem!
echo.

REM Confirmar
set /p confirmar="Deseja continuar? (S/N): "
if /i not "!confirmar!"=="S" (
    echo Operação cancelada.
    exit /b 0
)

REM Adicionar todas as mudanças
echo.
echo 🔄 Adicionando todas as mudanças...
git add -A
if errorlevel 1 (
    echo ❌ Erro ao adicionar mudanças!
    exit /b 1
)
echo ✅ Mudanças adicionadas!
echo.

REM Fazer commit
echo 🔄 Fazendo commit...
git commit -m "!mensagem!"
if errorlevel 1 (
    echo ❌ Erro ao fazer commit!
    exit /b 1
)
echo ✅ Commit realizado!
echo.

REM Fazer push
echo 🔄 Enviando para o GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ Erro ao fazer push!
    exit /b 1
)
echo ✅ Push realizado!
echo.

echo ============================================================
echo ✅ REPOSITÓRIO ATUALIZADO COM SUCESSO!
echo ============================================================
echo 📝 Commit: !mensagem!
echo 🌐 GitHub: https://github.com/stenin15/controle-de-mesas
echo.

endlocal

