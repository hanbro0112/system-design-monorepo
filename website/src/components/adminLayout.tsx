import React from 'react';
import { Navigation } from './navigation';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    let mainClass = ['pcoded-wrapper'];

    let common = (
        <React.Fragment>
            <Navigation />
        </React.Fragment>
    );
    
    return (
        <React.Fragment>
            {common}
        </React.Fragment>
    );
}