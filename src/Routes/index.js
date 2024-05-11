import React from 'react';
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from './AuthProtected';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Home from '../pages/Home/Home';
// import { Home } from 'feather-icons-react/build/IconComponents';
console.log(authProtectedRoutes,"authp")
// const isAuthProcted=JSON.parse(AuthProtected)
console.log(AuthProtected,"auth")



const Index = () => {
    return (
        <React.Fragment>
            <Routes>
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <NonAuthLayout>
                                    {route.component}
                                </NonAuthLayout>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                    {/* <Route
                    path={"/"}
                    element={
                        <div><Header/>
                        <Footer/></div>
                    }
                    /> */}
                </Route>

                <Route>
                    {authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <Home/>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                    {/* <Route
                    path={"/"}
                    element={
                        <Home/>
                    }
                    /> */}

                </Route>
            </Routes>
        </React.Fragment>
    );
};

export default Index;