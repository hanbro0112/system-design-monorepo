import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Form } from "react-bootstrap"; 

import { useDispatch, useSelector } from 'react-redux';
import { fetchData, addNode } from '@/store/consistentHashing';

import { nodeList } from './type';

// 節點類型定義
interface Node {
    id: string;
    color: string;
    points: {
        value: number; // 0 to 2^32 - 1
        angle: number; // 角度 (0-360)
        x: number;
        y: number;
    }[];
}

// 大圓的樣式
const largeCircleStyle: React.CSSProperties = {
    position: 'relative',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    backgroundColor: '#f9f9f9ff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

// 中間覆蓋圓
const middleCircleStyle: React.CSSProperties = {
    position: 'relative',
    width: '390px',
    height: '390px',
    borderRadius: '50%',
    backgroundColor: '#eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

// 小圓點的樣式
const smallCircleStyle: React.CSSProperties = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#FF5722',
    cursor: 'pointer',
};

// 圓環的半徑和中心
const centerX = 200;
const centerY = 200;
const ringRadius = 200;

export default function Emulator() {
    const dispatch = useDispatch<any>();
    const nodeList = useSelector((state: any) => state.consistentHashing.nodeList) as nodeList;
    const [nodes, setNodes] = useState([] as Node[]);
    const [virtualPointsNumber, setVirtualPointsNumber] = useState<number>(100);

    const refreshData = () => {
        dispatch(fetchData());

        const new_nodes = [] as Node[];
        nodeList.forEach(item => {
            const { node, virtualPoints } = item;
            const data = {
                id: node,
                color: idToColor(node),
                points: virtualPoints.map(vp => {
                    // vp 為 hash value，轉成角度與圓上的座標
                    const angle = valueToAngle(vp);
                    const pos = angleToPosition(angle);
                    return {
                        value: vp,
                        angle,
                        x: pos.x,
                        y: pos.y
                    };
                })
            } as Node;
            new_nodes.push(data);
        })
    }
    useEffect(() => {
        refreshData();
    }, [dispatch]);

    const handleAddNode = () => {
        dispatch(addNode(virtualPointsNumber));
        refreshData();
    }

    return (
        <div style={{ background: '#eee', padding: '40px', minHeight: '100vh' }}>
            <Row>
                <Col sm={12} md={6}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={largeCircleStyle}>
                            <div style={middleCircleStyle} />
                            {nodes.map(node =>
                                node.points.map((point: Node['points'][number]) => (
                                    <div
                                        key={point.value}
                                        style={{
                                            ...smallCircleStyle,
                                            left: `${point.x}px`,
                                            top: `${point.y}px`,
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </Col>
                <Col sm={12} md={6}>
                    <Card style={{ height: '95%', width: '80%' }}>
                    <Card.Body style={{ height: '95%' }}>
                        <Card.Title>操作選單</Card.Title>
                        <hr />
                        <Form>
                            <div className="mb-3">
                                <Form.Group className="mb-3" controlId="virtualPointsNumber">
                                    <Form.Label>虛擬節點數量</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        max={10000}
                                        value={virtualPointsNumber}
                                        onChange={e => setVirtualPointsNumber(Number(e.target.value))}
                                    />
                                </Form.Group>
                                <Button 
                                    variant="success" 
                                    onClick={handleAddNode}
                                    className="w-100 mb-2"
                                >
                                    添加節點
                                </Button>
                            </div>
                            <hr />
                            <div className="mb-3">
                                <label className="form-label">節點資訊</label>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {nodes.length === 0 ? (
                                        <p className="text-muted">尚無節點</p>
                                    ) : (
                                        nodes.map((node, index) => (
                                            <div key={node.id} className="border p-2 mb-1 rounded">
                                                <small>
                                                    <strong>節點 {index + 1}:</strong><br/>
                                                    ID: {node.id}<br/>
                                                    值: {node.value.toLocaleString()}<br/>
                                                    角度: {node.angle.toFixed(1)}°<br/>
                                                    位置: ({Math.round(node.x)}, {Math.round(node.y)})
                                                </small>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline-danger" 
                                                    className="float-end"
                                                    onClick={() => {
                                                        const newNodes = nodes.filter((_, i) => i !== index);
                                                        setNodes(newNodes);
                                                    }}
                                                >
                                                    刪除
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </Form>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};


// 將哈希值轉換為角度 (0-360度)
const valueToAngle = (value: number): number => {
    return (value / Math.pow(2, 32)) * 360;
};

// 將角度轉換為圓環上的坐標
const angleToPosition = (angle: number) => {
    const radian = (angle - 90) * Math.PI / 180; // -90度使0度指向頂部
    return {
        x: centerX + ringRadius * Math.cos(radian),
        y: centerY + ringRadius * Math.sin(radian)
    };
};

// 根據 id 產生固定顏色（hash to color）
function idToColor(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // 產生 0~359 的色相
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 55%)`;
}