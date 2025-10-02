# 只支援 linux base shell (windows 可以用 git bash)

ROOT_DIR := justfile_directory()

frontend-dev:
    cd website && npm install && npm run dev
    

start:
    minikube start --driver=docker
    minikube addons enable ingress
    kubectl create namespace dev
    # 設定 權限
    kubectl apply -f k8s/rbac.yaml

    just rate-limiter
    just consistent-hashing
    just forwarding
    minikube tunnel

stop:
    minikube delete

forwarding:
    #!/usr/bin/env sh
    # wait for controller ready
    while ! kubectl get pods -n ingress-nginx | grep ingress-nginx-controller | grep -q 1/1; do
        sleep 2
    done
    kubectl apply -f k8s/ingress.yaml


rate-limiter:
    kubectl apply -f k8s/distributed-rate-limiter/rate-limiter-deployment.yaml
    kubectl apply -f k8s/distributed-rate-limiter/rate-limiter-service.yaml
    just redis-standalone


consistent-hashing:
    kubectl apply -f k8s/consistent-hashing/consistent-hashing-deployment.yaml
    kubectl apply -f k8s/consistent-hashing/consistent-hashing-service.yaml


redis-standalone:
    kubectl apply -f k8s/redis-standalone/redis-secret.yaml
    kubectl apply -f k8s/redis-standalone/redis-configmap.yaml
    kubectl apply -f k8s/redis-standalone/redis-pvc.yaml
    kubectl apply -f k8s/redis-standalone/redis-deployment.yaml
    kubectl apply -f k8s/redis-standalone/redis-service.yaml


redis-standalone-clear:
    kubectl delete all -l app=redis-standalone -n dev
    kubectl delete secret -l app=redis-standalone -n dev
    kubectl delete pvc -l app=redis-standalone -n dev

clear:
    kubectl delete all -l app=simple-server -n dev
    just redis-standalone-clear

docker-push:
    docker login
    docker build -t hanbro0112/rate-limiter:latest distributed-rate-limiter
    docker push hanbro0112/rate-limiter:latest
    # docker build -t hanbro0112/consistent-hashing:latest consistent-hashing
    # docker push hanbro0112/consistent-hashing:latest
    # docker build -t hanbro0112/simple-server:latest k8s/consistent-hashing/simple-server
    # docker push hanbro0112/simple-server:latest
    docker image prune -f

update:
    just docker-push
    kubectl set image deployment/rate-limiter rate-limiter=hanbro0112/rate-limiter:latest -n dev
    kubectl rollout restart deployment rate-limiter -n dev
    # kubectl set image deployment/consistent-hashing consistent-hashing=hanbro0112/consistent-hashing:latest -n dev
    # kubectl rollout restart deployment consistent-hashing -n dev
    