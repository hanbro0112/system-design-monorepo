import React, { useState } from 'react';
import { Button, Card, Row, Col, Form } from "react-bootstrap"; 

import { useDispatch, useSelector } from 'react-redux';

import { nodeList } from './type';

// 節點類型定義
interface Node {
  id: string;
  value: number; // 0 to 2^32 - 1
  angle: number; // 角度 (0-360)
  x: number;
  y: number;
}

export default function Emulator() {
  const dispatch = useDispatch<any>();
  const nodeList = useSelector((state: any) => state.consistentHashing.nodeList) as nodeList;
  // 使用 useState 來儲存所有節點
  const [nodes, setNodes] = useState([] as Node[]);

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
    cursor: 'pointer',
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
    cursor: 'pointer',
  };

  // 小圓點的樣式
  const smallCircleStyle: React.CSSProperties = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#FF5722',
  };

  // 圓環的半徑和中心
  const centerX = 200;
  const centerY = 200;
  const ringRadius = 200;

  // 哈希函數：將字符串轉換為 0 到 2^32-1 的數值
  const hashFunction = (input: string): number => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 轉換為32位整數
    }
    return Math.abs(hash) % (Math.pow(2, 32));
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

  const handleCircleClick = (event: any) => {
    // 取得點擊位置相對於大圓的坐標
    const rect = event.target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // 計算點擊位置相對於圓心的角度
    const deltaX = clickX - centerX;
    const deltaY = clickY - centerY;
    let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90; // +90度使0度指向頂部
    if (angle < 0) angle += 360;

    // 將角度轉換為哈希值
    const value = Math.floor((angle / 360) * Math.pow(2, 32));
    
    // 計算在圓環邊緣的精確位置
    const position = angleToPosition(angle);
    
    // 創建新節點
    const newNode: Node = {
      id: `node-${Date.now()}`,
      value: value,
      angle: angle,
      x: position.x,
      y: position.y
    };

    // 將新節點添加到 state 陣列中
    setNodes([...nodes, newNode]);
  };

  return (
    <div style={{ background: '#eee', padding: '40px', minHeight: '100vh' }}>
        <Row>
            <Col sm={12} md={6}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={largeCircleStyle} onClick={handleCircleClick}>
                        <div style={middleCircleStyle} />
                        {nodes.map((node, index) => (
                        <div
                            key={node.id}
                            style={{
                                ...smallCircleStyle,
                                left: `${node.x}px`,
                                top: `${node.y}px`,
                                transform: 'translate(-50%, -50%)',
                            }}
                            title={`節點 ${node.id}: 值=${node.value}, 角度=${node.angle.toFixed(1)}°`}
                        />
                        ))}
                    </div>
                </div>
            </Col>
            <Col sm={12} md={6}>
                <Card style={{ height: '95%', width: '80%' }}>
                <Card.Body style={{ height: '95%' }}>
                    <Card.Title>操作選單</Card.Title>
                    <Form>
                        <div className="mb-3">
                            <Button 
                                variant="primary" 
                                onClick={() => setNodes([])}
                                className="w-100 mb-2"
                            >
                                清除所有節點
                            </Button>
                        </div>
                        <div className="mb-3">
                            <Button 
                                variant="success" 
                                onClick={() => {
                                    // 自動添加一些節點的示例
                                    const newNodes = [];
                                    for (let i = 0; i < 5; i++) {
                                        const angle = i * 72; // 每72度一個點
                                        const value = Math.floor((angle / 360) * Math.pow(2, 32));
                                        const position = angleToPosition(angle);
                                        newNodes.push({
                                            id: `example-node-${i}`,
                                            value: value,
                                            angle: angle,
                                            x: position.x,
                                            y: position.y
                                        });
                                    }
                                    setNodes(newNodes);
                                }}
                                className="w-100 mb-2"
                            >
                                添加示例節點
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
