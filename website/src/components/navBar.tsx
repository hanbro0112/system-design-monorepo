import React, { useState } from 'react';
import Link from 'next/link';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

// redux
import { navigationStore, navigationActionType } from '@/store/navigation';

import avatar1 from '@/assets/images/avatar-1.jpg'; 
import avatar2 from '@/assets/images/avatar-2.jpg';
import avatar3 from '@/assets/images/avatar-3.jpg';
import avatar4 from '@/assets/images/avatar-4.jpg';

export const NavBar = () => {
    const headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg'];

    const navBar = (
        <React.Fragment>
            <div style={{ justifyContent: 'space-between' }} className='collapse navbar-collapse'>
              <NavLeft />
              <NavRight />
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
                        <Link href="#" className="dropdown-item">
                          Action 1
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="dropdown-item">
                          Action 2
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="dropdown-item">
                          Action 3
                        </Link>
                      </li>
                    </Dropdown.Menu>
                  </ul>
              </Dropdown>
            </ListGroup.Item>
            {/* <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
              <NavSearch windowWidth={windowSize.width} />
            </ListGroup.Item> */}
          </ListGroup>
        </React.Fragment>
    );
}
const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);

  const notiData = [
    {
      name: 'Joseph William',
      image: avatar2,
      details: 'Purchase New Theme and make payment',
      activity: '30 min'
    },
    {
      name: 'Sara Soudein',
      image: avatar3,
      details: 'currently login',
      activity: '30 min'
    },
    {
      name: 'Suzen',
      image: avatar4,
      details: 'Purchase New Theme and make payment',
      activity: 'yesterday'
    }
  ];

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end">
            <Dropdown.Toggle as={Link} variant="link" href="#" id="dropdown-basic">
              <i className="feather icon-bell icon" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification notification-scroll">
              <div className="noti-head">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                <div className="float-end">
                  <Link href="#" className="me-2">
                    mark as read
                  </Link>
                  <Link href="#">clear all</Link>
                </div>
              </div>
              <PerfectScrollbar>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">NEW</p>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="notification">
                    <Card
                      className="d-flex align-items-center shadow-none mb-0 p-0"
                      style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                    >
                      <img className="img-radius" src={avatar1.src} alt="Generic placeholder" />
                      <Card.Body className="p-0">
                        <p>
                          <strong>John Doe</strong>
                          <span className="n-time text-muted">
                            <i className="icon feather icon-clock me-2" />
                            30 min
                          </span>
                        </p>
                        <p>New ticket Added</p>
                      </Card.Body>
                    </Card>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">EARLIER</p>
                  </ListGroup.Item>
                  {notiData.map((data, index) => {
                    return (
                      <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
                        <Card
                          className="d-flex align-items-center shadow-none mb-0 p-0"
                          style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                        >
                          <img className="img-radius" src={data.image.src} alt="Generic placeholder" />
                          <Card.Body className="p-0">
                            <p>
                              <strong>{data.name}</strong>
                              <span className="n-time text-muted">
                                <i className="icon feather icon-clock me-2" />
                                {data.activity}
                              </span>
                            </p>
                            <p>{data.details}</p>
                          </Card.Body>
                        </Card>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer">
                <Link href="#">show all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown>
            <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox" onClick={() => setListOpen(true)}>
              <i className="icon feather icon-mail" />
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align={'end'} className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" href="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img src={avatar1.src} className="img-radius" alt="User Profile" />
                <span>John Doe</span>
                <Link href="#" className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link href="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link href="#" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link href="#" className="dropdown-item">
                    <i className="feather icon-mail" /> My Messages
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link href="#" className="dropdown-item">
                    <i className="feather icon-lock" /> Lock Screen
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      {/* <ChatList listOpen={listOpen} closed={() => setListOpen(false)} /> */}
    </React.Fragment>
  );
}