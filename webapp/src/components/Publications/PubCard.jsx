import * as React from 'react';
import {Box, Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {storage} from "../../firebase";
import {useDispatch} from "react-redux";
import {lookUpAction} from "../../store/actions/authActions";
import {getDatabase, remove, ref as dbref} from "firebase/database";
import {useNavigate} from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "../../utils/snackbarUtils";

function PubCard({publication}) {
  const idToken = sessionStorage.getItem("idToken");
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const [isClicked, setIsClicked] = useState(false);

  const [url, seturl] = useState(null);

  const db = getDatabase();

  getDownloadURL(ref(storage, "Publications/" + publication.filename)).then((url) => {
    seturl(url);
  });

  const navigate = useNavigate();

    const {
        openSnackbar,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
        Alert,
        showSnackbar
    } = useSnackbar();

  const deletePub = () => {
    setIsClicked(true);
    remove(dbref(db, "Publications/" + publication.id))
      .then(() => {
        showSnackbar("Post deleted. Refreshing...", "success");
        setTimeout(() => {
          window.location.reload()
        }, 750);
      })
      .catch(() => {
        showSnackbar("An error has occurred. Please try again later", "error");
        setIsClicked(false);
      });
  }

  const editPub = () => {
    navigate('/editPublication', {state:publication});
  }

  function CardActions() {
    dispatch(lookUpAction(idToken))
      .then((email) => {
        setEmail(email);
      })
      .catch((error) => {
        console.error("Error getting email:", error);
      });

    if (email === publication.account && publication.account !== "") {
      return (
        <Box>
        <Button
          size="medium"
          variant="contained"
          onClick={editPub}
        >Edit Publication</Button>
        <Button
          size="medium"
          variant="contained"
          color="error"
          onClick={deletePub}
          style={{ float: "right" }}
          disabled={isClicked}
        >Delete Publication</Button>
        </Box>
      )
    }
  }

  return (
      <>
        <Card sx={{ minWidth: 275, marginBottom:6 }}>
          <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Publication
        </Typography>
        <Typography variant="h5" component="div">
          {publication.title}
        </Typography>
        <Typography variant="body2">
          <Box mt={3}>
            {publication.account}
          </Box>
        </Typography>
        <Box mt={3} align>
          <embed src={url} width="100%" height="500"></embed>
        </Box>
        <Typography variant="body2">
          <Box mt={3}>
            {publication.description}
          </Box>
        </Typography>
        <CardActions />
        </CardContent>
      {/*<CardActions>*/}
      {/*  <Button size="small">Go to post</Button>*/}
      {/*</CardActions>*/}
    </Card>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </>
  );
}

export default PubCard;