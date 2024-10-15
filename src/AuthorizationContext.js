import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from './apiClient';

const AuthorizationContext = createContext();

export const AuthorizationProvider = ({ children }) => {
    const [screens, setScreens] = useState([]);
    const [screen, setScreen] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.screen_ids?.split(',');
    });
    const [role, setRole] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        return [user?.role_name1, user?.role_name2];
    });

    const fetchScreens = async () => {
        try {
            const response = await apiClient.get('/api/screens/get-all');
            setScreens(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleLocalStorageUpdate = () => {
        if (localStorage.getItem('token') && localStorage.getItem('user')) {
            fetchScreens();
            const user = JSON.parse(localStorage.getItem('user'));
            setScreen(user.screen_ids?.split(','));
            setRole([user.role_name1, user.role_name2]);
        }
    };

    useEffect(() => {
        handleLocalStorageUpdate();

        window.addEventListener('storage', handleLocalStorageUpdate);
        return () => {
            window.removeEventListener('storage', handleLocalStorageUpdate);
        };
    }, []);

    return (
        <AuthorizationContext.Provider value={{ screen, setScreen, screens, setScreens, role, setRole }}>
            {children}
        </AuthorizationContext.Provider>
    );
};

export const authorizeScreen = (screen_id) => {
    return true;
    const { screen } = useScreen();
    if (!screen || !screen_id) return false;
    for (let element of screen)
        if (element === '*' || screen_id.startsWith(element) || element.startsWith(screen_id))
            return true;
    return false;
}

export const authorizeRole = (requiredRole) => {
    return true;
    const { role } = useRole();
    if (!role || !requiredRole) return false;
    const setCurrentRole = new Set(role);
    return setCurrentRole.has('Admin') || requiredRole.some(element => setCurrentRole.has(element));
}

export const authorize = (requireScreenId, requiredRole) => {
    return true;
    return (!requireScreenId && !requiredRole) ? true : (authorizeScreen(requireScreenId) || authorizeRole(requiredRole)) ? true : false;
}

export const buildTree = (data) => {
    const tree = [];

    const lookup = {};

    data.forEach(item => {
        const path = item.screenId.split('.');
        let currentLevel = tree;

        path.forEach((part, index) => {
            if (!lookup[item.screenId]) {
                let tempKey = path.slice(0, index + 1).join('.');
                const existingNode = currentLevel.find(node => node.key === tempKey);

                if (!existingNode) {
                    const newNode = {
                        key: tempKey,
                        label: index === path.length - 1 ? item.screenName : part,
                        children: [],
                    };

                    currentLevel.push(newNode);
                    lookup[item.screenId] = newNode;
                    currentLevel = newNode.children;
                } else {
                    currentLevel = existingNode.children;
                }
            }
        });
    });

    return tree;
}

export const useScreen = () => useContext(AuthorizationContext);

export const useScreens = () => useContext(AuthorizationContext);

export const useRole = () => useContext(AuthorizationContext);