import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loadUser } = useAuth();
    const { setAlert } = useAlert();
    const [status, setStatus] = useState('Processing login...');

    useEffect(() => {
        const handleOAuth = async () => {
            // Check for error in URL params
            const error = searchParams.get('error');
            if (error) {
                console.error('[OAuth] Error in URL:', error);
                setAlert(`OAuth login failed: ${error}`, 'error');
                navigate('/login');
                return;
            }

            const token = searchParams.get('token');
            const isNewUser = searchParams.get('isNewUser') === 'true';
            console.log('[OAuth] Token received:', token ? 'Yes' : 'No', '| isNewUser:', isNewUser);

            if (token) {
                setStatus('Saving authentication...');
                localStorage.setItem('token', token);
                console.log('[OAuth] Token saved to localStorage');

                setStatus('Loading user profile...');
                try {
                    const user = await loadUser();
                    console.log('[OAuth] User loaded:', user?.email);

                    if (user) {
                        setAlert('Logged in successfully with Google!', 'success');

                        // Only NEW users (registration) go to complete profile
                        // Existing users (login) go directly to appropriate dashboard
                        if (isNewUser) {
                            console.log('[OAuth] New user - redirecting to complete profile');
                            navigate('/complete-profile');
                        } else {
                            // Existing user - redirect based on role
                            console.log('[OAuth] Existing user - redirecting to dashboard');
                            if (user.role === 'schoolAdmin') {
                                navigate('/admin');
                            } else if (user.role === 'superAdmin') {
                                navigate('/superadmin');
                            } else {
                                navigate('/dashboard');
                            }
                        }
                    } else {
                        console.error('[OAuth] Failed to load user after token save');
                        setAlert('Failed to load user profile', 'error');
                        navigate('/login');
                    }
                } catch (err) {
                    console.error('[OAuth] Error loading user:', err);
                    setAlert('Authentication error. Please try again.', 'error');
                    navigate('/login');
                }
            } else {
                console.error('[OAuth] No token in URL');
                setAlert('Login failed - no token received', 'error');
                navigate('/login');
            }
        };

        handleOAuth();
    }, [searchParams, navigate, loadUser, setAlert]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '1rem',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
        }}>
            <div className="spinner" style={{
                width: '50px',
                height: '50px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#334155', fontSize: '1.1rem' }}>{status}</p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default OAuthSuccess;

