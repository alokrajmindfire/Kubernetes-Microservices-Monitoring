# Kubernetes Microservices Monitoring System

A comprehensive microservices-based system demonstrating job processing, auto-scaling, and monitoring with Kubernetes, Prometheus, and Grafana.

## Architecture Overview

### Services

1. **Service A (API Gateway)** - Port 3001
   - Job submission endpoint: `POST /submit`
   - Job status endpoint: `GET /status/:jobId`
   - Handles incoming requests and queues jobs in Redis
   - Exposes Prometheus metrics

2. **Service B (Worker)** - Port 3002
   - CPU-intensive job processor with auto-scaling capabilities
   - Consumes jobs from Redis queue
   - Performs various CPU-intensive operations:
     - Prime number calculation
     - Bcrypt hashing
     - Large array sorting
     - Fibonacci computation
     - Matrix multiplication
   - Horizontally scaled based on CPU usage (2-10 replicas)

3. **Service C (Stats Aggregator)** - Port 3003
   - System statistics and analytics endpoint: `GET /stats`
   - Worker performance metrics: `GET /workers`
   - Comprehensive system monitoring data
   - Prometheus metrics for overall system health

### Infrastructure

- **Redis**: Message queue and job state storage
- **Prometheus**: Metrics collection and storage
- **Grafana**: Monitoring dashboards and visualization
- **Kubernetes HPA**: Automatic scaling for Service B

## Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (Minikube, Kind, or cloud provider)
- kubectl configured
- Helm 3.x
- Optional: Apache Bench (ab) for load testing

## Quick Start

### 1. Build and Deploy Services

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Build Docker images
./scripts/build-images.sh

# Deploy to Kubernetes
./scripts/deploy.sh
```

### 2. Install Monitoring Stack

```bash
# Install Prometheus and Grafana
./scripts/install-monitoring.sh
```

### 3. Run Stress Test

```bash
# Execute load test to trigger auto-scaling
./scripts/stress-test.sh
```

## Detailed Setup Instructions

### For Minikube

```bash
# Start Minikube with sufficient resources
minikube start --cpus=4 --memory=8192 --disk-size=20g

# Enable Ingress addon
minikube addons enable ingress

# Deploy the system
./scripts/build-images.sh
./scripts/deploy.sh
./scripts/install-monitoring.sh
```

### For Cloud Kubernetes (GKE, EKS, AKS)

```bash
# Ensure kubectl is configured for your cluster
kubectl config current-context

# Deploy services (images will be pulled from registry or built locally)
./scripts/deploy.sh

# Install monitoring
./scripts/install-monitoring.sh
```

## System Endpoints

### API Endpoints

- **Job Submission**: `POST /submit`
  ```json
  {
    "type": "primes",
    "data": {"limit": 100000}
  }
  ```

- **Job Status**: `GET /status/:jobId`
- **System Stats**: `GET /stats`
- **Worker Analytics**: `GET /workers`

### Monitoring Endpoints

- **Grafana Dashboard**: Access via LoadBalancer IP or port-forward
  - Username: `admin`
  - Password: `prom-operator`

- **Prometheus**: Port-forward to access UI
  ```bash
  kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090:9090 -n microservices-monitoring
  ```

## Load Testing

### Using Built-in Stress Test

```bash
# Comprehensive stress test with monitoring
./scripts/stress-test.sh
```

### Using Node.js Load Tester

```bash
# Install dependencies
cd load-test
npm install

