import axios from "axios";

const API = "https://identitytoolkit.googleapis.com/v1/accounts:"; //This is Firebase REST API for authentication
const TOKEN = process.env.REACT_APP_API_KEY;

class AuthService {
    async login({ email, password, returnSecureToken }) {
        try {
            return await axios.post(`${API}signInWithPassword?key=${TOKEN}`, {
                email,
                password,
                returnSecureToken,
            });
        } catch (error) {
            throw error;
        }
    }

    async signup({ email, password, returnSecureToken }) {
        try {
            return await axios.post(`${API}signUp?key=${TOKEN}`, {
                email,
                password,
                returnSecureToken,
            });
        } catch (error) {
            throw error;
        }
    }

    lookup({ idToken }) {
        try {
            return axios.post(`${API}lookup?key=${TOKEN}`, {
                idToken,
            });
        } catch (error) {
            throw error;
        }
    }
    saveTokensInSessionStorage({ idToken, refreshToken, expiresIn, localId }) {
        sessionStorage.setItem("idToken", idToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("expiresIn", expiresIn);
        sessionStorage.setItem("localId", localId);
    }

    logout() {
        sessionStorage.removeItem("idToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("expiresIn");
        sessionStorage.removeItem("localId");
    }
}

export const authService = new AuthService();