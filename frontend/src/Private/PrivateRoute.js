import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // current time in seconds

        if (decodedToken.exp < currentTime) {
            // Token is expired
            localStorage.removeItem('token'); // Remove expired token
            return <Navigate to="/login" replace />;
        }

        // Token is valid
        return children;
    }

    // No token found
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;
