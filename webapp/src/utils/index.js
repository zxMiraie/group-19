export const formatError = (errorResponse) => {
    switch (errorResponse.error.message) {
        case "EMAIL_EXISTS":
            return "Email already exists";
        case "EMAIL_NOT_FOUND":
            return "Email not found";
        case "INVALID_PASSWORD":
            return "Invalid Password";
        case "USER_DISABLED":
            return "User Disabled";

        default:
            return "";
    }
};