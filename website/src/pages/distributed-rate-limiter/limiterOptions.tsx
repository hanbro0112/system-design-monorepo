import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Form } from "react-bootstrap"; 

import toast from 'react-hot-toast';

import { setRateLimiter } from '@/api/RateLimiterService';
import { METHODS } from '#/distributed-rate-limiter/src/constants';

import { useSelector, useDispatch } from 'react-redux';
import { fetchData, setTester } from '@/store/rateLimit';

import { rateLimiterListType } from '@/pages/distributed-rate-limiter/type'

function Options({ method } : {method: string}) {
    if (method === METHODS.TOKEN_BUCKET) {
        return (
            <Col md={7}>
                <Form.Group className="mb-3" controlId="rate">
                    <Form.Label>rate (每秒補充令牌速率)</Form.Label>
                    <Form.Control key={method} type="number" name="rate" defaultValue={15}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="capacity">
                    <Form.Label>capacity (桶容量)</Form.Label>
                    <Form.Control key={method} type="number" name="capacity" defaultValue={30}/>
                </Form.Group>
            </Col>
        )
    } else if (method === METHODS.LEAKY_BUCKET) {
        return (
            <Col md={7}>
                <Form.Group className="mb-3" controlId="leakRate">
                    <Form.Label>leakRate (每秒漏水速率)</Form.Label>
                    <Form.Control key={method} type="number" name="leakRate" defaultValue={15}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="capacity">
                    <Form.Label>capacity (桶容量)</Form.Label>
                    <Form.Control key={method} type="number" name="capacity" defaultValue={30}/>
                </Form.Group>
            </Col>
        )
    } else if (method === METHODS.FIXED_WINDOW_COUNTER) {
        return (
            <Col md={7}>
                <Form.Group className="mb-3" controlId="timeWindows">
                    <Form.Label>時間窗口大小 (秒)</Form.Label>
                    <Form.Control key={method} type="number" name="timeWindows" defaultValue={3}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="maxRequests">
                    <Form.Label>最大請求數</Form.Label>
                    <Form.Control key={method} type="number" name="maxRequests" defaultValue={45}/>
                </Form.Group>
            </Col>
        )
    } else if (method === METHODS.SLIDING_WINDOW_LOG) {
        return (
            <Col md={7}>
                <Form.Group className="mb-3" controlId="timeWindows">
                    <Form.Label>時間窗口大小 (秒)</Form.Label>
                    <Form.Control key={method} type="number" name="timeWindows" defaultValue={3}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="maxRequests">
                    <Form.Label>最大請求數</Form.Label>
                    <Form.Control key={method} type="number" name="maxRequests" defaultValue={45}/>
                </Form.Group>
            </Col>
        )
    } else if (method === METHODS.SLIDING_WINDOW_COUNTER) {
        return (
            <Col md={7}>
                <Form.Group className="mb-3" controlId="timeWindows">
                    <Form.Label>時間窗口大小 (秒)</Form.Label>
                    <Form.Control key={method} type="number" name="timeWindows" defaultValue={3}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="maxRequests">
                    <Form.Label>最大請求數</Form.Label>
                    <Form.Control key={method} type="number" name="maxRequests" defaultValue={45}/>
                </Form.Group>
            </Col>
        )
    }
    return <></>;
}

