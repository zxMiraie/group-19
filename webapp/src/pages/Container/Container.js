import React from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";

export const ContainerProvider = ({ children, maxWidth, sx, ...props }) => {
    return (
        <Container maxWidth={maxWidth} sx={{ ...sx }} {...props}>
            {children}
        </Container>
    );
};

Container.propTypes = {
    maxWidth: PropTypes.string,
};