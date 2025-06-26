export const useAuth = () => {
    return sessionStorage.getItem("idToken");
};