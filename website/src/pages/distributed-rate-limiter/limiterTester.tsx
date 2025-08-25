import React from 'react';
import { Card, Col, Row, Form, Button } from "react-bootstrap";

import toast from 'react-hot-toast';

import { useSelector, useDispatch } from 'react-redux';



export default function LimiterTester() {
    const dispatch = useDispatch<any>();
    const { testerList } = useSelector((state: any) => state.rateLimit);


    return (
        <React.Fragment>
        <Row>
            {/* Add Rate Limiter Section */}
            <Col sm={12} md={10}>
                <Card>
                    <Card.Header>
                        <Card.Title as="h5">Limiter </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {testerList}
                        {/* <Form onSubmit={handleSubmit}>
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
                                <Options method={method} />
                            </Row>
                        </Form> */}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </React.Fragment>
    );
}