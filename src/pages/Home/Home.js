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

import classnames from "classnames";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// register lottie and define custom element



const Home = () => {
    //   const history = useNavigate();
      return (
        <h1>Home</h1>
      );
    };
    
    export default Home;