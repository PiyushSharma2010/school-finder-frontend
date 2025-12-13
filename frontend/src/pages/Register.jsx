import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus } from 'react-icons/fa';
import '../styles/pages/auth.css';
import '../styles/modern-theme.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { setAlert } = useAlert();

    const [role, setRole] = useState('user');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const { name, email, password, phone } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear field error when user starts typing
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        const result = await register({ ...formData, role });

        if (result.success) {
            setAlert('Registered successfully', 'success');
            if (role === 'schoolAdmin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            // Handle field-specific errors
            const { error, field, message, fields } = result;

            if (fields) {
                // Handle multiple validation errors (e.g. required fields, valid email)
                setFieldErrors(fields);
            } else if (error === 'duplicate_field' && field) {
                setFieldErrors({ [field]: message });
            } else if (error === 'email_taken') {
                setFieldErrors({ email: 'This email is already registered' });
            } else if (error === 'name_taken') {
                setFieldErrors({ name: 'This name is already taken' });
            } else {
                // Generic error - show via alert
                setAlert(error || 'Registration failed', 'error');
            }
        }
    };

    return (
        <div className="auth-container" style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            position: 'relative',
            overflow: 'hidden',
            padding: '2rem 0'
        }}>
            {/* Background Shapes */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 }}
            />
            <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: 'absolute', bottom: '10%', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    position: 'relative',
                    zIndex: 1,
                    background: 'rgba(255,255,255,0.8)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: '#64748b' }}>Join School Finder today</p>
                </div>

                <div className="auth-tabs" style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '2rem' }}>
                    <div
                        className={`auth-tab ${role === 'user' ? 'active' : ''}`}
                        onClick={() => setRole('user')}
                        style={{
                            flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                            background: role === 'user' ? 'white' : 'transparent',
                            color: role === 'user' ? 'var(--color-primary)' : '#64748b',
                            boxShadow: role === 'user' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Parent/Student
                    </div>
                    <div
                        className={`auth-tab ${role === 'schoolAdmin' ? 'active' : ''}`}
                        onClick={() => setRole('schoolAdmin')}
                        style={{
                            flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                            background: role === 'schoolAdmin' ? 'white' : 'transparent',
                            color: role === 'schoolAdmin' ? 'var(--color-primary)' : '#64748b',
                            boxShadow: role === 'schoolAdmin' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        School Admin
                    </div>
                </div>

                <form className="auth-form" onSubmit={onSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                        <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <FaUser style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                className="form-input"
                                placeholder="John Doe"
                                style={{ paddingLeft: '40px', borderRadius: '12px', border: fieldErrors.name ? '1px solid #ef4444' : '1px solid #e2e8f0', padding: '12px 40px 12px 40px' }}
                                required
                            />
                        </div>
                        {fieldErrors.name && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.name}</p>}
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                        <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FaEnvelope style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="form-input"
                                placeholder="john@example.com"
                                style={{ paddingLeft: '40px', borderRadius: '12px', border: fieldErrors.email ? '1px solid #ef4444' : '1px solid #e2e8f0', padding: '12px 40px 12px 40px' }}
                                required
                            />
                        </div>
                        {fieldErrors.email && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.email}</p>}
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                        <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Phone Number <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span></label>
                        <div style={{ position: 'relative' }}>
                            <FaPhone style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                name="phone"
                                value={phone}
                                onChange={onChange}
                                className="form-input"
                                placeholder="+91 98765 43210"
                                style={{ paddingLeft: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px 40px 12px 40px' }}
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
                                placeholder="Create a password"
                                style={{ paddingLeft: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px 40px 12px 40px' }}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn-modern"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem' }}
                    >
                        <FaUserPlus /> Register
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
                    Already have an account? <Link to="/login" className="auth-link" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;

