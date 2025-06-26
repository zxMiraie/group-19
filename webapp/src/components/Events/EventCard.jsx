import * as React from 'react';
import {Box, Button, Card, CardActions, CardContent, Grid, MenuItem, Typography} from "@mui/material";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {lookUpAction} from "../../store/actions/authActions";
import {getDatabase, remove, ref as dbref} from "firebase/database";
import {useNavigate} from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import useSnackbar from "../../utils/snackbarUtils";
import Menu from "@mui/material/Menu";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);


function EventCard({event}) {
  const idToken = sessionStorage.getItem("idToken");
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const [isClicked, setIsClicked] = useState(false);

  const db = getDatabase();

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isExportMenuOpen = Boolean(anchorEl);

  const handleExportMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAppleExport = () => {
    console.log("Export to Apple Calendar format");

    const startDate = dayjs(event.startTime).utc().format("YYYYMMDDTHHmmss") + "Z";
    const endDate = dayjs(event.endTime).utc().format("YYYYMMDDTHHmmss") + "Z";
    const eventTitle = event.title;
    const eventLocation = event.location;
    const eventDescription = event.description;
    const uid = event.id;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `SUMMARY:${eventTitle}`,
      `LOCATION:${eventLocation}`,
      `DESCRIPTION:${eventDescription}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${eventTitle}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOutlookExport = () => {
    console.log("Export to Outlook Calendar format");
    const startDate = dayjs(event.startTime).utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    const endDate = dayjs(event.endTime).utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    const eventTitle = encodeURIComponent(event.title);
    const eventLocation = encodeURIComponent(event.location);
    const eventDescription = encodeURIComponent(event.description);
    const href = `https://outlook.office.com/calendar/0/deeplink/compose?allday=false&body=${eventDescription}&enddt=${endDate}&location=${eventLocation}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=${startDate}&subject=${eventTitle}`;
    window.open(href);
  };

  const handleGoogleExport = () => {
    console.log("Export to Google Calendar format");
    const startDate = dayjs(event.startTime).utc().format("YYYYMMDDTHHmmss") + "Z";
    const endDate = dayjs(event.endTime).utc().format("YYYYMMDDTHHmmss") + "Z";
    const eventTitle = encodeURIComponent(event.title);
    const eventLocation = encodeURIComponent(event.location);
    const eventDescription = encodeURIComponent(event.description);
    const href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDescription}&location=${eventLocation}&dates=${startDate}/${endDate}`;
    window.open(href);
  };

  const {
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    Alert,
    showSnackbar
  } = useSnackbar();

  const deleteEvent = () => {
    setIsClicked(true);
    remove(dbref(db, "Events/" + event.id))
      .then(() => {
        showSnackbar("Post deleted. Refreshing...", "success");
        setTimeout(() => {
          window.location.reload()
        }, 750);
      })
      .catch(() => {
        showSnackbar("Could not delete event. Please try again later", "error");
        setIsClicked(false);
      });
  }

  const editEvent = () => {
    navigate('/editEvent', {state:event});
  }

  function CardActions() {
    dispatch(lookUpAction(idToken))
      .then((email) => {
        setEmail(email);
      })
      .catch((error) => {
        console.error("Error getting email:", error);
      });

    if (email === event.account && event.account !== "") {
      return (
          <Grid container justifyContent="space-between" width="100%">
            <Grid item flexGrow={1}>
              <Button size="medium" variant="contained" onClick={editEvent}>
                Edit Event
              </Button>
            </Grid>
            <Grid item>
              <Button
                  size="medium"
                  variant="contained"
                  color="error"
                  onClick={deleteEvent}
                  disabled={isClicked}
                  sx={{ marginRight: '16px' }}
              >
                Delete Event
              </Button>
            </Grid>
          </Grid>
      );
    }
  }

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <>
          <Card sx={{ minWidth: 275, marginBottom: 6 }}>
            <Grid container alignItems="flex-start" justifyContent="space-between">
              <Grid item>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Event
                  </Typography>
                  <Typography variant="h5" component="div">
                    {event.title}
                  </Typography>
                  <Typography variant="body2">
                    <Box mt={3}>
                      {event.account}
                    </Box>
                  </Typography>
                  <Typography variant="body2">
                    <Box mt={3}>
                      {event.description}
                    </Box>
                  </Typography>
                  <Typography variant="body2">
                    <Box mt={3}>
                      Starts: {dayjs(event.startTime).toString()}
                    </Box>
                  </Typography>
                  <Typography variant="body2">
                    <Box mt={3}>
                      Ends: {dayjs(event.endTime).toString()}
                    </Box>
                  </Typography>
                  <Typography variant="body2">
                    <Box mt={3}>
                      Location: {event.location}
                    </Box>
                  </Typography>
                  <CardActions />
                </CardContent>
              </Grid>
              <Grid item>
                <Box mt={2} mr={2}>
                  <Button
                      size="medium"
                      variant="contained"
                      onClick={handleExportMenuClick}
                  >
                    Export
                  </Button>
                  <Menu
                      anchorEl={anchorEl}
                      open={isExportMenuOpen}
                      onClose={handleExportMenuClose}
                      onClick={handleExportMenuClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                  >
                    <MenuItem onClick={handleAppleExport}>
                      Apple Calendar (ICS)
                    </MenuItem>
                    <MenuItem onClick={handleGoogleExport}>
                      Google Calendar
                    </MenuItem>
                    <MenuItem onClick={handleOutlookExport}>
                      Outlook Calendar
                    </MenuItem>
                  </Menu>
                </Box>
              </Grid>
            </Grid>
          </Card>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      </LocalizationProvider>
  );
}

export default EventCard;