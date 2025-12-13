import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import '../styles/pages/auth.css';
import '../styles/modern-theme.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { setAlert } = useAlert();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [banError, setBanError] = useState('');

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (banError) setBanError('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setBanError('');
        const result = await login({ email, password });

        if (result.success) {
            setAlert('Logged in successfully', 'success');
            const userRole = result.user.role;

            if (userRole === 'schoolAdmin') {
                navigate('/admin');
            } else if (userRole === 'superAdmin' || userRole === 'superadmin') {
                navigate('/superadmin');
            } else {
                navigate('/dashboard');
            }
        } else {
            // Check if user is banned
            if (result.banned) {
                setBanError(result.error);
            } else {
                setAlert(result.error, 'error');
            }
        }
    };

    return (
        <div className="auth-container" style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Shapes */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 }}
            />
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    position: 'relative',
                    zIndex: 1,
                    background: 'rgba(255,255,255,0.8)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: '#64748b' }}>Sign in to continue to School Finder</p>
                </div>

                <form className="auth-form" onSubmit={onSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FaEnvelope style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="form-input"
                                placeholder="Enter your email"
                                style={{ paddingLeft: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px 40px 12px 40px' }}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <FaLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="form-input"
                                placeholder="Enter your password"
                                style={{ paddingLeft: '40px', borderRadius: '12px', border: banError ? '1px solid #ef4444' : '1px solid #e2e8f0', padding: '12px 40px 12px 40px' }}
                                required
                            />
                        </div>
                        {banError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '8px', textAlign: 'center' }}>{banError}</p>}
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: '500', textDecoration: 'none' }}>
                            Forgot Password?
                        </Link>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn-modern"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem' }}
                    >
                        <FaSignInAlt /> Login
                    </motion.button>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                        <span style={{ padding: '0 10px', color: '#94a3b8', fontSize: '0.9rem' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    </div>

                    <motion.a
                        href={`${import.meta.env.VITE_API_URL}/auth/google`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-modern"
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            fontSize: '1rem',
                            background: 'white',
                            color: '#334155',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                        Continue with Google
                    </motion.a>
                </form>
                <p className="auth-footer" style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
                    Don't have an account? <Link to="/register" className="auth-link" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Register</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
