import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner, ToastBody } from 'reactstrap';
// import { Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios';
import Toast from 'reactstrap';
import { useLocation,useNavigate,Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import myImage from"../../assets/images/IMG_0597 (1).jpg"
import { add_cookie, get_cookie } from "../../helpers/get_cookie";


// import * as Yup from "yup";
// import { useFormik } from "formik";
// //redux
// import withRouter from "../../Components/Common/withRouter";

// import { useSelector, useDispatch } from "react-redux";


import './index.css'    
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const history = useNavigate();

    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [password, setPassword] = useState('')
    const [showSubmitError, setShowSubmitError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    Cookies.set('authUser', "", {
      expires: 30,
    })
  
    const onSubmitSuccess = jwtToken => {
      Cookies.set('authUser', jwtToken, {
        expires: 30,
      })
      history('/home')
    }
  
    const onSubmitFailure = errorMsg => {
      setShowSubmitError(true)
      setErrorMsg(errorMsg)
    }
  
    const submitForm = async event => {
      event.preventDefault()
      var postData={
        "name":firstname+ " "+lastname,
        "email":username,
        "password":password
        
      }
      axios.post("/api/login", postData).then((res)=>{
        console.log(res,"data");
        if(res.success==0){
          const obj={
            success:true,
            data:{
              first_name:firstname,
              last_name:lastname,
              token:res.token,
            
            },
            token:res.token,
            remember:false,
            email:username,
            company_name:"Realx"
          }
        sessionStorage.setItem("authUser", JSON.stringify(obj));
        add_cookie(obj, false);
        const redirectUrl = localStorage.getItem("expiredSessionRedirectUrl");
        console.log(redirectUrl)
        if (redirectUrl) {
          history("/home");
        }
        else {
          history('/home');
        }
        // const authorizedUser=JSON.parse(obj);

        //   onSubmitSuccess(authorizedUser)
        }
        else{
          onSubmitFailure(res.message)
        }
        // if(res.status == 1){
        //   toast.success(res.message);
        //   onChangeData();
        // }
      })
      // const userDetails = { email:username, password }
      // const url = 'api/login'
      // const options = {
      //   method: 'POST',
      //   body: JSON.stringify(userDetails),
      // }
      // const response = await fetch(url, options)
      // const data = await response.json()
      // if (response.ok === true) {
      //   console.l
      //   // onSubmitSuccess(data.jwt_token) 
      // } else {
      //   // onSubmitFailure(data.error_msg)
      // }
    }
  
    const renderPasswordField = () => {
      return (
        <>
          <label className="input-label" htmlFor="password">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            className="password-input-field"
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="Password"
          />
        </>
      )
    }

      const renderflnameField = () => {
        return (
          <>
             <ToastContainer closeButton={false} limit={1} />
  
            <label className="input-label" htmlFor="firstname">
              FIRST NAME
            </label>
            <input
              type="text"
              id="firstname"
              className="username-input-field"
              value={username}
              onChange={event => setFirstname(event.target.value)}
              placeholder="Firstname"
            />
            <label className="input-label" htmlFor="lastname">
              LAST NAME
            </label>
            <input
              type="text"
              id="lastname"
              className="username-input-field"
              value={username}
              onChange={event => setLastname(event.target.value)}
              placeholder="Lastname"
            />
          </>

        )
      }
    
  
    const renderUsernameField = () => {
      return (
        <>
           <ToastContainer closeButton={false} limit={1} />

          <label className="input-label" htmlFor="username">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="username-input-field"
            value={username}
            onChange={event => setUsername(event.target.value)}
            placeholder="Username"
          />
        </>
      )
    }
  
    const jwtToken = Cookies.get('authUser')
  
    // if (jwtToken !== undefined) {
    //   return <Redirect to="/" />
    // }
  
    return (
      <div className="login-form-container">
        {/* <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        /> */}
        <img
          src={myImage}
          className="login-img"
          alt="website login"
        />
        <form className="form-container" onSubmit={submitForm}>
          {/* <h1>Real x </h1> */}
          <div className="input-container">{renderflnameField()}</div>
          <div className="input-container">{renderUsernameField()}</div>
          <div className="input-container">{renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
  
  export default Login