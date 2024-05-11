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
import Header from "../../common/Header";
import Footer from '../../common/Footer';



const Home = () => {
    //   const history = useNavigate();
      return (
        <div>
            <Header/>
            <Footer/>
        </div>
      );
    };
    
    export default Home;