import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import '../styles/pages/auth.css';
import '../styles/modern-theme.css';

const ForgotPassword = () => {
    const { sendOtp, verifyOtp, resetPassword } = useAuth();
    const { setAlert } = useAlert();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return setAlert('Please enter your email', 'error');

        setLoading(true);
        const result = await sendOtp(email);
        setLoading(false);

        if (result.success) {
            setAlert(result.message, 'success');
            setStep(2);
            setTimer(30);
        } else {
            setAlert(result.error, 'error');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 4) return setAlert('Please enter a valid 4-digit OTP', 'error');

        setLoading(true);
        const result = await verifyOtp(email, otp);
        setLoading(false);

        if (result.success) {
            setAlert(result.message, 'success');
            setStep(3);
        } else {
            setAlert(result.error, 'error');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) return setAlert('Password must be at least 6 characters', 'error');

        setLoading(true);
        const result = await resetPassword(email, otp, newPassword);
        setLoading(false);

        if (result.success) {
            setAlert(result.message, 'success');
            navigate('/dashboard');
        } else {
            setAlert(result.error, 'error');
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setLoading(true);
        const result = await sendOtp(email);
        setLoading(false);

        if (result.success) {
            setAlert('OTP resent successfully', 'success');
            setTimer(30);
        } else {
            setAlert(result.error, 'error');
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="auth-shape auth-shape-1"
            />
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="auth-shape auth-shape-2"
            />

            <motion.div
                className="card glass-card auth-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center" style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                        Reset <span className="text-gradient">Password</span>
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                style={{
                                    width: '32px',
                                    height: '4px',
                                    borderRadius: '2px',
                                    background: step >= s ? '#6366f1' : '#e5e7eb',
                                    transition: 'all 0.3s'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {step === 1 && (
                    <motion.form
                        onSubmit={handleSendOtp}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-center" style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            Enter your email address to receive a 4-digit OTP.
                        </p>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaEnvelope style={{ color: '#6366f1' }} /> Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                required
                                placeholder="name@example.com"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mt-6" disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </motion.form>
                )}

                {step === 2 && (
                    <motion.form
                        onSubmit={handleVerifyOtp}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: '#eef2ff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                fontSize: '2rem'
                            }}>
                                ✉️
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Enter OTP</h3>
                            <p style={{ color: '#6b7280' }}>
                                We sent a 4-digit code to <strong>{email}</strong>
                            </p>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                className="form-input text-center"
                                style={{ letterSpacing: '1rem', fontSize: '1.5rem', fontWeight: '700' }}
                                required
                                placeholder="0000"
                                maxLength="4"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mt-6" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: timer > 0 ? '#9ca3af' : '#6366f1',
                                    background: 'none',
                                    border: 'none',
                                    cursor: timer > 0 ? 'not-allowed' : 'pointer',
                                    transition: 'color 0.2s'
                                }}
                                disabled={timer > 0 || loading}
                            >
                                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    margin: '0 auto'
                                }}
                            >
                                <FaArrowLeft size={12} /> Change Email
                            </button>
                        </div>
                    </motion.form>
                )}

                {step === 3 && (
                    <motion.form
                        onSubmit={handleResetPassword}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: '#dcfce7',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <FaCheckCircle style={{ color: '#16a34a', fontSize: '2rem' }} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Set New Password</h3>
                            <p style={{ color: '#6b7280' }}>
                                Enter your new password below.
                            </p>
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaLock style={{ color: '#6366f1' }} /> New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="form-input"
                                required
                                minLength="6"
                                placeholder="Min. 6 characters"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mt-6" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </motion.form>
                )}

                <p className="text-center mt-6" style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    <Link to="/login" style={{ color: '#6366f1', fontWeight: '500' }}>
                        Back to Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
