import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Label, Modal, ModalBody, Row, Col, Card, CardHeader, Nav, NavItem, NavLink, Accordion, AccordionItem, Collapse } from 'reactstrap';
import classnames from "classnames";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { api } from "../../config"
import img13 from "../../assets/images/small/userimage.png";
import * as moment from "moment";
import AllSearchFilter from '../../pages/SearchFilter/AllSearchFilter';
import AddressSearchFilter from '../../pages/SearchFilter/AddressSearchFilter';
import TagsSearchFilter from '../../pages/SearchFilter/TagsSearchFilter';
import JobOpportunitySearchFilter from '../../pages/SearchFilter/JobOpportunitySearchFilter';
import PeopleSearchFilter from '../../pages/SearchFilter/PeopleSearchFilter';
import StorageContainer from '../../pages/SearchFilter/StorageContainer';




//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { Button } from 'bootstrap';

const ProfileDropdown = (val) => {
    console.log(val,"val")
    const { user } = useSelector(state => ({
        user: state.Profile.user,
    }));

    const [userName, setUserName] = useState("Admin");

    useEffect(() => {
        if (sessionStorage.getItem("authUser")) {
            const obj = JSON.parse(sessionStorage.getItem("authUser"));
            setUserName(process.env.REACT_APP_DEFAULTAUTH === "fake" ? obj.username === undefined ? user.first_name ? user.first_name : obj.data.first_name : "Admin" || "Admin" :
                process.env.REACT_APP_DEFAULTAUTH === "firebase" ? obj.providerData[0].email : "Admin"
            );
        }
        
    }, [userName, user]);

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    const [gbl, setGbl] = useState('');
    const [employeeDetails, setEmployeeDetails] = useState('');

    const [dataToSend, setDataToSend] =useState({
        applyBtn: false,
        createdDateStart:"",
        createdDateEnd:""
      });

    const loadSettings = () => {
        axios.get('/api/profile-settings/data')
            .then(response => {
                setGbl(response.userdetail);
                setEmployeeDetails(response.employeedetail);
            })
            .catch(error => {
                console.log(error);
            })

        axios.get("/api/backloading")
            .then(res => {
                setOrg_Date(res.organisation_settings);
                setCreatedDateEnd(moment().add(1, 'months').format(res.organisation_settings?.date_format_js));
                setCreatedDateStart(moment().subtract(1, 'months').format(res.organisation_settings?.date_format_js));
                setDataToSend({...dataToSend,createdDateStart:"29/03/2023",createdDateEnd:"29/03/2023"})
            })
            .catch(err => {
                console.log(err)
            })
    }

    //*backend response*
    useEffect(() => {
        loadSettings();
    }, []);

    // console.log("Image Path:", api.WEB_URL);

    //Modal for searrch filter
    const [modalOpen, setModalOpen] = useState(false);
    const [componentToShow, setComponentToShow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [customActiveTab, setcustomActiveTab] = useState("All");
    const [col1, setcol1] = useState(false);
    const [org_date, setOrg_Date] = useState([]);
    const [createdDateStart, setCreatedDateStart] = useState(null);
    const [createdDateEnd, setCreatedDateEnd] = useState(null);
    const [value, setValue] = useState("");
    console.log(value)
    const t_col1 = () => {
        setcol1(!col1);

    };
    const handleClick = (component) => {
        setComponentToShow(component);
        if (customActiveTab !== component) {
            setcustomActiveTab(component);
        }
    };

    const handleLinkClick = () => {
        setModalOpen(false)
        setValue("")
      }
    
    const renderComponent = () => {
        console.log(value)
        switch (componentToShow) {
            case "All":
                return <AllSearchFilter value={searchFilterValue} dataToSend={dataToSend} handleLinkClick={handleLinkClick} resetCounter={resetCounter} />;
            case "People":

                return <PeopleSearchFilter value={searchFilterValue} dataToSend={dataToSend} handleLinkClick={handleLinkClick} resetCounter={resetCounter} />;
            case "Tags":
                return (
                    <TagsSearchFilter value={searchFilterValue} dataToSend={dataToSend} handleLinkClick={handleLinkClick} resetCounter={resetCounter} />
                );
            case "JobOpportunity":
                return (
                    <JobOpportunitySearchFilter value={searchFilterValue} dataToSend={dataToSend} handleLinkClick={handleLinkClick} resetCounter={resetCounter} />
                );
            case "Address":
                return (
                    <AddressSearchFilter value={searchFilterValue} dataToSend={dataToSend} handleLinkClick={handleLinkClick} resetCounter={resetCounter} />
                );
            case "StorageContainer":
                return (
                    <StorageContainer value={searchFilterValue} dataToSend={dataToSend} handleLinkClick={handleLinkClick} resetCounter={resetCounter} />
                );
            default:
                return <AllSearchFilter value={searchFilterValue} dataToSend={dataToSend} handleLinkClick={handleLinkClick} resetCounter={resetCounter} />;
        }
    };

    const [searchFilterValue, setSearchFilterValue] = useState(false);

    const handleSearch = () => {
        setSearchFilterValue(value)
      };

    const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
    };

    const handleButtonClick = () => {
    setModalOpen(true);
    setValue('');
    setDataToSend({ ...dataToSend, applyBtn: false });
    };

    //Opportunity search filter
        

        const handleApplyClick = () => {
            console.log(dataToSend)
            setDataToSend({...dataToSend,applyBtn:true,createdDateEnd,createdDateStart});
        }

        const [resetCounter, setResetCounter] = useState(0);

        const resetTable = () => {
            setCreatedDateEnd(moment().add(1, 'months').format(org_date.date_format_js));
            setCreatedDateStart(moment().subtract(1, 'months').format(org_date.date_format_js));
            setResetCounter(resetCounter + 1);
          }

    return (
        <React.Fragment>
            <button className='ri-search-line searchBtn clsSearchButton' onClick={handleButtonClick}></button>
            <Modal
                id="showModal"
                className="modal-dialog-edit searchModal"
                isOpen={modalOpen}
                centered
                backdrop="static" keyboard="false"
            >
                <ModalBody className="py-2 px-3">

                    <div className="mt-2">
                        <Row>
                        <Col xl={10}>
                            <input className='searchInpt fs-3' placeholder='Search Everything...' value={value} onChange={(e) => {
                                setValue(e.target.value);
                            }}
                            onKeyPress={handleKeyPress}
                            // onBlur={()=>{renderComponent()}}
                            ></input>
                            <hr style={{ color: "black" }}></hr>
                        </Col>
                        <Col  xl={2} className="d-flex justify-content-end">
                            <button type="button" onClick={() => setModalOpen(false)} className='border-0' style={{ backgroundColor: "white"}}> <i className='ri-close-circle-line fs-1 clsSearchButton'></i></button>
                        </Col>
                        </Row>
                    </div>
                    <div>
                        <Row className=''><Col xl={9}>
                            <div className="row align-items-center">
                                <div className="col">
                                    {
                                        <div style={{display:"flex"}}>
                                            <button className={`text-center searchFilterBtn${customActiveTab === 'All' ? ' active' : ''}`}
                                                onClick={() => {
                                                    handleClick("All");
                                                }}>All</button>
                                            <button className={`text-center searchFilterBtn mlBtn${customActiveTab === 'People' ? ' active' : ''}`} onClick={() => {
                                                handleClick("People");
                                            }}>People</button>
                                            <button className={`text-center searchFilterBtn mlBtn${customActiveTab === 'Tags' ? ' active' : ''}`} onClick={() => {
                                                handleClick("Tags");
                                            }}>Tags</button>
                                            <button className={`text-center searchFilterBtn mlBtn${customActiveTab === 'JobOpportunity' ? ' active' : ''}`} onClick={() => {
                                                handleClick("JobOpportunity");
                                            }}>Jobs / Opportunity #</button>
                                            <button className={`text-center searchFilterBtn mlBtn${customActiveTab === 'Address' ? ' active' : ''}`} onClick={() => {
                                                handleClick("Address");
                                            }}>Address</button>
                                            <button className={`text-center searchFilterBtn mlBtn${customActiveTab === 'StorageContainer' ? ' active' : ''}`} onClick={() => {
                                                handleClick("StorageContainer");
                                            }}>Storage Container</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </Col ><Col xl={3} className='d-flex justify-content-end mt-3' ><h2 className="accordion-header" id="headingOne">
                            <button className='border-0' style={{ width: "120px", height: "30px", borderRadius: "5px", fontSize: "15px" }} onClick={t_col1}>Filter By Date</button>
                        </h2></Col></Row>
                        <Row className="mt-3" >
                            <Col xl={12}><Accordion id="default-accordion-example">
                                <AccordionItem>

                                    <Collapse isOpen={col1} className="accordion-collapse" id="collapseOne" >
                                        <div className="accordion-body">
                                            <Row>
                                                <Col lg={4}>
                                                    <div className="mb-3">
                                                        <Label className="form-label"> Start Date</Label>
                                                        <Flatpickr
                                                            className="form-control" placeholder='Start Date'
                                                            options={{
                                                                dateFormat: org_date?.date_format,
                                                            }}
                                                            value={createdDateStart}
                                                            onChange={(selectedDates) => {
                                                                if (selectedDates?.length === 1) {
                                                                    setCreatedDateStart(moment(selectedDates[0]).format(org_date?.date_format_js));
                                                                } else {
                                                                    setCreatedDateStart(null);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col lg={4}>
                                                    <div className="mb-3">
                                                        <Label className="form-label"> End Date</Label>
                                                        <Flatpickr
                                                            className="form-control"
                                                            value={createdDateEnd}
                                                            options={{
                                                                dateFormat: org_date?.date_format,
                                                            }}
                                                            onChange={(selectedDates) => {
                                                                if (selectedDates?.length === 1) {
                                                                    setCreatedDateEnd(moment(selectedDates[0]).format(org_date?.date_format_js));
                                                                } else {
                                                                    setCreatedDateEnd(null);
                                                                }
                                                            }} />

                                                    </div>
                                                </Col>
                                                <Col lg={2}>
                                                    <div className="mb-3">
                                                    <button type="submit" className="btn form-btn-marg btn-primary" onClick={handleApplyClick}
                                                    >Apply</button>
                                                    
                                                    </div>
                                                </Col>
                                                <Col lg={2}>
                                                    <div className="mb-3">
                                                    <button type="submit" className="btn form-btn-marg btn-primary" onClick={resetTable}
                                                    >Reset</button>
                                                    </div>
                                                </Col>
                                                
                                            </Row>
                                        </div>
                                    </Collapse>
                                </AccordionItem>
                            </Accordion></Col>
                        </Row>
                    </div>
                    
                    <div className=''>
                        {renderComponent()}
                    </div>
                </ModalBody>
            </Modal>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-0 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        {/* <img className="rounded-circle header-profile-user" src={avatar1}
                            alt="Header Avatar" /> */}
                        <img
                            className="rounded-circle header-profile-user"
                            src={
                                gbl && gbl.image
                                    ? api.WEB_URL + "user-uploads/avatar/" + gbl.image
                                    : img13
                            }
                            alt="Header Avatar" style={{ width: '38px' }}
                        />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{gbl.name} <i className="ri-arrow-down-s-fill" style={{ verticalAlign: "bottom" }}></i></span>
                            {/* <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">Founder</span> */}
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">

                    <h6 className="dropdown-header">Welcome {gbl.name}!</h6>

                    <DropdownItem href={"/settings/profile-settings"}><span
                        className="badge bg-soft-success text-success mt-1 float-end">New</span>
                        <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
                        <span
                            className="align-middle">Settings</span></DropdownItem>

                    <DropdownItem href={process.env.PUBLIC_URL + "/logout"}><i
                        className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle" data-key="t-logout">Logout</span></DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;