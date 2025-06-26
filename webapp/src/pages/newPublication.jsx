import * as React from 'react';
import {Button,Typography, TextField,} from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {useEffect, useRef, useState} from "react";
import {getDownloadURL, listAll, ref, uploadBytes} from "firebase/storage";
import {storage} from "../firebase";
import {v4} from "uuid";
import { getDatabase, set } from "firebase/database";
import { ref as dbref } from "firebase/database";
import {lookUpAction} from "../store/actions/authActions";
import {useDispatch} from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import {useNavigate} from "react-router-dom";
import useSnackbar from "../utils/snackbarUtils";

function NewPublication() {

    const [fileUpload, setFileUpload] = useState(null);
    const [setFileList] = useState([]);

    const idToken = sessionStorage.getItem("idToken");
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const titleRef = useRef('');
    const descRef = useRef('');

    const [isClicked, setIsClicked] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const fileListRef = ref(storage, "Publications/");

    const navigate = useNavigate();

    const {
        openSnackbar,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
        Alert,
        showSnackbar
    } = useSnackbar();

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragOver(false);
    };


    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);

        const file = event.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            setFileUpload(file);
        } else {
            showSnackbar("Please upload a PDF file", "error");
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setFileUpload(file);
        } else {
            showSnackbar("Please upload a PDF file", "error");
        }
    };

    const uploadFile = () => {
        if (titleRef.current.value !== '' && descRef.current.value !== '' && !isClicked) {
            if (fileUpload == null) {
                showSnackbar("Please fill all fields", "error");
                return;
            }
            setIsClicked(true);
            const fileName = `${fileUpload.name + v4()}`;
            const fileRef = ref(storage, 'Publications/' + fileName);
            uploadBytes(fileRef, fileUpload).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    setFileList((prev) => [...prev, url]);
                });
            });
            submitValues(fileName);
            showSnackbar("Publication posted. Redirecting", "success");
            setTimeout(() => {
                navigate("/publications")
            }, 750);
        }
        else {
            showSnackbar("Please fill all fields", "error");
        }
    };

    useEffect(() => {
        const handleGlobalDragEnter = (event) => {
            event.preventDefault();
            setIsDragOver(true);
        };

        const handleGlobalDragLeave = (event) => {
            event.preventDefault();
            setIsDragOver(false);
        };

        const handleGlobalDrop = (event) => {
            event.preventDefault();
            setIsDragOver(false);
        };

        document.addEventListener("dragenter", handleGlobalDragEnter);
        document.addEventListener("dragleave", handleGlobalDragLeave);
        document.addEventListener("drop", handleGlobalDrop);

        return () => {
            document.removeEventListener("dragenter", handleGlobalDragEnter);
            document.removeEventListener("dragleave", handleGlobalDragLeave);
            document.removeEventListener("drop", handleGlobalDrop);
        };
    }, []);

    useEffect(() => {
        dispatch(lookUpAction(idToken))
          .then((email) => {
              setEmail(email);
          })
          .catch((error) => {
              console.error("Error getting email:", error);
          });

        listAll(fileListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setFileList((prev) => [...prev, url]);
                });
            });
        });
    }, [])

    const submitValues = (fileName) => {
        const db = getDatabase();
        let pubid = v4();
        set(dbref(db, 'Publications/' + pubid), {
            "title": titleRef.current.value,
            "description": descRef.current.value,
            "filename": fileName,
            "account": email
        })
    };

    return (
        <>
        <Container maxWidth="lg">
            <Box mt={10}>
                <Typography variant="h4" component="h2" align="center">
                    Create new publication
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
                <br/>
                <Button
                    fullWidth
                    variant={isDragOver ? "outlined" : "contained"}
                    color="primary"
                    component="label"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                    />
                    {fileUpload ? `Selected: ${fileUpload.name}` :
                        isDragOver ? "Drop your PDF here" : "Choose a PDF file or drag it here"}
                </Button>
            </Box>
            <br/>

            <Button
                size="large"
                onClick={uploadFile}
                fullWidth={true}
                style={{ width: "200px", float: "left", marginTop: 5 }}
                variant="contained"
                disabled={isClicked}
            >
                Post publication
            </Button>

        </Container>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default NewPublication;