import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { rateLimiterListType, testerType } from '@/pages/distributed-rate-limiter/type';
import { getRateLimiterList } from '@/api/RateLimiterService'
import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';


const rateLimitSlice = createSlice({
    name: 'rateLimit',
    initialState: {
        rateLimiterList: [] as rateLimiterListType,
        tester: [] as testerType,
            
    },
    reducers: {

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

export const setTester = createAsyncThunk(
    'rateLimit/setTester',
    async (tester: testerType) => {
        
        return tester;
    }   
)

export default rateLimitSlice.reducer;