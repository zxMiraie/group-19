import {
    LOGIN_CONFIRMED_ACTION,
    LOGIN_FAILED_ACTION,
    SIGNUP_CONFIRMED_ACTION,
    SIGNUP_FAILED_ACTION,
    LOADING_ON,
    LOADING_OFF,
} from "../actions/authActions";

const initialState = {
    auth: {
        email: "",
        idToken: "",
        localId: "",
        expiresIn: "",
        refreshToken: "",
    },
    errorMessage: "",
    successMessage: "",
    showLoading: false,
};

export const authReducer = (state = initialState, action) => {
    if (action === SIGNUP_CONFIRMED_ACTION) {
        return {
            ...state,
            auth: action.payload,
            errorMessage: "",
            successMessage: "Sign up Successfully Completed",
            showLoading: false,
        };
    }
    if (
        action.type === SIGNUP_FAILED_ACTION ||
        action.type === LOGIN_FAILED_ACTION
    ) {
        return {
            ...state,
            errorMessage: action.payload,
            successMessage: "",
            showLoading: false,
        };
    }
    if (action.type === LOGIN_CONFIRMED_ACTION) {
        return {
            ...state,
            auth: action.payload,
            errorMessage: "",
            successMessage: "Login Successfully Completed",
            showLoading: false,
        };
    }
    if (action.type === LOADING_ON) {
        return {
            ...state,
            showLoading: true,
        };
    }

    if (action.type === LOADING_OFF) {
        return {
            ...state,
            showLoading: false,
        };
    }

    return state;
};
