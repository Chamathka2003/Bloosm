@echo off
setlocal
set "JAVA_HOME=C:\Program Files\Java\jdk-25"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo JAVA_HOME is set to: %JAVA_HOME%
echo.
echo Checking Java version...
java -version
echo.

echo Starting Spring Boot application...
"%JAVA_HOME%\bin\java.exe" -Dmaven.multiModuleProjectDirectory="%CD%" -cp ".mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain spring-boot:run
