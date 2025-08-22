import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { fetchData } from '@/store/rateLimit';

import LimiterList from './limiterList';
import LimiterOptions from './limiterOptions';
import LimiterTester from './limiterTester';

export default function Page() {
    const dispatch = useDispatch<any>();

    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    return (
        <React.Fragment>
            <LimiterList />
            <LimiterOptions />
            <LimiterTester />
        </React.Fragment>
    )
}
