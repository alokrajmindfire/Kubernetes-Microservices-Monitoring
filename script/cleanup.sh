#!/bin/bash

set -e

echo "Cleaning up microservices monitoring system..."


# Delete namespace (this will delete all resources in the namespace)
echo "Deleting namespace and all resources..."
kubectl delete namespace microservices-monitoring --ignore-not-found=true

# Remove Prometheus/Grafana Helm release
echo "Removing monitoring stack..."
helm uninstall prometheus --namespace microservices-monitoring --ignore-not-found=true
minikube stop 
# minikube delete
echo "Cleanup completed!"