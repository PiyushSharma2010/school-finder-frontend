import React, { useState } from 'react';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaClock, FaHeadset, FaCheckCircle } from 'react-icons/fa';
import '../styles/modern-theme.css';

const ContactPage = () => {
    const { setAlert } = useAlert();
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (form.phone && !/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone must be 10 digits';
        }
        if (!form.subject.trim()) newErrors.subject = 'Subject is required';
        if (!form.message.trim()) newErrors.message = 'Message is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await api.post('/contact', form);
            setAlert('Message sent successfully! We will get back to you soon.', 'success');
            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
            setErrors({});
        } catch (err) {
            setAlert(err.response?.data?.error || 'Failed to send message', 'error');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        { icon: FaEnvelope, title: 'Email Us', value: 'support@schoolfinder.com', color: '#3b82f6', action: 'mailto:support@schoolfinder.com' },
        { icon: FaPhone, title: 'Call Us', value: '+91 123 456 7890', color: '#10b981', action: 'tel:+911234567890' },
        { icon: FaMapMarkerAlt, title: 'Visit Us', value: '123 Education Lane, Tech Park, Bangalore - 560001', color: '#ef4444', action: null }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '100px', paddingBottom: '3rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>

                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem' }}
                    >
                        Get in <span className="text-gradient">Touch</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}
                    >
                        Have questions about School Finder? We're here to help. Fill out the form or reach us via email or phone.
                    </motion.p>
                </div>

                {/* Contact Info Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {contactInfo.map((info, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card glass-panel"
                            style={{
                                padding: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                cursor: info.action ? 'pointer' : 'default',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onClick={() => info.action && window.open(info.action, '_blank')}
                            whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                background: `${info.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: info.color,
                                flexShrink: 0
                            }}>
                                <info.icon size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>{info.title}</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.4' }}>{info.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Business Hours & Response Time */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card"
                        style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                            <FaClock size={20} color="#2563eb" />
                            <h3 style={{ fontWeight: '700', color: '#1e40af' }}>Business Hours</h3>
                        </div>
                        <div style={{ color: '#1e40af', fontSize: '0.9rem', lineHeight: '1.8' }}>
                            <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                            <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                            <p><strong>Sunday:</strong> Closed</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card"
                        style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #a7f3d0' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                            <FaHeadset size={20} color="#059669" />
                            <h3 style={{ fontWeight: '700', color: '#065f46' }}>Response Time</h3>
                        </div>
                        <div style={{ color: '#065f46', fontSize: '0.9rem', lineHeight: '1.8' }}>
                            <p><FaCheckCircle style={{ marginRight: '6px' }} />Email: Within 24 hours</p>
                            <p><FaCheckCircle style={{ marginRight: '6px' }} />Phone: Immediate during hours</p>
                            <p><FaCheckCircle style={{ marginRight: '6px' }} />Form: Within 48 hours</p>
                        </div>
                    </motion.div>
                </div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card glass-panel"
                    style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}
                >
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>Send us a Message</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your name"
                                    style={{ borderColor: errors.name ? '#ef4444' : undefined }}
                                />
                                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="your@email.com"
                                    style={{ borderColor: errors.email ? '#ef4444' : undefined }}
                                />
                                {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.email}</span>}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="10-digit number (optional)"
                                    style={{ borderColor: errors.phone ? '#ef4444' : undefined }}
                                />
                                {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.phone}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Subject *</label>
                                <select
                                    className="form-input"
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    style={{ borderColor: errors.subject ? '#ef4444' : undefined }}
                                >
                                    <option value="">Select a topic</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="School Listing">School Listing</option>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="Feedback">Feedback</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.subject && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.subject}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Message *</label>
                            <textarea
                                className="form-textarea"
                                rows="5"
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                placeholder="Tell us more about your inquiry..."
                                style={{ resize: 'none', borderColor: errors.message ? '#ef4444' : undefined }}
                            ></textarea>
                            {errors.message && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.message}</span>}
                        </div>

                        <motion.button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}
                        >
                            <FaPaperPlane /> {loading ? 'Sending...' : 'Send Message'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;

