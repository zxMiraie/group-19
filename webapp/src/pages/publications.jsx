import PubCard from "../components/Publications/PubCard";
import {Box, Button, Container, InputAdornment, TextField, Grid, Typography, CircularProgress} from "@mui/material";
import * as React from "react";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {getDatabase, ref, child, get, } from "firebase/database";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import {ContainerProvider} from "./Container/Container";

function Publications() {
    const navigate = useNavigate();

    const isAuthenticated = useAuth();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');


    const getSnapshot = () => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, "Publications"))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const pubs = snapshot.val();
                    const pubArray = Object.keys(pubs).map((key) => {
                        return { id: key, ...pubs[key] };
                    });
                    setPosts(pubArray);
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

    const displayPubs = () => {
        const filteredPubs = posts.filter((element) => {
            return element.title.toLowerCase().includes(searchTerm.toLowerCase());
        });

        if (filteredPubs.length === 0) {
            return <Typography variant="h6" align="center">No publications found.</Typography>;
        }

        return (
            <>
                {filteredPubs.map((element) => {
                    return <PubCard key={element.id} publication={element}></PubCard>;
                })}
            </>
        );
    };


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    function handleCreatePostRedirect() {
        navigate('/newPublication');
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
                    Publications
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
                                <Button variant="contained" fullWidth style={{minHeight: '52px', maxHeight: '52px'}} onClick={handleCreatePostRedirect}>
                                    Create Publication
                                </Button>
                            ) : (
                                <Button variant="contained" disabled fullWidth>
                                    Login to create publication
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                    {displayPubs()}
                        </>
                    )}
                </Box>
            </Container>
        </div>
    );
}

export default Publications;