# Run custom load test
TARGET_URL=http://your-api-endpoint CONCURRENT_REQUESTS=20 TEST_DURATION=120 node load-test.js
```

### Using Apache Bench

```bash
# Quick load test
ab -n 1000 -c 50 -p job-data.json -T application/json http://your-api-endpoint/submit
```

## Job Types

The system supports various CPU-intensive job types:

1. **Primes**: Calculate prime numbers up to a limit
   ```json
   {"type": "primes", "data": {"limit": 100000}}
   ```

2. **Bcrypt**: Password hashing with configurable rounds
   ```json
   {"type": "bcrypt", "data": {"text": "password", "rounds": 12}}
   ```

3. **Sort**: Generate and sort large arrays
   ```json
   {"type": "sort", "data": {"size": 100000}}
   ```

4. **Fibonacci**: Recursive Fibonacci calculation
   ```json
   {"type": "fibonacci", "data": {"n": 35}}
   ```

5. **Matrix**: Matrix multiplication
   ```json
   {"type": "matrix", "data": {"size": 100}}
   ```

## Monitoring and Metrics

### Key Metrics Tracked

**Service A (API Gateway)**:
- `jobs_submitted_total`: Total jobs submitted
- `api_requests_total`: HTTP request counts by endpoint/status
- `api_request_duration_seconds`: Request duration histogram

**Service B (Worker)**:
- `jobs_processed_total`: Jobs processed by status
- `job_processing_time_seconds`: Processing time histogram
- `job_errors_total`: Error counts by type
- `active_jobs_current`: Current active job count
- `cpu_intensive_operations_total`: CPU operation counts

**Service C (Stats)**:
- `total_jobs_submitted`: System-wide job submission count
- `total_jobs_completed`: System-wide completion count
- `queue_length`: Current Redis queue length
- `avg_processing_time_seconds`: Average processing time
- `system_health_score`: Overall system health (0-1)

### Grafana Dashboards

The system includes a comprehensive monitoring dashboard showing:
- Job throughput and processing rates
- Queue length and backlog
- Processing time percentiles
- Worker pod scaling visualization
- CPU usage across worker pods
- Error rates and system health

## Auto-Scaling Configuration

Service B uses Horizontal Pod Autoscaler with:
- **Min Replicas**: 2
- **Max Replicas**: 10
- **CPU Target**: 70% utilization
- **Memory Target**: 80% utilization
- **Scale Up**: 100% increase every 15 seconds
- **Scale Down**: 50% decrease every 60 seconds

## Performance Observations

During stress testing, you should observe:

1. **Initial State**: 2 worker pods handling baseline load
2. **Load Increase**: Queue length grows as jobs are submitted faster than processed
3. **Scaling Trigger**: CPU usage exceeds 70%, triggering HPA
4. **Pod Creation**: New worker pods are created (up to 10 total)
5. **Load Distribution**: Jobs distributed across scaled pods
6. **Queue Drainage**: Backlog clears as processing capacity increases
7. **Scale Down**: After load decreases, pods are gradually removed

## Troubleshooting

### Common Issues

1. **Images not found**: Ensure Docker images are built and available in cluster
   ```bash
   # For Minikube
   eval $(minikube docker-env)
   ./scripts/build-images.sh
   ```

2. **Pods stuck in Pending**: Check resource availability
   ```bash
   kubectl describe nodes
   kubectl get events -n microservices-monitoring
   ```

3. **Redis connection issues**: Verify Redis pod is running
   ```bash
   kubectl logs deployment/redis -n microservices-monitoring
   ```

4. **Metrics not appearing**: Check Prometheus targets
   ```bash
   kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090:9090 -n microservices-monitoring
   # Access http://localhost:9090/targets
   ```

### Useful Commands

```bash
# Check all resources
kubectl get all -n microservices-monitoring

# View logs
kubectl logs deployment/service-a -n microservices-monitoring
kubectl logs deployment/service-b -n microservices-monitoring --tail=100

# Check HPA status
kubectl get hpa -n microservices-monitoring

# Scale manually for testing
kubectl scale deployment service-b --replicas=5 -n microservices-monitoring

# Port forward for local testing
kubectl port-forward svc/service-a 8080:80 -n microservices-monitoring
```

## Cleanup

Remove all resources:
```bash
./scripts/cleanup.sh
```
