import {Box, Button, Container, InputAdornment, TextField, Grid, Typography, CircularProgress} from "@mui/material";
import * as React from "react";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {getDatabase, ref, child, get, } from "firebase/database";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import {ContainerProvider} from "./Container/Container";
import EventCard from "../components/Events/EventCard";

function Events() {
    const navigate = useNavigate();

    const isAuthenticated = useAuth();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const getSnapshot = () => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, "Events"))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const events = snapshot.val();
                    const eventArray = Object.keys(events).map((key) => {
                        return { id: key, ...events[key] };
                    });
                    setPosts(eventArray);
                } else {
                    console.log("No data available");
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        getSnapshot();
    }, []);

    const displayEvents = () => {
        const filteredEvents = posts.filter((element) => {
            return element.title.toLowerCase().includes(searchTerm.toLowerCase());
        });

        if (filteredEvents.length === 0) {
            return <Typography variant="h6" align="center">No events found</Typography>;
        }

        return (
            <>
                {filteredEvents.map((element) => {
                    return <EventCard key={element.id} event={element}></EventCard>;
                })}
            </>
        );
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    function handleCreateEventsRedirect() {
        navigate('/newEvent');
    }

    return (
        <div id="parent">
            <ContainerProvider
                maxWidth="xl"
                sx={{
                    padding: "1rem",
                }}
            >
                <Typography variant="h4" component="h2" align="center">
                    Events
                </Typography>
            </ContainerProvider>

            <Container maxWidth="lg">
                <Box mt={5}>
                    {loading ? (
                        <Grid container justifyContent="center">
                            <CircularProgress />
                        </Grid>
                    ) : (
                        <>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Search"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={handleSearch}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} container justify="flex-end">
                            {isAuthenticated ? (
                                <Button variant="contained" fullWidth style={{minHeight: '52px', maxHeight: '52px'}} onClick={handleCreateEventsRedirect}>
                                    Create Event
                                </Button>
                            ) : (
                                <Button variant="contained" disabled fullWidth>
                                    Login to create Event
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                    {displayEvents()}
                        </>
                    )}
                </Box>
            </Container>
        </div>
    );
}

export default Events;
