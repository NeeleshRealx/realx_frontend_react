import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Progress,
  Button,
} from "reactstrap";
import axios from "axios";

//Import images
import dummyUser from "../../assets/images/users/user-dummy-img.jpg";
import logoDark from "../../assets/images/logo-dark.png";
import { ToastContainer, toast } from 'react-toastify';

import classnames from "classnames";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// register lottie and define custom element
defineElement(lottie.loadAnimation);

const Register = () => {
//   const history = useNavigate();
  const history = useNavigate();

  const [activeTab, setactiveTab] = useState(1);
  const [activeArrowTab, setactiveArrowTab] = useState(4);
  const [activeVerticalTab, setactiveVerticalTab] = useState(7);
  const [progressbarvalue, setprogressbarvalue] = useState(0);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [passedarrowSteps, setPassedarrowSteps] = useState([1]);
  const [passedverticalSteps, setPassedverticalSteps] = useState([1]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [businessname, setBusinessName] = useState("");
  const [businessaddress1, setBusinessAddress1] = useState("");
  const [businessaddress2, setBusinessAddress2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [module, setModule] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [mobile, setMobileNumber] = useState("");
  const [webaddress, setWebAddress] = useState("");
  const [abn, setABN] = useState("");
  const [isgst, setIsGst] = useState("");
  const [employeecount, setEmployeecount] = useState("");
  const [countriesList, setCountriesList] = useState("");
  const [business_industries, setBusinessIndustries] = useState("");
  const [sys_modules, setSysModules] = useState("");
  const [tab1submitted, setTab1submitted] = useState(false);
  const [tab2submitted, setTab2submitted] = useState(false);
  const [tab3submitted, setTab3submitted] = useState(false);
  const [email, setEmailInput] = useState("");
  const [emailexists, setEmailexists] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [passmatch, setPassmatch] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [otp, setOTP] = useState("");

  //   useEffect(() => {
  //     get_data();
  // }, []);

  // const get_data = () => {
  //     axios.get('/api/registration').then((res)=>{
  //         setCountriesList(res.countries);
  //         setBusinessIndustries(res.business_industries);
  //         setSysModules(res.sys_modules);
  //         setCountry(res.countries[0].country_id);
  //         setModule(res.sys_modules[0].id);
  //     })
  // };

  const handlePasswordBlur = () => {
    //console.log(inputValue)
    var msg = "Enter confirm password same as password";
    password != confirmpassword ? setPassmatch(msg) : setPassmatch("");
  };

  
  function toggleTab() {
    console.log(firstname,lastname,email,password,confirmpassword)
      setTab3submitted(true);
      if (
        firstname == "" ||
        lastname == "" ||
        userEmail == "" ||
        password == "" ||
        confirmpassword == "" 
    
      ) {
        toast.error("Fill all the values");
        return false;
      }
      else{
        let data = {
          email: userEmail,
          name: firstname + " " + lastname,
          password: password
        };
        
        axios.post("/api/register", data)
          .then((res) => {
            console.log(res);
            if (res.success === 0) { // Assuming success status is checked in res.data
              setactiveTab(5);
              toast.success(res.message);
              setTimeout(() => {
                // Redirect to login page or perform any other action
                history("/login");
              }, 3000);
            } else {
              toast.error(res.message);
            }
          })
          .catch((error) => {
            toast.error(error.message);

            console.error("Error:", error);
            // Handle error, display error message, etc.
          });
        
      }
  }

  document.title = "Registration | Realx";

  return (
    <React.Fragment>
             <ToastContainer closeButton={false} limit={1} />
      <div className="auth-page-wrapper">
        <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
          <div className="bg-overlay"></div>
        </div>
        <div className="page-content pt-5">
          <Container>
            <Row>
              <Col lg={12}></Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-0">
                  <CardBody className="p-4">
                    <div className="text-center mt-sm-2 mb-2 text-white-50">
                      <div>
                        {/* <Link to="/" className="d-inline-block auth-logo">
                          <h>Realx</h>
                        </Link> */}
                      </div>
                    </div>

                    <Form action="#" className="form-steps">
                      {activeTab != 5 && (
                        <div className="progress-nav mb-4">
                          {/* <Progress
                          value={progressbarvalue}
                          style={{ height: "1px" }}
                        /> */}
                          {/* 
                        <Nav
                          className="nav-pills progress-bar-tab custom-nav"
                          role="tablist"
                        >
                          <NavItem>
                            <NavLink
                              to="#"
                              id="pills-gen-info-tab"
                              className={classnames(
                                {
                                  active: activeTab === 1,
                                  done: activeTab <= 6 && activeTab >= 0,
                                },
                                "rounded-pill"
                              )}
                              onClick={() => {
                                toggleTab(1, 0);
                              }}
                              tag="button"
                            >
                              1
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              to="#"
                              id="pills-gen-info-tab"
                              className={classnames(
                                {
                                  active: activeTab === 2,
                                  done: activeTab <= 6 && activeTab > 1,
                                },
                                "rounded-pill"
                              )}
                              onClick={() => {
                                toggleTab(2, 50);
                              }}
                              tag="button"
                            >
                              2
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              to="#"
                              id="pills-gen-info-tab"
                              className={classnames(
                                {
                                  active: activeTab === 3,
                                  done: activeTab <= 6 && activeTab > 2,
                                },
                                "rounded-pill"
                              )}
                              onClick={() => {
                                toggleTab(3, 75);
                              }}
                              tag="button"
                            >
                              3
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              to="#"
                              id="pills-gen-info-tab"
                              className={classnames(
                                {
                                  active: activeTab === 4,
                                  done: activeTab <= 6 && activeTab > 3,
                                },
                                "rounded-pill"
                              )}
                              onClick={() => {
                                toggleTab(4, 100);
                              }}
                              tag="button"
                            >
                              4
                            </NavLink>
                          </NavItem>
                        </Nav> */}
                        </div>
                      )}

                      <TabContent activeTab={activeTab}>
                        <TabPane tabId={1}>
                          <div>
                            <div className="mb-4">
                              <div className="text-center">
                                <h6 className="mb-2">
                                  {/* TELL US ABOUT YOUR BUSINESS */}
                                  Realx
                                </h6>
                                {/* <p className="text-muted">
                                  We'll use this information to personalise your
                                  quote and invoices.
                                </p> */}
                              </div>
                            </div>

                            <Row>
                              <Col lg={6}>
                                <div className="mb-2">
                                  <Label className="form-label" htmlFor="">
                                    Your First Name
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id=""
                                    placeholder="First Name"
                                    onChange={(e) => {
                                      setFirstName(e.target.value);
                                    }}
                                  />
                                  {tab1submitted && firstname == "" && (
                                    <label
                                      className="pt-1 text-danger"
                                      htmlFor=""
                                    >
                                      Enter First Name
                                    </label>
                                  )}
                                </div>
                              </Col>

                              <Col lg={6}>
                                <div className="mb-2">
                                  <Label className="form-label" htmlFor="">
                                    Your Last Name
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id=""
                                    placeholder="Last Name"
                                    onChange={(e) => {
                                      setLastName(e.target.value);
                                    }}
                                  />
                                  {tab1submitted && lastname == "" && (
                                    <label
                                      className="pt-1 text-danger"
                                      htmlFor=""
                                    >
                                      Enter Last Name
                                    </label>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                            <Col lg={6}>
                                <div className="mb-2">
                                  <Label className="form-label" htmlFor="">
                                    Enter Email Address
                                  </Label>
                                  <Input
                                    type="Email"
                                    className="form-control"
                                    id=""
                                    placeholder="email"
                                    onChange={(e) => {
                                      setUserEmail(e.target.value);
                                    }}
                                  />
                                 
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={6}>
                                <div className="mb-2">
                                  <Label className="form-label" htmlFor="">
                                    Enter Password
                                  </Label>
                                  <Input
                                    type="password"
                                    className="form-control"
                                    id=""
                                    placeholder="******"
                                    onChange={(e) => {
                                      setPassword(e.target.value);
                                    }}
                                  />
                                  {tab1submitted && password == "" && (
                                    <label
                                      className="pt-1 text-danger"
                                      htmlFor=""
                                    >
                                      Enter Password
                                    </label>
                                  )}
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-2">
                                  <Label className="form-label" htmlFor="">
                                    Confirm Password
                                  </Label>
                                  <Input
                                    type="password"
                                    className="form-control"
                                    id=""
                                    placeholder="Confirm Password"
                                    onBlur={() => handlePasswordBlur()}
                                    onChange={(e) =>
                                      setConfirmPassword(e.target.value)
                                    }
                                  />
                                  {tab1submitted && confirmpassword == "" && (
                                    <label
                                      className="pt-1 text-danger"
                                      htmlFor=""
                                    >
                                      Enter Confirm Password
                                    </label>
                                  )}
                                  {passmatch && (
                                    <label className="text-danger pt-2">
                                      {passmatch}
                                    </label>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                          {/* <div className="text-center  mt-0">
                            <button
                              type="button"
                              className="btn btn-brown ms-auto nexttab nexttab"
                              onClick={() => {
                                toggleTab(activeTab + 1, 50);
                              }}
                            >
                              Next
                            </button>
                          </div> */}
                          <div className=" text-center right ms-auto ">
                            <button
                              type="button"
                              className="btn btn-brown nexttab nexttab"
                              onClick={() => {
                                toggleTab();
                              }}
                            >
                              Register
                            </button>
                          </div>
                        </TabPane>

                        <TabPane tabId={5}>
                          <div>
                            <div className="text-center">
                              <div className="mb-4">
                                <lord-icon
                                  src="https://cdn.lordicon.com/lupuorrc.json"
                                  trigger="loop"
                                  colors="primary:#0ab39c,secondary:#6691e7"
                                  style={{ width: "120px", height: "120px" }}
                                ></lord-icon>
                              </div>
                              <h5>Well Done !</h5>
                              <p className="text-muted">
                                You have Successfully Signed Up
                              </p>
                            </div>
                          </div>
                        </TabPane>
                      </TabContent>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <ToastContainer closeButton={false} limit={1} />
          </Container>
        </div>
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <p className="mb-0 footer_copyright">
                    &copy; {new Date().getFullYear()} Onexfort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </React.Fragment>
  );
}

export default Register;
