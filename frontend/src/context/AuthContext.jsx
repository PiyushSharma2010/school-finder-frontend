import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user function - can be called after OAuth login
    const loadUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return null;
        }

        try {
            const res = await api.get('/auth/me');
            setUser(res.data.data);
            setIsAuthenticated(true);
            setLoading(false);
            return res.data.data;
        } catch (err) {
            console.error('[Auth] Failed to load user:', err);
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            return null;
        }
    }, []);

    // Load user on startup
    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Register User
    const register = async (formData) => {
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Registration failed',
                field: err.response?.data?.field,
                message: err.response?.data?.message,
                fields: err.response?.data?.fields // Add support for multiple field errors (validation)
            };
        }
    };

    // Login User
    const login = async (formData) => {
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);
            return { success: true, user: res.data.user };
        } catch (err) {
            return {
                success: false,
                banned: err.response?.data?.banned || false,
                error: err.response?.data?.error || 'Login failed'
            };
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Send OTP
    const sendOtp = async (email) => {
        try {
            const res = await api.post('/auth/send-otp', { email });
            return { success: true, message: res.data.message };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Failed to send OTP'
            };
        }
    };

    // Verify OTP
    const verifyOtp = async (email, otp) => {
        try {
            const res = await api.post('/auth/verify-otp', { email, otp });
            return { success: true, message: res.data.message };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Invalid OTP'
            };
        }
    };

    // Reset Password
    const resetPassword = async (email, otp, password) => {
        try {
            const res = await api.post('/auth/reset-password', { email, otp, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);
            return { success: true, message: 'Password reset successfully' };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Failed to reset password'
            };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                register,
                login,
                logout,
                loadUser,
                sendOtp,
                verifyOtp,
                resetPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