export default function LimiterOptions() {
    const [key, setKey] = useState<string>('');
    const [method, setMethod] = useState<string>('');
    const [testKey, setTestKey] = useState<string>('');

    const dispatch = useDispatch<any>();
    const rateLimiterList: rateLimiterListType = useSelector((state: any) => state.rateLimit.rateLimiterList);

    const methodHandler = (e: React.ChangeEvent<any>) => {
        setMethod(e.target.value);
    };

    const genKey = () => setKey(crypto.randomUUID().replace(/-/g, '').slice(0, 6));


    useEffect(() => {
        // 瀏覽器只執行一次
        genKey();
    }, []);

    useEffect(() => {
        // update for delete rate limiter
        if (testKey && !rateLimiterList.find(item => item.key === testKey)) {
            setTestKey('');
        }
    }, [rateLimiterList]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const config: Record<string, number> = {};
        formData.forEach((value, key) => {
            if (key === 'key' || key === 'method') return ;
            config[key] = Number(value);
        });
        // 提交表單
        const toastId = toast.loading(`Setting ${key} : ${method}`);
        const result = await setRateLimiter(key, method, config);
        if (result) {
            toast.success(`Set ${key}`, { id: toastId });
            genKey();
            dispatch(fetchData());
        } else {
            toast.error(`Failed To Set ${key}`, { id: toastId });
        }
    };

    const handleTest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const method = rateLimiterList.find(item => item.key === testKey)?.method;
        if (!method) {
            return ;
        }
        const frequencyRange = Number(formData.get('frequencyRange'));
        const averageFreq = Number(formData.get('averageFreq'));
        const burstRate = Number(formData.get('burstRate'));
        
        const weights = new Array(frequencyRange + 1).fill(10);
        let total = 0;
        for (let i = 0; i < averageFreq; i++) {
            weights[i] = 1 + i;
            total += weights[i];
        }
        for (let i = frequencyRange; i > averageFreq; i--) {
            weights[i] = 1 + (frequencyRange - i);
            total += weights[i];
        }
        weights[averageFreq] = total;
        for (let i = 1; i <= frequencyRange; i++) {
            weights[i] += weights[i - 1];
        }

        // 本地運行測試
        const toastId = toast.loading(`Testing ${testKey}`);
        dispatch(setTester({
            meta: {
                key: testKey,
                method,
                frequencyRange,
                averageFreq,
                burstRate,
                weights,
                toastId
            }, 
            dispatch
        }));
    }

    return (
        <React.Fragment>
        <Row>
            {/* Add Rate Limiter Section */}
            <Col sm={12} md={6}>
                <Card style={{ height: '95%' }}>
                    <Card.Header>
                        <Card.Title as="h5">Limiter </Card.Title>
                    </Card.Header>
                    <Card.Body style={{ height: '95%' }}>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={5}>
                                    <Form.Group className="mb-3" controlId="key">
                                        <Form.Label>Key </Form.Label>
                                        <Form.Control type="text" name="key" defaultValue={key} onChange={(e) => setKey(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="method">
                                        <Form.Label>Method</Form.Label>
                                        <Form.Control as="select" name="method" value={method} onChange={(e) => methodHandler(e)}>
                                            <option value="" disabled>Click To Select </option>
                                            {Object.values(METHODS).map(method => (
                                                <option key={method} value={method}>{method}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant="primary" type="submit">Submit</Button>
                                </Col>
                                <Options method={method} />
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            {/* Add Test Section */}
            <Col sm={12} md={6}>
                <Card style={{ height: '95%' }}>
                    <Card.Header>
                        <Card.Title as="h5">Tester</Card.Title>
                    </Card.Header>
                    <Card.Body style={{ height: '95%' }}>
                        <Form onSubmit={handleTest}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="Key">
                                        <Form.Label>Target Key</Form.Label>
                                        <Form.Control as="select" name="key" value={testKey} onChange={(e) => setTestKey(e.target.value)}>
                                            <option value="" disabled>Click To Select </option>
                                            {rateLimiterList.map(item => (
                                                <option key={item.key} value={item.key}>{item.key} </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="Config">
                                        {testKey && (() => {
                                            const item = rateLimiterList.find(item => item.key === testKey);
                                            return !item? <></>: (
                                                <>
                                                    <Form.Label></Form.Label>
                                                    <Form.Text className="mb-3 text-muted">
                                                        {rateLimiterList.find(item => item.key === testKey)!.method}
                                                    </Form.Text>
                                                    <br />
                                                    <Form.Text className="mb-3 text-muted">
                                                        {JSON.stringify(rateLimiterList.find(item => item.key === testKey)!.config)}
                                                    </Form.Text>
                                                </>
                                            );
                                        })()}
                                    </Form.Group>
                                    <Button variant="primary" type="submit">Submit</Button>
                                </Col>
                                <Col md={6}>
                                    {testKey && rateLimiterList.find(item => item.key === testKey) && (
                                        <>
                                        <Form.Group className="mb-3" controlId="frequencyRange">
                                            <Form.Label>Frequency Range (req/half second)</Form.Label>
                                            <Form.Control type="number" name="frequencyRange" defaultValue={20} min={0}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="averageFreq">
                                            <Form.Label>Average Frequency</Form.Label>
                                            <Form.Control type="number" name="averageFreq" defaultValue={15} min={0}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="burstRate">
                                            <Form.Label>Burst Rate % (trigger 2 * max)</Form.Label>
                                            <Form.Control type="number" name="burstRate" defaultValue={5} min={0} max={100}/>
                                        </Form.Group>
                                        </>
                                    )}
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        </React.Fragment>
    )
}