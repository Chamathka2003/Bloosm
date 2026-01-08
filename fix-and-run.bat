@echo off
echo Fixing Bloosm Application...
cd /d E:\bloosm

REM Copy old working target folder backup if exists
if exist target-backup (
    echo Restoring from backup...
    rmdir /s /q target
    xcopy target-backup target /E /I /Y
    goto run
)

REM Clean and rebuild with Java 17
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;C:\Program Files\apache-maven-3.9.12-bin\apache-maven-3.9.12\bin;%PATH%

echo Compiling with Java 17...
call mvn clean compile

if errorlevel 1 (
    echo Compilation failed! 
    pause
    exit /b 1
)

:run
echo Starting application...
call mvn spring-boot:run

pause
