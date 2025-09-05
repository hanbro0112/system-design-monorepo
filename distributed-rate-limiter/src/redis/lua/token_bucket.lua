local key = KEYS[1]

local arr = redis.call('HGETALL', key)
-- 沒有刪除，直接通過
if #arr == 0 then
    return 1
end

-- 將數組轉換為對象
local obj = {}
for i = 1, #arr, 2 do
    obj[arr[i]] = tonumber(arr[i + 1])
end

if obj['tokens'] > 0 then
    -- 如果令牌數量大於0，則允許通過
    redis.call('HSET', key, 'tokens', obj['tokens'] - 1)
    return 1
else
    -- 如果令牌數量為0，則補充令牌
    -- [秒, 微秒]
    local now = tonumber(redis.call('TIME')[1])  
    local refillToken = obj['rate'] * (now - obj['lastRefill'])
    local newTokens = math.min(obj['capacity'], obj['tokens'] + refillToken)
    if newTokens > 0 then
        -- 更新令牌數量和最後補充時間
        redis.call('HSET', key, 'tokens', newTokens - 1, 'lastRefill', now)
        return 1
    end
    return 0
end

