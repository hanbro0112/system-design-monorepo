import React from 'react';
import { Card, Col, Table } from "react-bootstrap"; 
import Link from "next/link";

import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css'; 

import { deleteRateLimiter } from '@/api/RateLimiterService';

import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '@/store/rateLimit';

import { getAvatar } from './utils';

import { rateLimiterListType } from '@/pages/distributed-rate-limiter/type'

export default function LimiterList() {
    const dispatch = useDispatch<any>();
    const { rateLimiterList }: { rateLimiterList: rateLimiterListType } = useSelector((state: any) => state.rateLimit);

    const deleteClickHandler = async (key: string, method: string) => {
        const toastId = toast.loading(`Deleting ${key} : ${method}`);
        const result = await deleteRateLimiter(key, method);
        if (result) {
            toast.success(`Deleted ${key}`, {id: toastId});
            dispatch(fetchData());
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