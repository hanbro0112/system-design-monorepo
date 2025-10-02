import express from 'express';
import cors from 'cors';
import { getServerInfo, addServer, removeServer, sendRequestToServer } from './scripts';
import { ConsistentHashing } from './algo/consistentHash';

let consistentHashing = new ConsistentHashing();
let serverData: Array<{ id: string; virtualPoints: number[] }> = [];

// 新增一個每五秒執行的 job
setInterval(async () => {
    serverData = await updateServerData();
}, 5000);

const updateServerData = async () => {
    const serversInfo = await getServerInfo(); // 取得目前所有節點
    const newConsistentHashing = new ConsistentHashing();
    for (let server of serversInfo) {
        newConsistentHashing.addPoint(server.name, server.virtualPointsNumber);
    }
    // 回傳目前節點資料
    const data = [];
    for (let point of newConsistentHashing.pointList) {
        data.push({ id: point.getIp(), virtualPoints: point.getVirtualPoints() });
    }
    consistentHashing = newConsistentHashing;
    return data;
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/consistent-hashing/request/:key', async (req, res) => {
    const { key } = req.params;
    const point = consistentHashing.findMatchPoint(key);
    if (!point) return res.status(500).json({ message: 'No available node' });
    const success = await sendRequestToServer(point.getIp());
    if (success) {
        res.status(200).json({ message: 'ok', id: point.getIp() });
    } else {
        res.status(500).json({ message: `Request to node ${point.getIp()} failed` });
    }
});

// 取得所有節點
app.get('/consistent-hashing', async (req, res) => {
    res.status(200).json({ nodes: serverData });
});

// 新增節點
app.post(`/consistent-hashing`, async (req, res) => {
    const { virtualPointsNumber } = req.body;
    const id = await addServer(virtualPointsNumber);
    if (id) {
        const virtualPoints = consistentHashing.addPoint(id, virtualPointsNumber).slice();
        consistentHashing.removePoint(id); // 先移除本地節點，等下次 updateServerData 時會重新加入

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
app.delete('/consistent-hashing/:id', async (req, res) => {
    const { id } = req.params;
    const success = await removeServer(id);
    if (success) {
        // 更新本地狀態
        serverData = await updateServerData();
        res.status(200).json({ message: `Node ${id} removed successfully` });
    } else {
        res.status(500).json({ message: `Failed to remove node ${id}`});
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