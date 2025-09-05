import React from 'react';
import { Navigation } from './navigation';
import { NavBar } from './navBar';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const mainClass = ['pcoded-wrapper'];

    const common = (
        <React.Fragment>
            <Navigation />
            <NavBar />
        </React.Fragment>
    );

    const mainContainer = (
        <React.Fragment>
      <div className="pcoded-main-container">
        <div className={mainClass.join(' ')}>
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              {children}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
    )
    
    return (
        <React.Fragment>
            {common}
            {mainContainer}
        </React.Fragment>
    );
}