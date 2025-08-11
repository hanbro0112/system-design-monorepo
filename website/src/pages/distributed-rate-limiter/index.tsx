import React from 'react';
import { Button, Card, Row, Col, Table, Form } from "react-bootstrap"; 
import Link from "next/link";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css'; 

import { getRateLimiterList, deleteRateLimiter } from '@/api/RateLimiterService'
import { rateLimiterList, tokenBucketConfig } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';
import { METHODS } from '#/distributed-rate-limiter/src/constants';

import avatar1 from '@/assets/images/avatar-1.jpg';
import avatar2 from '@/assets/images/avatar-2.jpg';
import avatar3 from '@/assets/images/avatar-3.jpg';

export default function Page() {

    return (
        <React.Fragment>
            <RateLimiterList />
            <AddRateLimiter />
        </React.Fragment>
    )
}

function AddRateLimiter() {
    return (
        <React.Fragment>
        <Row>
        <Col sm={10}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Add / Edit </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form>
                    <Form.Group className="mb-3" controlId="Key">
                      <Form.Label>Key </Form.Label>
                      <Form.Control type="text" defaultValue={crypto.randomUUID().replace(/-/g, '')} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="method">
                    <Form.Label>Method</Form.Label>
                    <Form.Control as="select">
                        {Object.values(METHODS).map(method => (
                            <option key={method} value={method}>{method}</option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                  </Form>
                  <Button variant="primary">Submit</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        </Row>
        </React.Fragment>
    )
}

function RateLimiterList() {
    const [rateLimiterList, setRateLimiterList] = useState<Array<{ key: string; method: string; config: Record<string, number>; createTime: number }>>([]);
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

    const deleteClickHandler = async (key: string, method: string) => {
        const toastId = toast.loading(`Deleting ${key} : ${method}`);
        const result = await deleteRateLimiter(key, method);
        if (result) {
            toast.success(`Deleted ${key} : ${method}`, {id: toastId});
            fetchData();
        } else {
            toast.error(`Failed to delete ${key} : ${method}`, {id: toastId});
        }
    };

    return (
        <React.Fragment>
            <Col md={6} xl={10}>
                <Card className="Recent-Users widget-focus-lg">
                    <Card.Header>
                    <Card.Title as="h5">Rate Limiters</Card.Title>
                    </Card.Header>
                    <PerfectScrollbar style={{ maxHeight: 450 }}>
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
                                    <img className="rounded-circle" style={{ width: '40px' }} src={avatar1.src} alt="activity-user" />
                                    </td>
                                    <td>
                                    <h6 className="mb-1">{key}</h6>
                                    <p className="m-0">{method.replace(/_/g, ' ')} : {JSON.stringify(config).replace(/["{},]/g, " ")}</p>
                                    </td>
                                    <td>
                                    <h6 className="text-muted">
                                        <i className="fa fa-circle text-c-green f-10 m-r-15" />
                                        {new Date(Number(createTime)).toLocaleString()}
                                    </h6>
                                    </td>
                                    <td>
                                    <Link href='#' onClick={() => {
                                        // Handle edit action
                                        toast.success(`Editing ${key} ${method}`);
                                    }} className="label theme-bg2 text-white f-12">
                                        Edit
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