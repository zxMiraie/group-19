import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
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

import { signUpAction } from "../../store/actions/authActions";
import { useAuth } from "../../hooks/useAuth";
import SignupImage from "../../images/logo.png";

const validationSchema = yup.object({
    email: yup
        .string("Enter your email")
        .email("Invalid email address")
        .required("Email is required"),
    password: yup
        .string("Enter your password")
        .required("Password is required")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*]).{8,}$/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Character: !@#$%&*"
        ),
    confirmPassword: yup
        .string("Confirm your password")
        .required("Confirm password is required")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
});


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Signup = () => {
    const isAuthenticated = useAuth();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { showLoading, errorMessage } = useSelector((state) => state.auth);

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const { email, password } = values;
            const returnSecureToken = false;
            setSnackbarOpen(true);
            setTimeout(() => {
                dispatch(signUpAction(email, password, returnSecureToken, navigate));
            }, 750);
        },
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/account");
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
                    {" "}
                    <Typography variant="h4" gutterBottom component="div">
                        Sign up
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
                    <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    placeholder="Confirm your password"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    sx={() => ({
                        width: "80%",
                    })}
                    required
                    />{" "}
                    {errorMessage.length > 0 && (
                        <FormHelperText error>Registration failed</FormHelperText>
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
                            Sign up
                        </Button>
                    )}
                </Box>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={750} onClose={() => setSnackbarOpen(false)}>
                <Alert severity="success">Signed up successfully! Redirecting...</Alert>
            </Snackbar>
        </Container>
    );
};