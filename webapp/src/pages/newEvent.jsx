import * as React from 'react';
import {Button, Typography, TextField,} from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {useEffect, useRef, useState} from "react";
import {v4} from "uuid";
import { getDatabase, set } from "firebase/database";
import { ref as dbref } from "firebase/database";
import {lookUpAction} from "../store/actions/authActions";
import {useDispatch} from "react-redux";
import useSnackbar from '../utils/snackbarUtils';
import {useNavigate} from "react-router-dom";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Snackbar from "@mui/material/Snackbar";

function NewEvent() {
    const idToken = sessionStorage.getItem("idToken");
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const titleRef = useRef('');
    const descRef = useRef('');
    const locRef = useRef('');

    const [startDate, setStartDate] = React.useState(dayjs('2023-01-01T12:00'));
    const [endDate, setEndDate] = React.useState(dayjs('2023-01-01T12:00'));

    const [isClicked, setIsClicked] = useState(false);

    const navigate = useNavigate();

    const {
        openSnackbar,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
        Alert,
        showSnackbar
    } = useSnackbar();

    useEffect(() => {
        dispatch(lookUpAction(idToken))
            .then((email) => {
                setEmail(email);
            })
            .catch((error) => {
                console.error("Error getting email:", error);
            });
    }, [])

    const submitValues = () => {
        if (titleRef.current.value !== '' && descRef.current.value !== '' && locRef.current.value !== '' && !isClicked) {
            setIsClicked(true);
            const db = getDatabase();
            let eventid = v4();
            set(dbref(db, 'Events/' + eventid), {
                "title": titleRef.current.value,
                "description": descRef.current.value,
                "startTime": startDate.toJSON(),
                "endTime": endDate.toJSON(),
                "location": locRef.current.value,
                "account": email
            })
              .then(() => {
                  showSnackbar("Event created. Redirecting...", "success");
                  setTimeout(() => {
                      navigate("/events")
                  }, 750);
              })
              .catch(() => {
                  showSnackbar("Could not create event. Please try again later", "error");
                  setIsClicked(false);
              });
        }
        else {
            showSnackbar("Please fill all fields", "error");
        }
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <>
        <Container maxWidth="lg">
            <Box mt={10}>
                <Typography variant="h4" component="h2" align="center">
                    Create new Event
                </Typography>
                <br/>
                <TextField
                    fullWidth
                    label="Title"
                    id="fullWidth"
                    inputProps={{maxLength: 100}}
                    inputRef={titleRef}
                    required
                    /><br/>
                <br/>
                <TextField
                    fullWidth
                    multiline
                    label="Description"
                    id="fullWidth"
                    inputRef={descRef}
                    inputProps={{maxLength: 5000}}
                    required
                    /><br/>
                <br/>
                <DateTimePicker
                  label="Start"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                /><br/>
                <br/>
                <DateTimePicker
                  label="End"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                /><br/>
                <br/>
                <TextField
                    fullWidth
                    multiline
                    label="Location"
                    id="fullWidth"
                    inputRef={locRef}
                    inputProps={{maxLength: 500}}
                    required
                /><br/>
                <br/>

            </Box>
            <br/>

            <Button
                size="large"
                onClick={submitValues}
                fullWidth={true}
                style={{ width: "200px", float: "left", marginTop: 5 }}
                variant="contained"
                disabled={isClicked}
            >
                Create Event
            </Button>

        </Container>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
      </LocalizationProvider>
    );
}

export default NewEvent;