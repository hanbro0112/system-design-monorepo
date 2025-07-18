import React from "react";
import menu from '@/pages/menu';
import Link from 'next/link';
import Image from 'next/image';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ListGroup, Card } from 'react-bootstrap';

// redux
import { navigationStore, navigationActionType } from '@/store/navigation';

import sidebarImage from '@/assets/images/sidebar.png';

import type { MenuItem } from '@/pages/menu';  

export const Navigation = () => {
    const navClass = ['pcoded-navbar'];
    const navBarClass = ['navbar-wrapper'];

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
                <ListGroup variant="flush" as="ul" bsPrefix=" " className="nav pcoded-inner-navbar" id="nav-ps-next">
                    {navItems}
                </ListGroup>
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
            {navItems}
        </React.Fragment>
    )
}

const NavItem = ({ item }: { item: MenuItem }) => {
    const itemTitle = item.icon ? <span className="pcoded-mtext">{item.title}</span>: item.title;
    
    const subContent = (
        <Link href={item.url!} target="">
            <a className="nav-link" >
                <NavIcon items={item} />
                {itemTitle}
            </a>
        </Link>
    )

    const mainContent = (
        <ListGroup.Item as="li" bsPrefix=" ">
            {subContent}
        </ListGroup.Item>
    )

    return (
        <React.Fragment>{mainContent}</React.Fragment>
    );
}

const NavCollapse = ({ collapse, type }: { collapse: MenuItem, type: string }) => {
    const navItems = collapse.children ? collapse.children.map((item: MenuItem) => {
        switch (item.type) {
            case 'collapse':
                return <NavCollapse key={item.id} collapse={item} type="sub" />;
            case 'item':
                return <NavItem key={item.id} item={item} />;
            default:
                return false;
        }
    }): '';
    const itemTitle = collapse.icon ? <span className="pcoded-mtext">{collapse.title}</span>: collapse.title;
    
    const navLinkClass = ['nav-link'];
    const navItemClass = ['nav-item', 'pcoded-hasmenu'];
    
    const { isOpen, isTrigger }: { isOpen: string[], isTrigger: string[] } = navigationStore.getState();
    const openIndex = isOpen.findIndex((id) => id === collapse.id);
    if (openIndex !== -1) {
        navItemClass.push('active');
    }

    const triggerIndex = isTrigger.findIndex((id) => id === collapse.id);
    if (triggerIndex !== -1) {
        navItemClass.push('pcoded-trigger');
    }

    const subContent = (
        <React.Fragment>
            <Link href="#">
                <a className={navLinkClass.join(' ')}
                    onClick={() => navigationStore.dispatch({
                        type: navigationActionType.TOGGLE_NAVIGATION,
                        menu: {
                            id: collapse.id,
                            type
                        }
                    })}
                >
                    <NavIcon items={collapse} />
                    {itemTitle}
                </a>
            </Link>
            <ListGroup variant="flush" bsPrefix=" " className={"pcoded-submenu"}>
                {navItems}
            </ListGroup>
        </React.Fragment>
    ) 

    const mainContent = (
        <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
            {subContent}
        </ListGroup.Item>
    )
    return (
        <React.Fragment>{mainContent}</React.Fragment>
    );
}

const NavCard = () => {
    const itemTarget = '_blank';
    return (
        <React.Fragment>
        <div className="p-20">
          <Card className="pro-card">
              <Card.Body>
                  <Image src={sidebarImage} className="img-radius " alt="User-Profile" width={50} height={50} />
                  <h5 className="text-white">Kick</h5>
                  <p className="text-white">Knock</p>
                  <a
                    href="#"
                    target={itemTarget}
                    className="btn text-white btn-primary"
                  >
                    Reset
                  </a>
              </Card.Body>
          </Card>
        </div>
      </React.Fragment>
    )
}

const NavIcon = ({ items }: { items: MenuItem }) => {
    const navIcons = items.icon ? (
        <span className="pcoded-micon">
            <i className={items.icon} />
        </span>
    ): false;

    return (
        <React.Fragment>{navIcons}</React.Fragment> 
    );
}

const NavLogo = () => {
    const toggleClass = ['mobile-menu'];
    return (
        <React.Fragment>
            <div className="navbar-brand header-logo">
                <div className='b-brand'>
                    <div className="b-bg">
                        <i className="feather icon-bar-chart" />
                    </div>
                    <span className="b-title">System Design</span>
                </div>
            </div>
        </React.Fragment>
    )
}