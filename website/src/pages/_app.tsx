import { AppProps } from 'next/app';
import './_app.scss';
import { Toaster } from 'react-hot-toast';
import { AdminLayout } from '@/components/adminLayout';
import React from 'react';

import { Provider } from 'react-redux'; 
import store from '@/store';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <React.Fragment>
            <Provider store={store}>
                <AdminLayout children={<Component {...pageProps} />}/>
                <Toaster />
            </Provider>
        </React.Fragment>
    );
}