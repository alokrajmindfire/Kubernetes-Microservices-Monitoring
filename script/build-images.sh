#!/bin/bash

set -e

echo "Building microservices Docker images..."

# Build Service A
echo "Building Service A ..."
docker build -t <DOCKER_USERNAME>/service-a:0.1 .
docker push  <DOCKER_USERNAME>/service-a:0.1


# Build Service B
echo "Building Service B (Worker)..."
docker build -t  <DOCKER_USERNAME>/service-b:0.1 .
docker push  <DOCKER_USERNAME>/service-b:0.1

# Build Service C
docker build -t  <DOCKER_USERNAME>/service-c:0.1 .
docker push  <DOCKER_USERNAME>/service-c:0.1

echo "All images built and pushed successfully!"
