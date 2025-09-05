import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { rateLimiterListType, testerType, testConfig } from '@/pages/distributed-rate-limiter/type';
import { getRateLimiterList, runRateLimiter } from '@/api/RateLimiterService'
import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';

import toast from 'react-hot-toast';

import { getTasksNumber } from '@/pages/distributed-rate-limiter/utils';

const rateLimitSlice = createSlice({
    name: 'rateLimit',
    initialState: {
        rateLimiterList: [] as rateLimiterListType,
        tester: [] as testerType,
    },
    reducers: {
        setTester(state, action: {payload: {meta: Omit<testConfig, 'data' | 'startTime' |'intervalId'>, dispatch: any}}) {
            const { key, method } = action.payload.meta;
            const tester = {
                ...action.payload.meta,
                data: new Array(121).fill(0).map(_ => {
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
            const { key, method, result, index }: { key: string, method: string, result: boolean[], index: number } = action.payload;
            const existingTester = state.tester.find(item => item.key === key && item.method === method);
            if (existingTester) {
                existingTester.data[index].TotalRequest += result.length;
                for (let success of result) {
                    if (success) {
                        existingTester.data[index].SuccessRequest += 1;
                    } else {
                        existingTester.data[index].FailRequest += 1;
                    }
                }
            }
        },
        deleteTester(state, action) {
            const { key, method } = action.payload;
            const existingTester = state.tester.find(item => item.key === key && item.method === method);
            if (existingTester) {
                clearInterval(existingTester.intervalId);
                toast.error(`Cancel ${key}`, {id: existingTester.toastId});
                state.tester = state.tester.filter(item => !(item.key === key && item.method === method));
            }
        }
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
    const { key, method, burstRate, weights, data, startTime } = tester;
    let index = 0;
    const intervalId = setInterval(async () => {
        index += 1;
        // 每 15 秒暫停 3 秒
        if (index >= 30 && index % 30 < 6) {
            return ;
        }
        if (index >= data.length) {
            clearInterval(intervalId);
            toast.success(`Done ${key}`, {id: tester.toastId});
            return;
        }
        const tasksNumber = getTasksNumber(weights, burstRate);
        if (tasksNumber > 0) {
             Promise.all(new Array(tasksNumber).fill(0).map(async () => runRateLimiter(key, method)))
                .then((result) => {
                    dispatch(updateTester({ key, method, result, index }));
                });
        }
    }, 500);
    tester.intervalId = intervalId;
}

export const { setTester, updateTester, deleteTester } = rateLimitSlice.actions;

export default rateLimitSlice.reducer;