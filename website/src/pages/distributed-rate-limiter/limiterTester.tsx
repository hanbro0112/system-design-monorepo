import React from 'react';
import { Card, Col, Row, Form, Button } from "react-bootstrap";

import toast from 'react-hot-toast';

import { useSelector, useDispatch } from 'react-redux';

import { testConfig } from './type';
import { setTester, deleteTester } from '@/store/rateLimit';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
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

function Tester({ testerKey }: { testerKey: string }) {
    const dispatch = useDispatch<any>();
    const tester: testConfig = useSelector((state: any) => state.rateLimit.tester.find((item: testConfig) => item.key === testerKey));
    if (!tester) return null;
    const label = new Array(tester.data.length).fill(0).map((_, i) => 0.5 * i);
    const data = tester.data.slice(0, Math.min(2 * Math.round((Date.now() - tester.startTime) / 1000), tester.data.length));
    const chartData = {
        labels: label,
        datasets: [
            {
                label: 'TotalRequest',
                data: data.map(item => item.TotalRequest),
                borderColor: 'rgba(254, 229, 3, 1)',
                backgroundColor: 'rgba(254, 229, 3, 1.0)',
                borderWidth: 2,
                radius: 0
            },
            {
                label: 'SuccessRequest',
                data: data.map(item => item.SuccessRequest),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 1.0)',
                borderWidth: 1.5,
                radius: 0
            },
            // {
            //     label: 'FailedRequest',
            //     data: data.map(item => item.FailRequest),
            //     borderColor: 'rgba(255, 99, 132, 1)',
            //     backgroundColor: 'rgba(255, 99, 132, 1.0)',
            //     borderWidth: 1.5,
            //     radius: 0
            // },
        ],
    };
    

    const options: ChartOptions<'line'> = {
        animation: false, // 關閉動畫以獲得更流暢的即時效果
        responsive: true, // 讓圖表自動隨容器大小調整
        interaction: {
            intersect: false
        },
        plugins: {
                legend: {
                position: 'top' as const, // 設定圖例顯示在圖表上方
            },
                title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
        scales: {
            x: {
                min: 0,
                max: 60,
                type: 'linear'
            },
            y: {
                min: 0,
                max: tester.frequencyRange * 2,
            }
        }
    };

    return (
        <Row>
            <Col sm={12} md={10}>
            <Card>
                <Card.Header>
                    <Card.Title as="h5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{tester.method}: {tester.key}</span>
                        <span>
                            <Button
                                variant="link"
                                size="sm"
                                style={{ padding: 0, marginRight: 10 }}
                                onClick={() => {
                                    const toastId = toast.loading(`Testing ${tester.key}`);
                                    dispatch(setTester({ meta: { ...tester, toastId }, dispatch }));
                                }}
                            >            
                                <i className="fa fa-refresh" style={{ color: '#222', fontSize: 18 }} />
                            </Button>
                            <Button
                                variant="link"
                                size="sm"
                                style={{ padding: 0, marginRight: 5 }}
                                onClick={() => {
                                    dispatch(deleteTester({ key: tester.key, method: tester.method }));
                                }}
                            >
                                <i className="fa fa-trash" style={{ color: '#d32f2f', fontSize: 18 }} />
                            </Button>
                        </span>
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Line options={options} data={chartData} />
                </Card.Body>
            </Card>
            </Col>
        </Row>
    )
}
