import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';

import toast from 'react-hot-toast';


const rateLimitSlice = createSlice({
    name: 'consistentHashing',
    initialState: {
        emulatorList: [],
    },
    reducers: {
        
    },
    // 使用 extraReducers 來處理 createAsyncThunk 生成的 action
    extraReducers: (builder) => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.emulatorList = action.payload || [];
        })
    }
})

export const fetchData = createAsyncThunk(
    'consistentHashing/fetchData',
    async () => {
        const list = await getEmulatorList();
        const new_list = Object.keys(list).map(key => ({
            key,
            ...list[key]
        }));
        new_list.sort((a, b) => - (a.createTime - b.createTime));
        return new_list;
    }
);

// export const {  } = rateLimitSlice.actions;

export default rateLimitSlice.reducer;