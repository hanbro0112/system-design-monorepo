import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Form } from "react-bootstrap"; 

import { useDispatch, useSelector } from 'react-redux';
import { fetchData, addNode, removeNode } from '@/store/consistentHashing';

import { nodeList, point } from './type';

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
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: '#FF5722',
    cursor: 'pointer',
};

export default function Emulator() {
    const dispatch = useDispatch<any>();
    const nodeList = useSelector((state: any) => state.consistentHashing.nodeList) as nodeList;
    const [virtualPointsNumber, setVirtualPointsNumber] = useState<number>(20);

    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    const handleAddNode = () => {
        dispatch(addNode(virtualPointsNumber));
    }

    const handleRemoveNode = (nodeId: string) => {
        dispatch(removeNode(nodeId));
    }

    return (
        <div style={{ background: '#eee', padding: '40px', minHeight: '100vh' }}>
            <Row>
                <Col sm={12} md={6}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={largeCircleStyle}>
                            <div style={middleCircleStyle} />
                            {nodeList.map(item =>
                                item.circlePoints.map((point: point) => (
                                    <div
                                        key={point.value}
                                        style={{
                                            ...smallCircleStyle,
                                            backgroundColor: item.color,
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
                                        max={1000}
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
                                    {nodeList.length === 0 ? (
                                        <p className="text-muted">尚無節點</p>
                                    ) : (
                                        nodeList.map(item => (
                                            <div key={item.node} className="border p-2 mb-1 rounded" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <small>
                                                    <strong style={{ color: item.color }}>
                                                        {item.node} | {item.virtualPoints.length }
                                                    </strong>
                                                </small>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline-danger"
                                                    onClick={() => handleRemoveNode(item.node)}
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
