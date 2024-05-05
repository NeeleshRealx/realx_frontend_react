import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { get_cookie } from "../helpers/get_cookie";
const Footer = () => {
    const companyName = JSON.parse(get_cookie("authUser")).company_name;
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid>
                    <div className='text-center'>
                        {new Date().getFullYear()} ©  {companyName}

                    </div>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;