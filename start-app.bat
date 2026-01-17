@echo off
echo Starting Bloosm Flower Shop Application...
cd /d E:\bloosm

REM Set Java 25
set "JAVA_HOME=C:\Program Files\Java\jdk-25"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Cleaning and compiling...
call mvnw.cmd clean compile

echo Starting Spring Boot application...
call mvnw.cmd spring-boot:run

pause
