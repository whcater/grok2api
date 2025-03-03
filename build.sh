#!/bin/bash

echo "Building Docker image..."
docker login
# Set image name and tag
IMAGE_NAME="grok-api"
IMAGE_TAG="latest"

# Build Docker image
docker build -t $IMAGE_NAME:$IMAGE_TAG .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Docker image built successfully!"
    echo "Image name: $IMAGE_NAME:$IMAGE_TAG"
else
    echo "Error: Docker image build failed!"
fi