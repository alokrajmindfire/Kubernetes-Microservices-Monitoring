#!/bin/bash

set -euo pipefail

echo "Building microservices Docker images..."

# Function to build and push a service
build_service() {
  local service_name=$1
  local image_tag=$2

  echo "Building $service_name..."
  cd "../$service_name" || { echo "Directory $service_name not found"; exit 1; }

  docker build -t "$image_tag" .
  docker push "$image_tag"
  echo "$service_name built and pushed successfully!"
}

# Build Service A
build_service "service-a" "<your-docker-username>/service-a:0.1"

# Build Service B
build_service "service-b" "<your-docker-username>/service-b:0.1"

# Build Service C
build_service "service-c" "<your-docker-username>/service-c:0.1"

echo "All images built and pushed successfully!"
