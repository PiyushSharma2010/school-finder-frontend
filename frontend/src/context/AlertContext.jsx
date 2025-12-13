import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const setAlert = useCallback((msg, type, timeout = 5000) => {
        const id = uuidv4();
        setAlerts((prev) => [...prev, { msg, type, id }]);

        setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }, timeout);
    }, []);

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return (
        <AlertContext.Provider value={{ alerts, setAlert, removeAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
