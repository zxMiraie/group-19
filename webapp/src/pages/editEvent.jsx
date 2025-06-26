import * as React from 'react';
import {Button, Typography, TextField} from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {useRef, useState} from "react";
import { getDatabase, update, ref as dbref } from "firebase/database";
import {useLocation, useNavigate} from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import useSnackbar from "../utils/snackbarUtils";

function EditEvent() {

    const titleRef = useRef('');
    const descRef = useRef('');
    const locRef = useRef('');

    const location = useLocation();
    const navigate = useNavigate();

    const {
        openSnackbar,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
        Alert,
        showSnackbar
    } = useSnackbar();

    const [startDate, setStartDate] = React.useState(dayjs(location.state.startTime));
    const [endDate, setEndDate] = React.useState(dayjs(location.state.endTime));

    const [isClicked, setIsClicked] = useState(false);

    const updateEvent = () => {
        if (titleRef.current.value !== '' && descRef.current.value !== '' && locRef.current.value !== '' && !isClicked) {
            setIsClicked(true);
            const db = getDatabase();
            update(dbref(db, 'Events/' + location.state.id), {
                "title": titleRef.current.value,
                "description": descRef.current.value,
                "startTime": startDate.toJSON(),
                "endTime": endDate.toJSON(),
                "location": locRef.current.value
            })
                .then(() => {
                    showSnackbar("Event updated. Redirecting...", "success");
                    setTimeout(() => {
                    navigate("/events")
                    }, 750);
                })
                .catch(() => {
                    showSnackbar("Error updating event. Please try again later", "error");
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
                Edit Event
              </Typography>
              <br/>
              <TextField
                fullWidth
                label="Title"
                defaultValue={location.state.title}
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
                defaultValue={location.state.description}
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
                defaultValue={location.state.location}
                inputRef={locRef}
                inputProps={{maxLength: 500}}
                required
              /><br/>
              <br/>

            </Box>
            <br/>

            <Button
              size="large"
              fullWidth={true}
              onClick={updateEvent}
              style={{ width: "200px", float: "left", marginTop: 5 }}
              variant="contained"
              disabled={isClicked}
            >
              Edit Event
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

export default EditEvent;