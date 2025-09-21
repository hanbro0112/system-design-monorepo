import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getNodeList } from '../api/ConsistentHashingService';

import toast from 'react-hot-toast';

import { nodeList } from '../pages/consistent-hashing/type';

const consistentHashingSlice = createSlice({
    name: 'consistentHashing',
    initialState: {
        nodeList: [] as nodeList,
    },
    reducers: {
        
    },
    // 使用 extraReducers 來處理 createAsyncThunk 生成的 action
    extraReducers: (builder) => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.nodeList = action.payload || [];
        })
    }
})

export const fetchData = createAsyncThunk(
    'consistentHashing/fetchData',
    async () => {
        const list = await getNodeList();
        list.sort((a, b) => - (a.node < b.node));
        return list;
    }
);

// export const {  } = rateLimitSlice.actions;

export default consistentHashingSlice.reducer;