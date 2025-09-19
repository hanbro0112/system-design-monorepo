import React, { useState } from 'react';
import { Button, Card, Row, Col, Form } from "react-bootstrap"; 

export default function Emulator() {
    // 使用 useState 來儲存所有小圓點的位置
  const [circles, setCircles] = useState([] as { x: number; y: number }[]);

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

  const handleCircleClick = (event: any) => {
    // 取得點擊位置相對於大圓的坐標
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 將新圓點的位置添加到 state 陣列中
    setCircles([...circles, { x, y }]);
  };

  return (
    <div style={{ background: '#eee', padding: '40px', minHeight: '100vh' }}>
        <div style={largeCircleStyle} onClick={handleCircleClick}>
            <div style={middleCircleStyle} />
            {circles.map((circle, index) => (
            <div
                key={index}
                style={{
                    ...smallCircleStyle,
                    left: `${circle.x}px`,
                    top: `${circle.y}px`,
                    transform: 'translate(-50%, -50%)',
                }}
            />
            ))}
        </div>
        <React.Fragment>
        <Row>
            <Col sm={12} md={6}>
                <Card style={{ height: '95%' }}>
                <Card.Header>
                    <Card.Title as="h5">Limiter </Card.Title>
                </Card.Header>
                <Card.Body style={{ height: '95%' }}>
                                
                </Card.Body>
                </Card>
            </Col>
        </Row>
        </React.Fragment>
    </div>
  );
};
