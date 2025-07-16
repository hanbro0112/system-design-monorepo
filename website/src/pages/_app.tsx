import { AppProps } from 'next/app';
import './_app.scss';
import { AdminLayout } from '@/components/adminLayout';
import React from 'react';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <React.Fragment>
            <AdminLayout children={<Component {...pageProps} />}/>
        </React.Fragment>
    );
}