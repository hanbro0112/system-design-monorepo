import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Form } from "react-bootstrap"; 

import { useDispatch, useSelector } from 'react-redux';
import { fetchData, addNode, removeNode } from '@/store/consistentHashing';

import { nodeList, point } from './type';

import { sendRequestToNode } from '@/api/ConsistentHashingService';
import toast from 'react-hot-toast';
const fixedKey = new Array(100).fill(0).map((_, index) => `key-${index}`);

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
    const [testResult, setTestResult] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    const handleAddNode = () => {
        dispatch(addNode(virtualPointsNumber));
    }

    const handleRemoveNode = (nodeId: string) => {
        dispatch(removeNode(nodeId));
    }

    const handleTestingNode = async () => {
        const toastId = toast.loading('Testing nodes...');
        const testResult: { [key: string]: number } = {};
        for (let i = 0; i < fixedKey.length; i += 20) {
            const batch = fixedKey.slice(i, i + 20);
            const responses = await Promise.all(batch.map(key => sendRequestToNode(key)));
            for (let nodeId of responses) {
                if (nodeId === '') throw new Error('Failed to send request');
                testResult[nodeId] = (testResult[nodeId] || 0) + 1;
            }
            setTestResult({...testResult});
        }
        toast.success('Testing completed', { id: toastId });
        
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
                                
                                <Button 
                                    variant="outline-info"
                                    onClick={handleTestingNode}
                                    className="w-100"
                                    style={{ fontWeight: 400, letterSpacing: 2, fontSize: 16, borderWidth: 2, paddingLeft: 18 }}
                                >
                                    <i className="fa fa-bolt" style={{
                                        marginRight: 8,
                                        color: 'inherit',
                                        fontSize: 20,
                                        transition: 'color 0.2s'
                                    }} />
                                    <span style={{ color: 'inherit' }}>測試節點</span>
                                </Button>
                                <style jsx>{`
                                    .btn-outline-info:active .fa-bolt,
                                    .btn-outline-info:focus .fa-bolt,
                                    .btn-outline-info:hover .fa-bolt {
                                        color: #fff !important;
                                    }
                                `}</style>
                            </div>
                            <hr />
                            <div className="mb-3">
                                <label className="form-label">節點資訊</label>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {nodeList.length === 0 ? (
                                        <p className="text-muted">尚無節點</p>
                                    ) : (
                                        nodeList.map(item => (
                                            <div key={item.id} className="border p-2 mb-1 rounded" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <small>
                                                    <strong style={{ color: item.color }}>
                                                        {item.id} | {item.virtualPoints.length}
                                                    </strong>
                                                </small>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {typeof testResult[item.id] === 'number' && (
                                                        <span style={{ marginRight: 16, color: '#17a2b8', fontWeight: 500 }}>
                                                            {testResult[item.id]} / 100
                                                        </span>
                                                    )}
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline-danger"
                                                        onClick={() => handleRemoveNode(item.id)}
                                                    >
                                                        刪除
                                                    </Button>
                                                </div>
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
