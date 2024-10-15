import React, { createContext, useContext, useEffect, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        // return user && replaceRole(Role, user?.roles?.split(','));
        return null;
    });

    // useEffect(() => {
    //     // Hàm xử lý sự kiện khi localStorage được cập nhật
    //     const handleSessionUpdate = () => {
    //         const user = JSON.parse(localStorage.getItem('user'));
    //         // setRole(user && replaceRole(Role, user?.roles?.split(',')));
    //         setRole(null);
    //     };

    //     // Lắng nghe sự kiện 'sessionUpdated'
    //     // window.addEventListener('sessionUpdated', handleSessionUpdate);

    //     // Hủy lắng nghe sự kiện khi component bị unmount
    //     // return () => {
    //     //     window.removeEventListener('sessionUpdated', handleSessionUpdate);
    //     // };
    // }, []);

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);