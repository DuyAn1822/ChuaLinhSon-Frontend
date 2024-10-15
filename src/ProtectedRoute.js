// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authorize } from '../GlobalVariable';
import { useScreen } from './AuthorizationContext';

const ProtectedRoute = ({ element: Component, requiredScreen }) => {
    const { screen } = useScreen();

    if (!authorize(requiredScreen, screen)) {
        return <Navigate to="/401" />;
    }

    return Component;
};

export default ProtectedRoute;
