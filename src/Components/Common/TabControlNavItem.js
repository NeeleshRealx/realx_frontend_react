import React from 'react'
import { NavItem, NavLink } from 'reactstrap';

export const TabControlNavItem = ({ navObject, onClickCallback, activeTab }) => {
    return (
        <NavItem>
            <NavLink className={`mb-2 cursor-pointer ${navObject === activeTab ? 'active' : ''}`}
                onClick={() => { onClickCallback(navObject)}}>
               <div>
                    <i className={`bx bxs-${navObject.iconClass}`}  style={{ fontSize: '15px' , marginTop: '5px' }}></i>
                    <span style={{ paddingBottom: '0px', marginLeft: '15px' }}>{navObject.displayText}</span>
                </div>
            </NavLink>
        </NavItem>
    )
}

export default TabControlNavItem;