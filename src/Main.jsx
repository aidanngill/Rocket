import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter, Switch, Route } from "react-router-dom";

import axios from "axios";
import store from "store";

import Config from "./Config";

import Header from "./Components/Header";

import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import Tools from "./Pages/Tools";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import Dashboard from "./Pages/User/Dashboard";

const Main = () => {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);

  if (store.get("user") !== undefined && Object.keys(user).length < 1) {
    let user = store.get("user");
    dispatch({ type: "auth/user", payload: user });

    axios.get(Config.apiUrl + "/user/info", {
      params: {
        apikey: user.apikey
      }
    })
    .then(resp => resp.data)
    .then(data => {
      store.set("user", data.user);
      dispatch({ type: "auth/user", payload: data.user });
    })
    .catch(function(error) {
      store.clearAll();
      dispatch({ type: "auth/user", payload: {} });
    });
  }

  return (
    <BrowserRouter>
      <Header/>
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/contact" component={Contact}></Route>
        <Route exact path="/tools" component={Tools}></Route>
        <Route exact path="/user/dashboard" component={Dashboard}></Route>
        <Route exact path="/auth/login" component={Login}></Route>
        <Route exact path="/auth/register" component={Register}></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Main;