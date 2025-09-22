import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getNodeList, addNewNode } from '../api/ConsistentHashingService';

import { nodeList } from '../pages/consistent-hashing/type';

import toast from 'react-hot-toast';

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

export const addNode = createAsyncThunk(
    'consistentHashing/addNode',
    async (virtualPointsNumber: number) => {
        const toastId = toast.loading('Adding node...');
        try {
            const data = await addNewNode(virtualPointsNumber);
            toast.success(`Node ${data.id} added`, { id: toastId });
            return data;
        } catch (error) {
            toast.error('Failed to add node', { id: toastId });
            throw new Error('Failed to add node');
        }
    }
);

// export const {  } = rateLimitSlice.actions;

export default consistentHashingSlice.reducer;