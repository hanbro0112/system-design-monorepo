import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getNodeList, addNode as addNewNode, removeNode as removeOldNode} from '../api/ConsistentHashingService';
import * as Utils from '../pages/consistent-hashing/utils';

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
            state.nodeList = action.payload.map(item => ({ 
                node: item.node,
                color: Utils.idToColor(item.node),
                virtualPoints: item.virtualPoints,
                circlePoints: item.virtualPoints.map(value => ({
                    value,
                    angle: Utils.valueToAngle(value),
                    ...Utils.angleToPosition(Utils.valueToAngle(value))
                }))
            }));
        }),
        builder.addCase(addNode.fulfilled, (state, action) => {
            state.nodeList.push({
                node: action.payload.id,
                color: Utils.idToColor(action.payload.id),
                virtualPoints: action.payload.virtualPoints,
                circlePoints: action.payload.virtualPoints.map(value => ({
                    value,
                    angle: Utils.valueToAngle(value),
                    ...Utils.angleToPosition(Utils.valueToAngle(value))
                }))
            });
            state.nodeList.sort((a, b) => - (a.node < b.node));
            
        }),
        builder.addCase(removeNode.fulfilled, (state, action) => {
            const removeId = action.payload as string;
            state.nodeList = state.nodeList.filter(item => item.node !== removeId);
        });
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

export const removeNode = createAsyncThunk(
    'consistentHashing/removeNode',
    async (nodeId: string) => {
        const toastId = toast.loading(`Removing node ${nodeId}...`);
        try {
            const success = await removeOldNode(nodeId);
            if (success) {
                toast.success(`Node ${nodeId} removed`, { id: toastId });
            } else {
                toast.error(`Failed to remove node ${nodeId}`, { id: toastId });
            }
            return nodeId;
        } catch (error) {
            toast.error(`Failed to remove node ${nodeId}`, { id: toastId });
            throw new Error('Failed to remove node');
        }
    }
);

// export const {  } = rateLimitSlice.actions;

export default consistentHashingSlice.reducer;