import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner, ToastBody } from 'reactstrap';
// import { Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios';
import Toast from 'reactstrap';
import { useLocation,useNavigate,Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";

// import * as Yup from "yup";
// import { useFormik } from "formik";
// //redux
// import withRouter from "../../Components/Common/withRouter";

// import { useSelector, useDispatch } from "react-redux";


import './index.css'    
import { ToastContainer } from 'react-toastify';

const Login = ({ history }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showSubmitError, setShowSubmitError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
  
    const onSubmitSuccess = jwtToken => {
      Cookies.set('jwt_token', jwtToken, {
        expires: 30,
      })
      history.replace('/')
    }
  
    const onSubmitFailure = errorMsg => {
      setShowSubmitError(true)
      setErrorMsg(errorMsg)
    }
  
    const submitForm = async event => {
      event.preventDefault()
      var postData={
        "name":"dsdsds",
        "email":username,
        "password":password
      }
      axios.post("/api/login", postData).then((res)=>{
        console.log(res,"data");
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
  
    const renderUsernameField = () => {
      return (
        <>
        <ToastContainer>
          <ToastBody></ToastBody>
        </ToastContainer>
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
  
    const jwtToken = Cookies.get('jwt_token')
  
    // if (jwtToken !== undefined) {
    //   return <Redirect to="/" />
    // }
  
    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-img"
          alt="website login"
        />
        <form className="form-container" onSubmit={submitForm}>
          <h1>Real x </h1>
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