import React from 'react';
import { Card, Col, Table } from "react-bootstrap"; 
import Link from "next/link";

import { useState, useEffect } from 'react';
import ScrollBar from 'react-perfect-scrollbar';

import { getRateLimiterList } from '@/api/RateLimiterService'
import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';

import avatar1 from '@/assets/images/avatar-1.jpg';
import avatar2 from '@/assets/images/avatar-2.jpg';
import avatar3 from '@/assets/images/avatar-3.jpg';

export default function Page() {
    const [list, setList] = useState({} as rateLimiterList);
    useEffect(() => {
        const fetchData = async () => {
            const list = await getRateLimiterList();
            setList(list);
        };
        fetchData();
    }, []);

    return (
        <React.Fragment>
            <ul>
                {Object.keys(list).map(key => (
                    <li key={key}>{key} {JSON.stringify(list[key])  }</li>
                ))}
            </ul>
        </React.Fragment>
    )
}

function List() {
    const rateLimiterList = [];

    useEffect(() => {

    }, [])

    return (
        <React.Fragment>
            <Col md={6} xl={8}>
                <Card className="Recent-Users widget-focus-lg">
                    <Card.Header>
                    <Card.Title as="h5">Current Rate limiters</Card.Title>
                    </Card.Header>
                    <Card.Body className="px-0 py-2">
                    <Table responsive hover className="recent-users">
                        <tbody>
                        <tr className="unread">
                            <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1.src} alt="activity-user" />
                            </td>
                            <td>
                            <h6 className="mb-1">Isabella Christensen</h6>
                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                            </td>
                            <td>
                            <h6 className="text-muted">
                                <i className="fa fa-circle text-c-green f-10 m-r-15" />
                                11 MAY 12:56
                            </h6>
                            </td>
                            <td>
                            <Link href="#" className="label theme-bg2 text-white f-12">
                                Reject
                            </Link>
                            <Link href="#" className="label theme-bg text-white f-12">
                                Approve
                            </Link>
                            </td>
                        </tr>
                        <tr className="unread">
                            <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2.src} alt="activity-user" />
                            </td>
                            <td>
                            <h6 className="mb-1">Mathilde Andersen</h6>
                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                            </td>
                            <td>
                            <h6 className="text-muted">
                                <i className="fa fa-circle text-c-red f-10 m-r-15" />
                                11 MAY 10:35
                            </h6>
                            </td>
                            <td>
                            <Link href="#" className="label theme-bg2 text-white f-12">
                                Reject
                            </Link>
                            <Link href="#" className="label theme-bg text-white f-12">
                                Approve
                            </Link>
                            </td>
                        </tr>
                        <tr className="unread">
                            <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar3.src} alt="activity-user" />
                            </td>
                            <td>
                            <h6 className="mb-1">Karla Sorensen</h6>
                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                            </td>
                            <td>
                            <h6 className="text-muted">
                                <i className="fa fa-circle text-c-green f-10 m-r-15" />9 MAY 17:38
                            </h6>
                            </td>
                            <td>
                            <Link href="#" className="label theme-bg2 text-white f-12">
                                Reject
                            </Link>
                            <Link href="#" className="label theme-bg text-white f-12">
                                Approve
                            </Link>
                            </td>
                        </tr>
                        <tr className="unread">
                            <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1.src} alt="activity-user" />
                            </td>
                            <td>
                            <h6 className="mb-1">Ida Jorgensen</h6>
                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                            </td>
                            <td>
                            <h6 className="text-muted f-w-300">
                                <i className="fa fa-circle text-c-red f-10 m-r-15" />
                                19 MAY 12:56
                            </h6>
                            </td>
                            <td>
                            <Link href="#" className="label theme-bg2 text-white f-12">
                                Reject
                            </Link>
                            <Link href="#" className="label theme-bg text-white f-12">
                                Approve
                            </Link>
                            </td>
                        </tr>
                        <tr className="unread">
                            <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2.src} alt="activity-user" />
                            </td>
                            <td>
                            <h6 className="mb-1">Albert Andersen</h6>
                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                            </td>
                            <td>
                            <h6 className="text-muted">
                                <i className="fa fa-circle text-c-green f-10 m-r-15" />
                                21 July 12:56
                            </h6>
                            </td>
                            <td>
                            <Link href="#" className="label theme-bg2 text-white f-12">
                                Reject
                            </Link>
                            <Link href="#" className="label theme-bg text-white f-12">
                                Approve
                            </Link>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                    </Card.Body>
                </Card>
            </Col>
        </React.Fragment>
    )
}