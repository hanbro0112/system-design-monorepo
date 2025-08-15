import React from 'react';
import { Button, Card, Row, Col, Table, Form } from "react-bootstrap"; 
import Link from "next/link";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css'; 

import { getRateLimiterList, setRateLimiter, deleteRateLimiter } from '@/api/RateLimiterService'
import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';
import { METHODS } from '#/distributed-rate-limiter/src/constants';

import { fetchData } from '@/store/rateLimit';

import avatar1 from '@/assets/images/avatar-1.jpg';
import avatar2 from '@/assets/images/avatar-2.jpg';
import avatar3 from '@/assets/images/avatar-3.jpg';
import avatar4 from '@/assets/images/avatar-4.jpg';
import avatar5 from '@/assets/images/avatar-5.jpg';

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];
const getAvatar = (key: string) => {
    const index = parseInt(key, 16) % avatars.length;
    return avatars[index];
}

type rateLimiterListType = Array<{ key: string; method: string; config: Record<string, number>; createTime: number }>;

export default function Page() {
    const [rateLimiterList, setRateLimiterList] = useState<rateLimiterListType>([]);
    const fetchData = async () => {
            const list: rateLimiterList = await getRateLimiterList();
            const new_list = Object.keys(list).map(key => ({
                key,
                ...list[key]
            }));
            new_list.sort((a, b) => - (a.createTime - b.createTime));
            setRateLimiterList(new_list);
        };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <React.Fragment>
            <RateLimiterList rateLimiterList={rateLimiterList} fetchData={fetchData}  />
            <AddRateLimiter rateLimiterList={rateLimiterList} fetchData={fetchData} />
            <Tester />
        </React.Fragment>
    )
}

function Tester() {
    return (
        <></>
    )
}

function AddRateLimiter({ 
    rateLimiterList, 
    fetchData 
} : { 
    rateLimiterList: rateLimiterListType,
    fetchData: () => Promise<void> 
}) {
    const [key, setKey] = useState<string>('');
    const [method, setMethod] = useState<string>('');
    const [testKey, setTestKey] = useState<string>('');

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
        if (method === METHODS.TOKEN_BUCKET) {
            config['rate'] = Number(formData.get('rate') ?? 1);
            config['capacity'] = Number(formData.get('capacity') ?? 10);
        } else if (method === METHODS.LEAKY_BUCKET) {
            config['leakRate'] = Number(formData.get('leakRate') ?? 1);
            config['capacity'] = Number(formData.get('capacity') ?? 10);
        } else {
            return ;
        }
        // 提交表單
        const toastId = toast.loading(`Setting ${key} : ${method}`);
        const result = await setRateLimiter(key, method, config);
        if (result) {
            toast.success(`Set ${key}`, { id: toastId });
            genKey();
            fetchData();
        } else {
            toast.error(`Failed To Set ${key}`, { id: toastId });
        }
    };

    const handleTest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const frequency = formData.get('frequency') ?? 10;
        const repeat = formData.get('repeat') ?? 1;
        // 本地運行測試
        const toastId = toast.loading(`Testing ${testKey}`);
        
    }

    function Options() {
        if (method === METHODS.TOKEN_BUCKET) {
            return (
                <Col md={7}>
                    <Form.Group className="mb-3" controlId="rate">
                        <Form.Label>rate (每秒補充令牌速率)</Form.Label>
                        <Form.Control type="number" name="rate" defaultValue={1}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="capacity">
                        <Form.Label>capacity (桶容量)</Form.Label>
                        <Form.Control type="number" name="capacity" defaultValue={10}/>
                    </Form.Group>
                </Col>
            )
        } else if (method === METHODS.LEAKY_BUCKET) {
            return (
                <Col md={7}>
                    <Form.Group className="mb-3" controlId="leakRate">
                        <Form.Label>leakRate (每秒漏水速率)</Form.Label>
                        <Form.Control type="text" name="leakRate" defaultValue={1}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="capacity">
                        <Form.Label>capacity (桶容量)</Form.Label>
                        <Form.Control type="text" name="capacity" defaultValue={10}/>
                    </Form.Group>
                </Col>
            )
        }
        return <></>
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
                                    <Form.Group className="mb-3" controlId="Key">
                                        <Form.Label>Key </Form.Label>
                                        <Form.Control type="text" name="Key" defaultValue={key} onChange={(e) => setKey(e.target.value)} />
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
                                <Options />
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
                                        <Form.Group className="mb-3" controlId="freq">
                                            <Form.Label>Frequency (req/min)</Form.Label>
                                            <Form.Control type="number" name="frequency" defaultValue={10} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="repeat">
                                            <Form.Label>Repeat Times</Form.Label>
                                            <Form.Control type="number" name="repeat" defaultValue={1} />
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

function RateLimiterList({ 
    rateLimiterList, 
    fetchData 
}: { 
    rateLimiterList: Array<{ key: string; method: string; config: Record<string, number>; createTime: number }>,
    fetchData: () => Promise<void> 
}) {
    const deleteClickHandler = async (key: string, method: string) => {
        const toastId = toast.loading(`Deleting ${key} : ${method}`);
        const result = await deleteRateLimiter(key, method);
        if (result) {
            toast.success(`Deleted ${key}`, {id: toastId});
            fetchData();
        } else {
            toast.error(`Failed To Delete ${key}`, {id: toastId});
        }
    };

    return (
        <React.Fragment>
            <Col md={6} xl={10}>
                <Card className="Recent-Users widget-focus-lg" style={{ height: 300 }}>
                    <Card.Header>
                    <Card.Title as="h5">Rate Limiters</Card.Title>
                    </Card.Header>
                    <PerfectScrollbar style={{ maxHeight: 300 }}>
                    <Card.Body className="px-0 py-2">
                    <Table responsive hover className="recent-users">
                        <tbody>
                        <AnimatePresence>
                        { rateLimiterList.map(e => {
                            const { key, method, config, createTime } = e;
                            return (
                                <motion.tr
                                    key={`${key}-${method}`}
                                    layout
                                    className="unread"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                                >
                                    <td>
                                    <img className="rounded-circle" style={{ width: '40px' }} src={getAvatar(key).src} alt="activity-user" />
                                    </td>
                                    <td>
                                    <h6 className="mb-1">{method}: {key}</h6>
                                    <p className="m-0">{JSON.stringify(config).replace(/["{},]/g, " ")}</p>
                                    </td>
                                    <td>
                                    <h6 className="text-muted">
                                        <i className="fa fa-circle text-c-green f-10 m-r-15" />
                                        {new Date(Number(createTime)).toLocaleString()}
                                    </h6>
                                    </td>
                                    <td>
                                    <Link href='#' onClick={() => {
                                        toast.success(`Testing ${key} ${method}`);
                                    }} className="label theme-bg2 text-white f-12">
                                        Test
                                    </Link>
                                    <Link href='#' onClick={() => deleteClickHandler(key, method)} 
                                        className="label theme-bg text-white f-12">
                                        Delete
                                    </Link>
                                    </td>
                                </motion.tr>
                            );
                        })}
                        </AnimatePresence>
                        </tbody>
                    </Table>
                    </Card.Body>
                    </PerfectScrollbar>
                </Card>
            </Col>
        </React.Fragment>
    )
}