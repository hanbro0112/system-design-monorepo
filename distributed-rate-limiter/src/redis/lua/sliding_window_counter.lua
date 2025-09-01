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

-- 轉為自定義時間窗口
local time = tonumber(redis.call('TIME')[1]) - obj.startTime
local current_window = math.floor(time / obj.timeWindows)
local ratio = 1 - (time % obj.timeWindows) / obj.timeWindows

-- 更新時間軸
if obj.lastRequestWindow + 1 == current_window then
    obj.prevCount = obj.currentCount
    obj.currentCount = 0
elseif obj.lastRequestWindow + 1 < current_window then
    obj.prevCount = 0
    obj.currentCount = 0
end

-- 加權請求數 = (上一個視窗的請求數 * 滑動比例) + 當前視窗的請求數
-- 滑動比例：1 - (當前時間戳佔當前視窗的比例)
local weighted = (obj.prevCount * ratio) + obj.currentCount
if weighted < obj.maxRequests then
    redis.call('HSET', key, 'lastRequestWindow', current_window, 'prevCount', obj.prevCount, 'currentCount', obj.currentCount + 1)
    return 1
end
return 0