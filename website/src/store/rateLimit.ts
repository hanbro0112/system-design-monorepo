import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { rateLimiterListType, testerType, testConfig, testData } from '@/pages/distributed-rate-limiter/type';
import { getRateLimiterList } from '@/api/RateLimiterService'
import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';


const rateLimitSlice = createSlice({
    name: 'rateLimit',
    initialState: {
        rateLimiterList: [] as rateLimiterListType,
        tester: [] as testerType,
    },
    reducers: {
        setTester(state, action: {payload: testConfig}) {
            const tester = {
                ...action.payload,
                data: [],
            }
            state.tester.push(tester);
            tester.intervalId = setTesterInterval(tester)
        },
        updateTester(state, action) {
            const { key, data }: { key: string, data: testData } = action.payload;
            const existingData = state.tester.find(item => item.key === key);
            if (existingData) {
                existingData.data.push(data);
            } else {
                
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
    const { key, method, frequency, repeat, data, intervalId } = tester;
    return setInterval(() => {
        const count = 
    }, 1000);
}

export const { setTester } = rateLimitSlice.actions;

export default rateLimitSlice.reducer;