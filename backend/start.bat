@echo off
echo Starting Online Education System Backend...
echo.

REM Set JAVA_HOME if needed
REM set JAVA_HOME=C:\Path\To\Your\Java8

echo Compiling project...
call mvn clean compile -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo Compilation failed!
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8080
echo API endpoints will be at: http://localhost:8080/api
echo.

call mvn spring-boot:run -DskipTests
pause