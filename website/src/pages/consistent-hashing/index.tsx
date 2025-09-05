import React from 'react';
import EmulatorList from './emulatorList';
import EmulatorOptions from './emulatorOptions';


export default function Page() {
    return (
        <React.Fragment>
            <EmulatorList />
            <EmulatorOptions />
        </React.Fragment>
    )
}       