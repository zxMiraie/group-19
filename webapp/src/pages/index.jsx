import React from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {List, ListItem} from "@mui/material";
import StockImage from "../images/home.png";

const Home = () => {
    return (
        <Container maxWidth="lg">
            <Box mt={10}>
                <Typography variant="h4" component="h2" align="center">
                    Reversible Computation Research Hub
                    <Box
                        component="img"
                        alt=""
                        src={StockImage}
                        sx={() => ({
                            flexGrow: "1",
                            flexBasis: "100%",
                            width: "50%",
                            marginTop: "2%",
                        })}
                    />
                </Typography>

                <Typography variant="h6" component="h2">
                    <p>
                    An interesting area of research is reversible computation, namely the ability to begin in a final
                    program state and execute in reverse, correctly restoring each intermediate program state. The
                    community of researchers in this field often collaborate, though without the use of any
                    centralised hub for information sharing.
                    </p>
                    <p>
                    The aim of this project is to develop a web application that can be the home of reversible
                    computation research. This should allow people to share resources and updates, list the latest
                    publications in this field, as well as upcoming events.
                    The website should also contain a reversible execution simulator, a tool that an interested
                    visitor can use to visualise reversible execution.
                    </p>
                    <List
                        sx = {{
                            listStyleType: 'disc',
                            pl: 2,
                            '& .MuiListItem-root': {
                                display: 'list-item',
                            },
                        }}>
                        <ListItem>
                            Uploading and simulation of a simple program written in pseudo-code (small and simple programming language initially), in both forward and reverse direction. An approach to reversible computation will be provided and explained.
                        </ListItem>
                        <ListItem>
                            Automatic and embedded publication searching for keywords – including suggested extra reading
                        </ListItem>
                        <ListItem>
                            Collaborators can share information about events, publications or general updates
                        </ListItem>
                    </List>
                </Typography>
            </Box>
        </Container>


        );
};

export default Home;