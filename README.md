# System design practice

https://github.com/casey/just

frontend framework: https://codedthemes.com/item/datta-able-react-free-admin-template

# distributed-rate-limiter
- 實作:
 1. 限流服務
 2. api 層掛載模組

- 集中式資料儲存: redis 集群, k8s

- 限流目標：user, api

- 演算法
 1. 固定窗口計數器 (Fixed Window Counter)
 2. 滑動窗口日誌 (Sliding Window Log)
 3. 令牌桶 (Token Bucket)
 4. 漏桶 (Leaky Bucket)
 5. 滑動窗口計數器 (Sliding Window Counter)

- 可觀察性: 延遲, 請求率 

- 操作:
 1. 新增/設定 api  
 2. 新增/設定 使用者請求（暫定網頁端 request）
 3. 重置/清除 

- 動態更改限流設定: 節點定期更新, 發佈訂閱更新 (redis pubsub)

# consistent-hashing
- 實作:
  1. 服務擴容, 縮容 (k8s)

- 演算法:
  1. 哈希環
  2. 虛擬節點
  
- 操作:
  1. 增加 / 刪除節點
  2. 使用者請求