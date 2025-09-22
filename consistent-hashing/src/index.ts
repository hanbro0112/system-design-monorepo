import express from 'express';
import cors from 'cors';
import { getServer, addServer, removeServer, sendRequestToServer } from './scripts';
import { ConsistentHashing } from './algo/consistentHash';

const consistentHashing = new ConsistentHashing();

const app = express();
app.use(cors());
app.use(express.json());

const getAndUpdateServer = async () => {
    const servers = await getServer(); // 取得目前所有節點
    // 檢查刪除
    for (let point of consistentHashing.pointList.slice()) {
        if (!servers.includes(point.getIp())) {
            consistentHashing.removePoint(point.getIp());
        }
    }
    // 檢查新增
    for (let uuid of servers) {
        if (!consistentHashing.pointIndex[uuid]) {
            consistentHashing.addPoint(uuid, 100);
        }
    }

    const data = [];
    for (let point of consistentHashing.pointList) {
        data.push({ node: point.getIp(), virtualPoints: point.getVirtualPoints() });
    }
    return data;
}

app.get('/consistent-hashing/request/:key', async (req, res) => {
    const { key } = req.params;
    const point = consistentHashing.findMatchPoint(key);
    if (!point) return res.status(500).json({ message: 'No available node' });
    const success = await sendRequestToServer(point.getIp());
    if (success) {
        res.status(200).json({ message: 'ok', node: point.getIp() });
    } else {
        // 檢查本地狀態
        getAndUpdateServer();
        res.status(500).json({ message: `Request to node ${point.getIp()} failed` });
    }
});

// 取得所有節點
app.get('/consistent-hashing', async (req, res) => {
    const data = getAndUpdateServer();
    res.status(200).json({ nodes: data });
});

// 新增節點
app.post(`/consistent-hashing`, async (req, res) => {
    const { virtualPointsNumber } = req.body;
    const id = await addServer();
    if (id) {
        const virtualPoints = consistentHashing.addPoint(id, virtualPointsNumber);
        res.status(200).json({ 
            message: 'Node added successfully', 
            data: {
                id, 
                virtualPoints 
            }
        });
    } else {
        res.status(500).json({ message: 'Failed to add node' });
    }
});

// 刪除節點
app.delete('/consistent-hashing/:node', async (req, res) => {
    const { node } = req.params;
    const success = await removeServer(node);
    if (success) {
        // 更新本地狀態
        await getAndUpdateServer();
        res.status(200).json({ message: `Node ${node} removed successfully` });
    } else {
        res.status(500).json({ message: `Failed to remove node ${node}`});
    }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Consistent-Hashing Server is running on http://localhost:${PORT}`);
});

// error handler
import { Request, Response, NextFunction } from 'express';

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
    console.log(err.message);
    // render the error page
    res.status(err.status || 500);
    res.send('error');
});