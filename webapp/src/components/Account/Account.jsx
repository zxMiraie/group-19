import React, { useState, useEffect } from "react";
import { ContainerProvider } from "../../pages/Container/Container";
import { Typography, CircularProgress, Box, Grid } from "@mui/material";
import { lookUpAction } from "../../store/actions/authActions";
import { useDispatch } from "react-redux";
import PubCard from "../Publications/PubCard";
import { getDatabase, ref, child, get } from "firebase/database";
import EventCard from "../Events/EventCard";

export const Account = () => {
    const idToken = sessionStorage.getItem("idToken");
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [events, setEvents] = useState([]);
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUserPublications = (userEmail) => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, "Publications"))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const pubs = snapshot.val();

                    const userPubs = Object.keys(pubs)
                        .map((key) => {
                            return { id: key, ...pubs[key] };
                        })
                        .filter((pub) => pub.account === userEmail);
                    setPublications(userPubs);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const getUserEvents = (userEmail) => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, "Events"))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const evts = snapshot.val();

                    const userEvts = Object.keys(evts)
                        .map((key) => {
                            return { id: key, ...evts[key] };
                        })
                        .filter((evt) => evt.account === userEmail);
                    setEvents(userEvts);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const displayUserPublications = () => {
        if (publications.length === 0) {
            return (
                <Grid item xs={12}>
                    <Typography variant="body1" sx={{ paddingLeft: "8px", lineHeight: "2" }}>
                        You have not created any publications yet.
                    </Typography>
                </Grid>
            );
        }
        return (
            <>
                {publications.map((publication) => (
                    <Grid item xs={12} key={publication.id}>
                        <PubCard publication={publication} />
                    </Grid>
                ))}
            </>
        );
    };

    const displayUserEvents = () => {
        if (events.length === 0) {
            return (
                <Grid item xs={12}>
                    <Typography variant="body1" sx={{ paddingLeft: "8px", lineHeight: "2" }}>
                        You have not created any events yet.
                    </Typography>
                </Grid>
            );
        }
        return (
            <>
                {events.map((event) => (
                    <Grid item xs={12} key={event.id}>
                        <EventCard event={event} />
                    </Grid>
                ))}
            </>
        );
    };

    useEffect(() => {
        dispatch(lookUpAction(idToken))
            .then((email) => {
                setEmail(email);
                getUserPublications(email);
                getUserEvents(email);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error getting email:", error);
                setLoading(false);
            });
    }, []);

    return (
        <ContainerProvider
            maxWidth="xl"
            sx={{
                padding: "1rem",
            }}
        >
            <Typography variant="h4" component="h2" align="center" mb={2}>
                Account
            </Typography>
            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100px",
                    }}
                >
                    <CircularProgress />
                    <Typography mt={2}>Fetching user</Typography>
                </Box>
            ) : (
                <>
                    <Typography
                        variant="h6"
                        component="h3"
                        align="center"
                        fontWeight="bold"
                        color="primary"
                        mb={4}>
                        {email}</Typography>
                    <Grid container spacing={2} mt={4} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" component="h3">
                                Your Publications:
                            </Typography>
                            <Grid container spacing={2}>
                                {displayUserPublications()}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" component="h3">
                                Your Events:
                            </Typography>
                            <Grid container spacing={2}>
                                {displayUserEvents()}
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            )}
        </ContainerProvider>
    );

};