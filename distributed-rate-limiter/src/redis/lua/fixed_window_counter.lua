local key = KEYS[1]

local arr = redis.call('HGETALL', key)
-- 沒有限流，直接通過
if #arr == 0 then
    return 1
end

-- 將數組轉換為對象
local obj = {}
for i = 1, #arr, 2 do
    obj[arr[i]] = tonumber(arr[i + 1])
end

local current_time = tonumber(redis.call('TIME')[1])
if obj.startTime + obj.timeWindows <= current_time then
    -- 重置計數器和窗口起始時間
    redis.call('HSET', key, 'count', 1, 'startTime', current_time)
    return 1
end

if obj.count < obj.maxRequests then    
    redis.call('HSET', key, 'count', obj.count + 1)
    return 1
end

-- 超過限制，拒絕請求
return 0
    