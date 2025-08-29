local key = KEYS[1]
local list = ARGV[1]

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

local list_length = redis.call('LLEN', list)
local current_time = tonumber(redis.call('TIME')[1])
if list_length < obj.maxRequests then
    redis.call('RPUSH', list, current_time)
    return 1
end

local head_time = tonumber(redis.call('LINDEX', list, 0))
if current_time - head_time >= obj.timeWindows then
    redis.call('LPOP', list)
    redis.call('RPUSH', list, current_time)
    return 1
end

-- 超過限制，拒絕請求
return 0