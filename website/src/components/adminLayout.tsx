import React from 'react';
import { Navigation } from './navigation';
import { NavBar } from './navBar';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    let mainClass = ['pcoded-wrapper'];

    let common = (
        <React.Fragment>
            <Navigation />
            <NavBar />
        </React.Fragment>
    );
    
    return (
        <React.Fragment>
            {common}
        </React.Fragment>
    );
}