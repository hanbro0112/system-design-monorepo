local key = KEYS[1]

local arr = redis.call('HGETALL', key)
-- 沒有限流，直接通過
if #arr == 0 then
    return 0
end

-- 將數組轉換為對象
local obj = {}
for i = 1, #arr, 2 do
    obj[arr[i]] = tonumber(arr[i + 1])
end

-- 更新水位和上次滴水時間
local time = redis.call('TIME')

-- 將時間轉換為毫秒
local now = 1000 * tonumber(time[1]) + math.floor(tonumber(time[2]) / 1000)
local perLeakTime = 1000 / obj['leakRate']

-- 計算自上次滴水以來的時間差
local elapsed = now - obj['lastDrip']
-- 計算漏水量
local leak = math.min(obj['water'], math.floor(elapsed / perLeakTime))
-- 更新水位
local new_water = obj['water'] - leak
-- 更新上次滴水時間
local new_lastDrip = obj['lastDrip'] + leak * perLeakTime

if new_water < obj['capacity'] then
    -- 如果水位沒有變化，則不更新 lastDrip
    if leak == 0 then
        redis.call('HSET', key, 'water', new_water + 1)
    -- 只剩當前請求
    elseif new_water == 0 then 
        redis.call('HSET', key, 'water', 1, 'lastDrip', now)
    else
        redis.call('HSET', key, 'water', new_water + 1, 'lastDrip', new_lastDrip)
    end
    return new_water + 1
end
-- 如果水位已滿，則不允許通過
return -1
