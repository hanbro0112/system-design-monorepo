import React from "react";
import menu from '@/pages/menu';
import Link from 'next/link';
import Image from 'next/image';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ListGroup, Card } from 'react-bootstrap';

import sidebarImage from '@/assets/images/sidebar.png';

import type { MenuItem } from '@/pages/menu';  

export const Navigation = () => {
    let navClass = ['pcoded-navbar'];
    let navBarClass = ['navbar-wrapper'];

    const navContent = (
        <div className={navBarClass.join(' ')}>
            <NavLogo />
            <NavContent navigation={menu.items} />
        </div>
    );

    return (
        <React.Fragment>
            <nav className={navClass.join(' ')}>{navContent}</nav>
        </React.Fragment>
    );
}



const NavContent = ({ navigation }: { navigation: MenuItem[] }) => {
    const navItems = navigation.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={`nav-group-${item.id}`} group={item} />;
            default:
                return false;
        }
    })

    const mainContent = (
        <div className="navbar-content datta-scroll">
            <PerfectScrollbar>
                {/* <ListGroup variant="flush" as="ul" bsPrefix=" " className="nav pcoded-inner-navbar" id="nav-ps-next">
                    {navItems}
                </ListGroup> */}
                <NavCard />
            </PerfectScrollbar>
        </div>
    )
    return (
        <React.Fragment>
            {mainContent}
        </React.Fragment>
    );
}

const NavGroup = ({ group }: { group: MenuItem }) => {
    let navItems;

    if (group.children) {
        const groups = group.children;
        navItems = groups.map((item: MenuItem) => {
            switch (item.type) {
                case 'collapse':
                    return <NavCollapse key={item.id} collapse={item} type="main"/>;
                case 'item':
                    return <NavItem key={item.id} item={item}/>;
                default:    
                    return false; 
            }
        });
    }

    return (
        <React.Fragment>
            <ListGroup.Item as="li" bsPrefix=" " key={group.id} className="nav-item pcoded-menu-caption">
                <label>{group.title}</label>
            </ListGroup.Item>
        </React.Fragment>
    )
}

const NavItem = ({ item }: { item: MenuItem }) => {
    const itemTitle = item.icon ? <span className="pcoded-mtext">{item.title}</span>: item.title;
    
    const subContent = (
        <Link href={item.url!} className=
    
    )

}

const NavCard = () => {
    const itemTarget = '_blank';
    return (
        <React.Fragment>
        <div className="p-20">
          <Card className="pro-card">
              <Card.Body>
                  <Image src={sidebarImage} className="img-radius " alt="User-Profile" width={50} height={50} />
                  <h5 className="text-white">Next Step</h5>
                  <p className="text-white">To the moon</p>
                  <a
                    href="#"
                    target={itemTarget}
                    className="btn text-white btn-primary"
                  >
                    Opp
                  </a>
              </Card.Body>
          </Card>
        </div>
      </React.Fragment>
    )
}


const NavLogo = () => {
    const toggleClass = ['mobile-menu'];
    return (
        <React.Fragment>
            <div className="navbar-brand header-logo">
                <Link href="#" className="b-brand">
                    <div>
                        <div className="b-bg">
                            <i className="feather icon-trending-up" />
                        </div>
                        <span className="b-title"> System Design</span>
                    </div>
                </Link>
                <span />
            </div>
        </React.Fragment>
    )
}