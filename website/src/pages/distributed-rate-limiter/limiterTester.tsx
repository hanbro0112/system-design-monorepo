import React from 'react';
import { Card, Col, Row, Form, Button } from "react-bootstrap";

import toast from 'react-hot-toast';

import { useSelector, useDispatch } from 'react-redux';

import { testConfig } from './type';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true, // 讓圖表自動隨容器大小調整
  plugins: {
    legend: {
      position: 'top' as const, // 設定圖例顯示在圖表上方
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

function Tester({ testerKey }: { testerKey: string }) {
    const dispatch = useDispatch<any>();
    const tester: testConfig = useSelector((state: any) => state.rateLimit.tester.find((item: testConfig) => item.key === testerKey));
    
    const startTime = tester.data[0].timestamp;
    const label = new Array(60 * tester.repeat).fill(0).map((_, i) => i);
    const chartData = {
        labels: label,
        datasets: [
            {
                label: 'TotalRequest',
                data: tester.data.map(item => {}),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'SuccessRequest',
                data: tester.data.map(item => item.successCount),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'FailedRequest',
                data: tester.data.map(item => item.failedCount),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    return (
        <Row>
            <Col sm={12} md={10}>
            <Card>
                <Card.Header>
                    <Card.Title as="h5">{tester.method}: {tester.key}  </Card.Title>
                </Card.Header>
                <Card.Body>

                
                </Card.Body>
            </Card>
            </Col>
        </Row>
    )
}

export default function LimiterTester() {
    const testerKeyList = useSelector((state: any) => state.rateLimit.tester.map((item: testConfig) => item.key));
    
    return (
        <React.Fragment>
        {testerKeyList.map((key: string) => (
            <Tester testerKey={key} />
        ))}
        </React.Fragment>
    );
}