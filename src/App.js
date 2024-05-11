import logo from './logo.svg';
import React from 'react';
import './App.css';
import './assets/scss/themes.scss';
import './assets/scss/custom.scss';
import Login from './pages/Authentication/Login';
import axios from 'axios';
import Register from './pages/Authentication/Register';
import Home from './pages/Home/Home';

//imoprt Route
import Route from './Routes';

//Axios base url
axios.defaults.baseURL="http://127.0.0.1:8000"

function App() {
  return (
    <React.Fragment>
      <Route />
    </React.Fragment>
  );
}

export default App;
