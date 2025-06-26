import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Button,
    Container,
    TextField,
    CircularProgress,
    FormHelperText,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { signInAction } from "../../store/actions/authActions";
import { useAuth } from "../../hooks/useAuth";
import SignupImage from "../../images/logo.png";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "../../utils/snackbarUtils";

const validationSchema = yup.object({
    email: yup
        .string("Enter your email")
        .email("Invalid email address")
        .required("Email is required"),
    password: yup.string("Enter your password").required("Password is required"),
});

export const Signin = () => {
    const isAuthenticated = useAuth();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { showLoading, errorMessage } = useSelector((state) => state.auth);

    const {
        openSnackbar,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
        Alert,
        showSnackbar,
    } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const { email, password } = values;
            const returnSecureToken = true;
            dispatch(signInAction(email, password, returnSecureToken, navigate, showSnackbar));
        },
    });

    useEffect(() => {
        if (isAuthenticated) {
            showSnackbar("Logged in successfully.", "success");
        }
    }, [isAuthenticated, navigate]);

    return (
        <Container>
            <Box
                component="div"
                sx={(theme) => ({
                    display: "flex",
                    flexDirection: "row",
                    [theme.breakpoints.down("sm")]: {
                        flexDirection: "column",
                    },
                    [theme.breakpoints.down("xs")]: {
                        flexDirection: "column",
                    },
                    [theme.breakpoints.down("md")]: {
                        flexDirection: "column",
                    },
                    justifyContent: "center",
                })}
            >
                <Box
                    component="div"
                    sx={(theme) => ({
                        [theme.breakpoints.down("sm")]: {
                            display: "none",
                        },
                        [theme.breakpoints.down("xs")]: {
                            display: "none",
                        },
                        [theme.breakpoints.down("md")]: {
                            display: "none",
                        },
                    })}
                >
                    <Box
                        component="img"
                        alt="auth image"
                        src={SignupImage}
                        sx={() => ({
                            flexGrow: "1",
                            flexBasis: "100%",
                            width: "70%",
                            marginTop: "30%",
                        })}
                    />
                </Box>
                <Box
                    onSubmit={formik.handleSubmit}
                    component="form"
                    noValidation
                    sx={(theme) => ({
                        "& > :not(style)": {
                            m: 1,
                        },
                        display: "flex",
                        alignItems: "flex-end",
                        flexDirection: "column",
                        height: "50vh",
                        flexGrow: "1",
                        flexBasis: "100%",
                        justifyContent: "flex-end",
                        [theme.breakpoints.down("sm")]: {
                            marginTop: "30%",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                        [theme.breakpoints.down("xs")]: {
                            marginTop: "30%",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                        [theme.breakpoints.down("md")]: {
                            marginTop: "30%",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                    })}
                    display="flex"
                    alignItems="flex-end"
                    flexDirection="column"
                    height="50vh"
                    flexGrow={1}
                    flexBasis="100%"
                    justifyContent="flex-end"
                >
                    <Typography variant="h4" gutterBottom component="div">
                        Sign in
                    </Typography>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        variant="outlined"
                        placeholder="Enter your email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        sx={() => ({
                            width: "80%",
                        })}
                        required
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        variant="outlined"
                        placeholder="Enter your password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        sx={() => ({
                            width: "80%",
                        })}
                        required
                    />
                    {errorMessage && (
                        <FormHelperText error>Authentication failed</FormHelperText>
                    )}
                    {showLoading ? (
                        <CircularProgress />
                    ) : (
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth={true}
                            style={{ width: "100px", float: "left" }}
                        >
                            Sign in
                        </Button>
                    )}
                </Box>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};
