import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { rateLimiterListType, testerType, testConfig, testData } from '@/pages/distributed-rate-limiter/type';
import { getRateLimiterList, runRateLimiter } from '@/api/RateLimiterService'
import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';

import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';


const rateLimitSlice = createSlice({
    name: 'rateLimit',
    initialState: {
        rateLimiterList: [] as rateLimiterListType,
        tester: [] as testerType,
    },
    reducers: {
        setTester(state, action: {payload: Omit<testConfig, 'data' | 'intervalId'>}) {
            const tester = {
                ...action.payload,
                data: [{
                    TotalRequest: 0,
                    FailRequest: 0,
                    SuccessRequest: 0,
                    // ExecutedRequest: 0,
                    // AverageExecutedTime: 0,
                    timestamp: Date.now()
                }],
            }
            state.tester.push(tester);
            // tester.intervalId = setTesterInterval(tester);
        },
        updateTester(state, action) {
            const { key, method, data }: { key: string, method: string, data: testData } = action.payload;
            const existingData = state.tester.find(item => item.key === key && item.method === method);
            if (existingData) {
                existingData.data.push(data);
                if (existingData.data.length >= existingData.frequency * existingData.repeat) {
                    clearInterval(existingData.intervalId);
                    toast.dismiss(existingData.toastId);
                }
            }
        },
    },
    // 使用 extraReducers 來處理 createAsyncThunk 生成的 action
    extraReducers: (builder) => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.rateLimiterList = action.payload || [];
        })
    }
})

export const fetchData = createAsyncThunk(
    'rateLimit/fetchData',
    async () => {
        const list: rateLimiterList = await getRateLimiterList();
        const new_list = Object.keys(list).map(key => ({
            key,
            ...list[key]
        }));
        new_list.sort((a, b) => - (a.createTime - b.createTime));
        return new_list;
    }
);

function setTesterInterval(tester: testConfig) {
    const dispatch = useDispatch<any>();
    const { key, method, frequency, data } = tester;

    return setInterval(async () => {
        const newData = { ...data[data.length - 1] };
        const success = await runRateLimiter(key, method);
        newData.TotalRequest += 1;
        newData.timestamp = Date.now();
        if (success) {
            newData.SuccessRequest += 1
        } else {
            newData.FailRequest += 1
        }
        dispatch(updateTester({ key, method, data: newData }));
    }, 60 * 1000 / frequency);
}

export const { setTester, updateTester } = rateLimitSlice.actions;

export default rateLimitSlice.reducer;