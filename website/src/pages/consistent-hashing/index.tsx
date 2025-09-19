import React from 'react';
import Emulator from './emulator';
import EmulatorList from './emulatorList';
import EmulatorOptions from './emulatorOptions';


export default function Page() {
    return (
        <React.Fragment>
            <Emulator />
            <EmulatorList />
            <EmulatorOptions />
        </React.Fragment>
    )
}       