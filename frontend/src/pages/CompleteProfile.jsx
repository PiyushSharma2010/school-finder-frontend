import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaMapMarkerAlt, FaSchool } from 'react-icons/fa';
import '../styles/pages/auth.css';
import '../styles/modern-theme.css';
import api from '../services/api';

const CompleteProfile = () => {
    const navigate = useNavigate();
    const { user, loadUser } = useAuth();
    const { setAlert } = useAlert();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        city: '',
        state: '',
        role: 'user'
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                phone: user.phone || '',
                city: user.city || '',
                state: user.state || '',
                role: user.role || 'user'
            }));
        }
    }, [user]);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/auth/update', formData);
            await loadUser(); // Reload user to update context
            setAlert('Profile updated successfully', 'success');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setAlert(err.response?.data?.error || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            padding: '2rem 0'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    background: 'rgba(255,255,255,0.8)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Complete Your Profile</h1>
                    <p style={{ color: '#64748b' }}>We need a few more details to get you started</p>
                </div>

                <form className="auth-form" onSubmit={onSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                        <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <FaPhone style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={onChange}
                                className="form-input"
                                placeholder="+91 98765 43210"
                                style={{ paddingLeft: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px 40px 12px 40px' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>City</label>
                            <div style={{ position: 'relative' }}>
                                <FaMapMarkerAlt style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={onChange}
                                    className="form-input"
                                    placeholder="City"
                                    style={{ paddingLeft: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px 40px 12px 40px' }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={onChange}
                                className="form-input"
                                placeholder="State"
                                style={{ borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>I am a...</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{
                                flex: 1,
                                padding: '1rem',
                                border: `2px solid ${formData.role === 'user' ? '#6366f1' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: formData.role === 'user' ? '#eef2ff' : 'white',
                                transition: 'all 0.2s'
                            }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={formData.role === 'user'}
                                    onChange={onChange}
                                    style={{ display: 'none' }}
                                />
                                <FaUser style={{ display: 'block', margin: '0 auto 0.5rem', fontSize: '1.5rem', color: formData.role === 'user' ? '#6366f1' : '#94a3b8' }} />
                                <span style={{ fontWeight: '600', color: formData.role === 'user' ? '#6366f1' : '#64748b' }}>Parent/Student</span>
                            </label>

                            <label style={{
                                flex: 1,
                                padding: '1rem',
                                border: `2px solid ${formData.role === 'schoolAdmin' ? '#6366f1' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: formData.role === 'schoolAdmin' ? '#eef2ff' : 'white',
                                transition: 'all 0.2s'
                            }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="schoolAdmin"
                                    checked={formData.role === 'schoolAdmin'}
                                    onChange={onChange}
                                    style={{ display: 'none' }}
                                />
                                <FaSchool style={{ display: 'block', margin: '0 auto 0.5rem', fontSize: '1.5rem', color: formData.role === 'schoolAdmin' ? '#6366f1' : '#94a3b8' }} />
                                <span style={{ fontWeight: '600', color: formData.role === 'schoolAdmin' ? '#6366f1' : '#64748b' }}>School Admin</span>
                            </label>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn-modern"
                        disabled={loading}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem' }}
                    >
                        {loading ? 'Saving...' : 'Complete Profile'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default CompleteProfile;
