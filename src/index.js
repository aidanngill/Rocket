import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux"
import { ToastProvider } from 'react-toast-notifications';

import Main from "./Main";
import { store } from "./Store"

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <ToastProvider
      placement="top-center"
      autoDismissTimeout={7500}
      autoDismiss={true}
    >
      <Main />
    </ToastProvider>
  </Provider>,
  document.getElementById("root")
);