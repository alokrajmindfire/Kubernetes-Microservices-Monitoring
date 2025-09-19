#!/bin/bash
set -e

echo "Starting Minikube..."
minikube start --driver=docker

echo "Enabling Ingress addon..."
minikube addons enable ingress
minikube addons enable metrics-server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

kubectl patch deployment metrics-server -n kube-system   --type='json'   -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
kubectl delete pod -n kube-system -l "k8s-app=metrics-server"

echo "Creating namespaces..."
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace default --dry-run=client -o yaml | kubectl apply -f -

echo "Applying Redis..."
kubectl apply -f k8s/redis.yaml

echo "Applying ConfigMaps..."
kubectl apply -f k8s/service-configmap.yaml

echo "Deploying Services..."
kubectl apply -f k8s/services/

echo "Deploying Deployments..."
kubectl apply -f k8s/deployments/

echo "Installing Prometheus + Grafana via Helm..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  -f k8s/monitoring/values.yaml \
  -n monitoring

echo "Waiting for monitoring components to be ready..."
kubectl wait --for=condition=available deployment --all -n monitoring --timeout=300s

echo "Applying custom monitoring configs (dashboards, datasources, ServiceMonitors)..."
find k8s/monitoring -name '*.yaml' ! -name 'values.yaml' -exec kubectl apply -f {} \;

echo "Applying Ingress..."
kubectl apply -f k8s/ingress.yaml

echo "Applying HPA..."
kubectl apply -f k8s/hpa.yaml

echo "Checking metrics-server deployment..."
kubectl get deployment metrics-server -n kube-system

echo "All resources deployed!"
echo "---------------------------------------------"
echo "Check pods:        kubectl get pods -A"
echo "Access services:   minikube service list"
echo "Access Grafana:    minikube service -n monitoring monitoring-grafana"

echo '
Open PowerShell as Administrator
Run:
  minikube tunnel    # to access services locally
  and expose hosts:
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "127.0.0.1 prometheus.local grafana.local service-a.local"
'
