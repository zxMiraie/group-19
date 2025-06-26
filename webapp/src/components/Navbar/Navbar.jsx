import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const navForUnAuthenticated = [
    { title: "Sign up", page: "/sign-up" },
    { title: "Sign in", page: "/sign-in" },
];

const navForAuthenticated = [
    { title: "Account", page: "/account" },
    { title: "Log out" , page: "/sign-out"}
];

const alwaysNav = [
    { title: "Publications", page: "/publications" },
    { title: "Events", page: "/events" },
    { title: "Simulator", page: "/simulator/edit" }
];

export const Navbar = () => {

    const isAuthenticated = useAuth();

    const location = useLocation();

    console.log("location", location);

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const showAuthenticatedNav = () => {
        return navForAuthenticated.map(({ title, page }) => (
            <Link to={page} style={{ textDecoration: "none" }}>
                <Button
                    key={title}
                    sx={{ my: 2, color: "white", backgroundColor: "primary", display: "block" }}
                >
                    {title}
                </Button>
            </Link>
        ));
    };

    const showUnAuthenticatedNav = () => {
        return navForUnAuthenticated.map(({ title, page }) => (
            <Link to={page} style={{ textDecoration: "none" }}>
                <Button
                    key={title}
                    sx={{ my: 2, color: "white", backgroundColor: "primary", display: "block" }}
                >
                    {title}
                </Button>
            </Link>
        ));
    };

    const showAlwaysNav = () => {
        return alwaysNav.map(({ title, page}) => (
            <Link to={page} style={{ textDecoration: "none" }}>
                <Button
                    key={title}
                    sx={{ my: 2, color: "white", backgroundColor: "primary", display: "block" }}
                >
                    {title}
                </Button>
            </Link>
        ))
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={drawerOpen}
                            onClose={toggleDrawer(false)}
                            sx={{
                                display: { xs: 'block', md: 'none'  },
                                backgroundColor: "primary",
                                color: "#243249",
                            }}
                        >
                            <List style={{ backgroundColor: "#243249" }}>
                                {showAlwaysNav().map((navItem, index) => (
                                    <ListItem key={index} style={{ backgroundColor: "#243249" }}>
                                        {navItem}
                                    </ListItem>
                                ))}
                                {isAuthenticated
                                    ? showAuthenticatedNav().map((navItem, index) => (
                                        <ListItem key={index} style={{ backgroundColor: "#243249" }}>
                                            {navItem}
                                        </ListItem>
                                    ))
                                    : showUnAuthenticatedNav().map((navItem, index) => (
                                        <ListItem key={index} style={{ backgroundColor: "#243249" }}>
                                            {navItem}
                                        </ListItem>
                                    ))}
                            </List>
                        </Drawer>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'flex' },
                            fontFamily: 'arial',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                            mb: 0.4,
                        }}
                    >
                        Home
                    </Typography>


                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex"} }}>
                        {showAlwaysNav()}
                    </Box>

                    <Box sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
                    {isAuthenticated
                            ? showAuthenticatedNav()
                            : showUnAuthenticatedNav()}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

Navbar.propTypes = {};