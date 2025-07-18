import React from 'react';
import Link from 'next/link';
import { ListGroup, Dropdown } from 'react-bootstrap';

// redux
import { navigationStore, navigationActionType } from '@/store/navigation';

export const NavBar = () => {
    const headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg'];
    const toggleClass = ['mobile-menu'];
    const moreClass = ['collapse', 'navbar-collapse'];
    const collapseClass = ['collapse', 'navbar-collapse'];

    // headerClass.push('headerpos-fixed');

    const navBar = (
        <React.Fragment>
            <div style={{ justifyContent: 'space-between' }} className={collapseClass.join(' ')}>
                <NavLeft />
                {/* <NavRight /> */}
            </div>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <header className={headerClass.join(' ')}>{navBar}</header>
        </React.Fragment>
    )
} 

const NavLeft = () => {
    const navItemClass = ['nav-item'];

    return (
        <React.Fragment>
          <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
            <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
              <Dropdown align={'start'}>
                <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                  Dropdown
                  </Dropdown.Toggle>
                  <ul>
                    <Dropdown.Menu>
                      <li>
                        <Link href="#">
                          <a className="dropdown-item">Action 1</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <a className="dropdown-item">Action 2</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <a className="dropdown-item">Action 3</a>
                        </Link>
                      </li>
                    </Dropdown.Menu>
                  </ul>
              </Dropdown>
            </ListGroup.Item>
            <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
              {/* <NavSearch windowWidth={windowSize.width} /> */}
            </ListGroup.Item>
          </ListGroup>
        </React.Fragment>
    );
}