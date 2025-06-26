import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const Private = () => {
    const location = useLocation();
    const isAuthenticated = useAuth();
    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/sign-in" state={{ from: location }} replace />
    );
};