@echo off
echo Building Docker image...

:: 设置镜像名称和标签
set IMAGE_NAME=grok-api
set IMAGE_TAG=latest

:: 构建Docker镜像
docker build -t %IMAGE_NAME%:%IMAGE_TAG% .

:: 检查构建是否成功
if %ERRORLEVEL% EQU 0 (
    echo Docker image built successfully!
    echo Image name: %IMAGE_NAME%:%IMAGE_TAG%
) else (
    echo Error: Docker image build failed!
)

pause 