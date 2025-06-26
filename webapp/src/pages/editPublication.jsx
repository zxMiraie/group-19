import * as React from 'react';
import {Button, Typography, TextField} from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {useRef, useState} from "react";
import { getDatabase, update, ref as dbref } from "firebase/database";
import {useLocation, useNavigate} from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "../utils/snackbarUtils";

function EditPublication() {

    const titleRef = useRef('');
    const descRef = useRef('');

    const location = useLocation();
    const navigate = useNavigate();

    const [isClicked, setIsClicked] = useState(false);

    const {
        openSnackbar,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
        Alert,
        showSnackbar
    } = useSnackbar();

    const updatePost = () => {
        if (titleRef.current.value !== '' && descRef.current.value !== '' && !isClicked) {
            setIsClicked(true);
            const db = getDatabase();
            update(dbref(db, 'Publications/' + location.state.id), {
                "title": titleRef.current.value,
                "description": descRef.current.value,
            })
                .then(() => {
                    showSnackbar("Post updated. Redirecting...", "success");
                    setTimeout(() => {
                        navigate("/publications")
                    }, 750);
                })
                .catch(() => {
                    showSnackbar("Error updating, please try again", "error");
                    setIsClicked(false);
                });
        }
        else {
            showSnackbar("Please fill all fields", "error");
        }
    };

    return (
        <Container maxWidth="lg">
            <Box mt={10}>
                <Typography variant="h4" component="h2" align="center">
                    Edit Publication
                </Typography>
                <br/>
                <TextField
                    fullWidth
                    label="Title"
                    defaultValue={location.state.title}
                    id="fullWidth"
                    inputProps={{maxLength: 100}}
                    inputRef={titleRef}
                /><br/>
                <br/>
                <TextField
                    fullWidth
                    multiline
                    label="Description"
                    defaultValue={location.state.description}
                    id="fullWidth"
                    inputRef={descRef}
                    inputProps={{maxLength: 5000}}
                /><br/>
                <br/>
            </Box>
            <br/>

            <Button
                size="large"
                onClick={updatePost}
                fullWidth={true}
                style={{ width: "250px", float: "left", marginTop: 5 }}
                variant="contained"
                disabled={isClicked}
            >
                Update publication
            </Button>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default EditPublication;
