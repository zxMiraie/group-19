import React from 'react';
import './index.css';
import ReactDOM from "react-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createTheme, ThemeProvider} from "@mui/material";
import { Provider } from "react-redux";
import store from "./store";


const theme = createTheme({
  palette: {
    primary: {
      main: "#243249",
      error: "#ff5a5a"
    }
  }
});

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <ThemeProvider theme={theme}>
            <App />
            </ThemeProvider>
        </React.StrictMode>
    </Provider>,
    document.getElementById("root")
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
