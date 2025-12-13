import React, { createContext, useState, useContext, useEffect } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('compareList');
        if (stored) {
            setCompareList(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (school) => {
        if (compareList.find(s => s._id === school._id)) return;
        if (compareList.length >= 4) {
            alert('You can only compare up to 4 schools.');
            return;
        }
        setCompareList([...compareList, school]);
    };

    const removeFromCompare = (schoolId) => {
        setCompareList(compareList.filter(s => s._id !== schoolId));
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    return (
        <ComparisonContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
            {children}
        </ComparisonContext.Provider>
    );
};
