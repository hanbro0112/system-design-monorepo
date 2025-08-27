import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { rateLimiterListType, testerType, testConfig } from '@/pages/distributed-rate-limiter/type';
import { getRateLimiterList, runRateLimiter } from '@/api/RateLimiterService'
import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';

import toast from 'react-hot-toast';


const rateLimitSlice = createSlice({
    name: 'rateLimit',
    initialState: {
        rateLimiterList: [] as rateLimiterListType,
        tester: [] as testerType,
    },
    reducers: {
        setTester(state, action: {payload: {meta: Omit<testConfig, 'data' | 'startTime' |'intervalId'>, dispatch: any}}) {
            const { key, method, frequency, repeat } = action.payload.meta;
            const tester = {
                ...action.payload.meta,
                data: new Array(60 * repeat + 1).fill(0).map(_ => {
                    return {
                        TotalRequest: 0,
                        FailRequest: 0,
                        SuccessRequest: 0,
                        // ExecutedRequest: 0,
                        // AverageExecutedTime: 0,
                    };
                }),
                startTime: Date.now(),
            };
             // 如果已經存在相同的測試器，則更新其配置
            const origin = state.tester.find(item => item.key === key && item.method === method);
            if (origin) {
                clearInterval(origin.intervalId);
                toast.error(`Cancel ${key}`, {id: origin.toastId});
                Object.assign(origin, tester);
            } else {
                state.tester.push(tester);
            }
            setTesterInterval(tester, action.payload.dispatch);
        },
        updateTester(state, action) {
            const { key, method, result: { success, index } }: { key: string, method: string, result: { success: boolean, index: number } } = action.payload;
            const existingData = state.tester.find(item => item.key === key && item.method === method);
            if (existingData) {
                existingData.data[index].TotalRequest += 1;
                if (success) {
                    existingData.data[index].SuccessRequest += 1;
                } else {
                    existingData.data[index].FailRequest += 1;
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

// dispatch 需在 react 組件內使用
function setTesterInterval(tester: testConfig, dispatch: any) {
    const { key, method, frequency, data, startTime } = tester;
    const intervalId = setInterval(async () => {
        const now = Math.ceil((Date.now() - startTime) / 1000);
        if (now >= data.length) {
            clearInterval(intervalId);
            toast.success(`Done ${key}`, {id: tester.toastId});
            return;
        }
        const success = await runRateLimiter(key, method);
        dispatch(updateTester({ key, method, result: { success, index: now }}));
    }, 60 * 1000 / frequency);
    tester.intervalId = intervalId;
}

export const { setTester, updateTester } = rateLimitSlice.actions;

export default rateLimitSlice.reducer;