import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle, Input, Button, Form, Card, CardBody } from 'reactstrap';
import CountUp from "react-countup";
//import images
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import axios from 'axios';
import logoLight from "../assets/images/logo-light.png";
import FeatherIcon from "feather-icons-react";
//import Components
import SearchOption from '../Components/Common/SearchOption';
import LanguageDropdown from '../Components/Common/LanguageDropdown';
import NotificationDropdown from '../Components/Common/NotificationDropdown';
import ProfileDropdown from '../Components/Common/ProfileDropdown';
import { changeSidebarVisibility } from '../store/actions';
import { useSelector, useDispatch } from "react-redux";
import { get_cookie } from "../helpers/get_cookie";

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
    const [search, setSearch] = useState(false);
    const toogleSearch = () => {
        setSearch(!search);
    };

    const dispatch = useDispatch();
    const { sidebarVisibilitytype } = useSelector(state => ({
        sidebarVisibilitytype: state.Layout.sidebarVisibilitytype
    }));



    const toogleMenuBtn = () => {
        var windowSize = document.documentElement.clientWidth;
        dispatch(changeSidebarVisibility("show"));
        if (windowSize > 767)
            document.querySelector(".hamburger-icon").classList.toggle('open');
        //For collapse horizontal menu
        if (document.documentElement.getAttribute('data-layout') === "horizontal") {
            document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
        }
        //For collapse vertical and semibox menu
        if (sidebarVisibilitytype === "show" && (document.documentElement.getAttribute('data-layout') === "vertical" || document.documentElement.getAttribute('data-layout') === "semibox")) {
            if (windowSize < 1025 && windowSize > 767) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'sm') ? document.documentElement.setAttribute('data-sidebar-size', '') : document.documentElement.setAttribute('data-sidebar-size', 'sm');
            } else if (windowSize > 1025) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'lg') ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg');
            } else if (windowSize <= 767) {
                document.body.classList.add('vertical-sidebar-enable');
                document.documentElement.setAttribute('data-sidebar-size', 'lg');
            }
        }
        //Two column menu
        if (document.documentElement.getAttribute('data-layout') === "twocolumn") {
            document.body.classList.contains('twocolumn-panel') ? document.body.classList.remove('twocolumn-panel') : document.body.classList.add('twocolumn-panel');
        }
    };
    const [quotes, setQuotes] = useState();
    const [totalQuotes,setTotalQuotes] = useState();
    const getQuotes = () => {
        const api_token = JSON.parse(get_cookie('authUser'));
        console.log(api_token.success)
        if(api_token.success){
          const headers = {
            Authorization: `Bearer ${api_token.token}` // Assuming the token is stored in the 'token' property
        };
        axios.get("api/getTenantJobs", { headers })
            .then(res => {
                console.log(res);
                setQuotes(res.jobs_this_month);
                setTotalQuotes(res.jobs_per_month)
            })
            .catch(err =>
                console.log(err))
    }
    }
    useEffect(() => {
        getQuotes();
    }, [])

    return (
        <React.Fragment>
            <header id="page-topbar" className={headerClass}>
                <div className="layout-width">
                    <div className="navbar-header">
                        <div className="d-flex">

                            <div className="navbar-brand-box horizontal-logo">
                                {/* <Link to="/inbox" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoDark} alt="" height="40" />
                                    </span>
                                </Link>

                                <Link to="/dashboard" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoLight} alt="" height="17" />
                                    </span>
                                </Link> */}
                                <h1  >Real x</h1>
                            </div>

                            <button 
                                onClick={toogleMenuBtn}
                                type="button"
                                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                                id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>
                            <SearchOption />

                        </div>

                        <div className="hstack gap-2">
                            <div>
                                <h6 className="mt-0 ff-secondary fw-semibold text-muted">
                                    <span className="counter-value bg-light text-primary p-1 fs-16" data-target="97.66">
                                        {quotes ?
                                            (
                                                <CountUp
                                                    key={quotes} // Add the key prop with the quotes value
                                                    start={0}
                                                    end={quotes}
                                                    decimals={0}
                                                    duration={4}
                                                />
                                            ) : (
                                                0
                                            )}

                                    </span> of <b>{totalQuotes} </b>Quotes this month
                                </h6>

                            </div>

                            <div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className="avatar-title bg-soft-info rounded-circle fs-2">
                                        <FeatherIcon
                                            icon="activity"
                                            className="text-info"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center">

                            <Dropdown isOpen={search} toggle={toogleSearch} className="d-md-none topbar-head-dropdown header-item">
                                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                    <i className="bx bx-search fs-22"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                                    <Form className="p-3">
                                        <div className="form-group m-0">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Search ..."
                                                    aria-label="Recipient's username" />
                                                <button className="btn btn-primary" type="submit"><i
                                                    className="mdi mdi-magnify"></i></button>
                                            </div>
                                        </div>
                                    </Form>
                                </DropdownMenu>
                            </Dropdown>

                            {/* NotificationDropdown */}
                            <NotificationDropdown />

                            {/* ProfileDropdown */}
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

export default Header;