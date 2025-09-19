# 階段 1: 下載 kubectl
FROM alpine:3.18 as builder
RUN apk add --no-cache curl && \
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    chmod +x kubectl && \
    mv kubectl /usr/local/bin/kubectl

# 階段 2: 應用程式映像檔
FROM node:20-alpine

# 安裝 curl 到正式映像檔
RUN apk add --no-cache curl

# 從 builder 階段中複製 kubectl 執行檔
COPY --from=builder /usr/local/bin/kubectl /usr/local/bin/kubectl

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 80

CMD ["npm", "start"]