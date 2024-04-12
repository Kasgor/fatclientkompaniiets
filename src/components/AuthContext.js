import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        token: null,
        role: null
    });

    const login = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setAuth({ isAuthenticated: true, token, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuth({ isAuthenticated: false, token: null, role: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);