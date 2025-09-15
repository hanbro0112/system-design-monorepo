# windows
# set shell := ["powershell.exe", "-c"]

alias l := local
alias ld := local-down

ROOT_DIR := justfile_directory()

frontend-dev:
    cd website && npm install && npm run dev

local:
    docker compose up -d
    kubectl create namespace dev
    just redis

local-down:
    docker compose down
    just redis-clear
    kubectl delete namespace dev

# 無法從本機連接到 minikube ip (本機網路不屬於 minikube ip 的私有子網範圍)
redis-port-forward:
    #!/usr/bin/env sh
    echo "等待 Redis Pod 啟動..."
    while ! kubectl get pods -l app=redis-standalone -n dev | grep -q Running; do
        sleep 2
    done
    # 找到 Redis Pod 的名稱
    # 執行 port-forwarding, 將本機的 6379 端口映射到 Pod 的 6379 端口
    # 阻塞終端機執行
    kubectl port-forward $(kubectl get pods -l app=redis-standalone -n dev -o jsonpath='{.items[0].metadata.name}') 6379:6379 -n dev

redis:
    kubectl apply -f k8s/redis-standalone/redis-secret.yaml
    kubectl apply -f k8s/redis-standalone/redis-configmap.yaml
    kubectl apply -f k8s/redis-standalone/redis-pvc.yaml
    kubectl apply -f k8s/redis-standalone/redis-deployment.yaml
    kubectl apply -f k8s/redis-standalone/redis-service.yaml
    just redis-port-forward


redis-clear:
    kubectl delete all -l app=redis-standalone -n dev
    kubectl delete secret -l app=redis-standalone -n dev
    kubectl delete pvc -l app=redis-standalone -n dev
    


start:
    minikube start --driver=docker
    minikube addons enable ingress
    kubectl create namespace dev

    just forwarding
    just simple-server
    minikube tunnel

stop:
    kubectl delete all -l app=simple-server -n dev
    kubectl delete all --all -n ingress-nginx
    minikube stop

forwarding:
    #!/usr/bin/env sh
    # wait for controller ready
    while ! kubectl get pods -n ingress-nginx | grep ingress-nginx-controller | grep -q 1/1; do
        sleep 2
    done
    kubectl apply -f k8s/ingress.yaml


simple-server:
    kubectl apply -f k8s/consistent-hashing/simple-server-deployment.yaml
    kubectl apply -f k8s/consistent-hashing/simple-server-service.yaml

clear:
    kubectl delete all -l app=simple-server -n dev

docker-push:
    docker login
    docker build -t hanbro0112/simple-server:latest k8s/consistent-hashing/simple-server
    docker push hanbro0112/simple-server:latest
    docker image prune