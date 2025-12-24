import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/modern-theme.css';

const NotFound = () => {
    return (
        <div className="page-container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card glass-panel"
                style={{ padding: '3rem', maxWidth: '500px' }}
            >
                <div style={{ fontSize: '4rem', color: '#eab308', marginBottom: '1rem' }}>
                    <FaExclamationTriangle />
                </div>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800' }}>
                    404
                </h1>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#374151' }}>
                    Page Not Found
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                    Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link to="/" className="btn-modern" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaHome /> Go to Homepage
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
