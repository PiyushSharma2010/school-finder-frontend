import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLocationArrow, FaSearch, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';

const ChooseLocationModal = ({ isOpen, onClose, onUseCurrentLocation, onManualSearch }) => {
    const [mode, setMode] = useState('selection'); // 'selection' | 'manual'
    const [locationInput, setLocationInput] = useState('');

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (locationInput.trim()) {
            onManualSearch(locationInput.trim());
            onClose();
        }
    };

    const resetAndClose = () => {
        setMode('selection');
        setLocationInput('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={resetAndClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '2rem',
                                width: '100%',
                                maxWidth: '450px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                position: 'relative',
                                margin: '1rem'
                            }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={resetAndClose}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    transition: 'background 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                            >
                                <FaTimes size={18} />
                            </button>

                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                color: '#1f2937',
                                marginBottom: '0.5rem',
                                textAlign: 'center'
                            }}>
                                Choose Location
                            </h2>
                            <p style={{
                                color: '#6b7280',
                                textAlign: 'center',
                                marginBottom: '2rem',
                                fontSize: '0.95rem'
                            }}>
                                See schools available in your area
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Option A: GPS */}
                                <button
                                    onClick={() => {
                                        onUseCurrentLocation();
                                        onClose();
                                    }}
                                    className="btn-location-option"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.75rem',
                                        background: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textAlign: 'left',
                                        width: '100%'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#f0f9ff';
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    <div style={{
                                        background: '#eff6ff',
                                        color: '#3b82f6',
                                        padding: '0.75rem',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FaLocationArrow size={18} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ display: 'block', fontWeight: '600', color: '#1f2937' }}>Use Current Location</span>
                                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Using GPS</span>
                                    </div>
                                </button>

                                {/* Option B: Manual */}
                                <div style={{ transition: 'all 0.3s ease' }}>
                                    {mode === 'selection' ? (
                                        <button
                                            onClick={() => setMode('manual')}
                                            className="btn-location-option"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '1rem',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.75rem',
                                                background: 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                textAlign: 'left',
                                                width: '100%'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#f0f9ff';
                                                e.currentTarget.style.borderColor = '#3b82f6';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'white';
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                            }}
                                        >
                                            <div style={{
                                                background: '#f3f4f6',
                                                color: '#4b5563',
                                                padding: '0.75rem',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FaMapMarkerAlt size={18} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <span style={{ display: 'block', fontWeight: '600', color: '#1f2937' }}>Enter Location Manually</span>
                                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Search by city, area or pincode</span>
                                            </div>
                                        </button>
                                    ) : (
                                        <motion.form
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            onSubmit={handleManualSubmit}
                                            style={{
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.75rem',
                                                padding: '1rem',
                                                background: '#f9fafb'
                                            }}
                                        >
                                            <div style={{ marginBottom: '1rem' }}>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    Enter Location
                                                </label>
                                                <div style={{ position: 'relative' }}>
                                                    <FaSearch style={{
                                                        position: 'absolute',
                                                        left: '1rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: '#9ca3af'
                                                    }} />
                                                    <input
                                                        type="text"
                                                        value={locationInput}
                                                        onChange={(e) => setLocationInput(e.target.value)}
                                                        placeholder="Bangalore, Delhi NCR, 110001..."
                                                        autoFocus
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                                                            borderRadius: '0.5rem',
                                                            border: '1px solid #d1d5db',
                                                            fontSize: '0.95rem',
                                                            outline: 'none',
                                                            transition: 'border-color 0.2s',
                                                            boxSizing: 'border-box'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setMode('selection')}
                                                    style={{
                                                        padding: '0.75rem',
                                                        borderRadius: '0.5rem',
                                                        border: 'none',
                                                        background: 'transparent',
                                                        color: '#6b7280',
                                                        cursor: 'pointer',
                                                        fontWeight: '500'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
                                                    onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    style={{
                                                        flex: 1,
                                                        background: '#6366f1',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '0.5rem',
                                                        padding: '0.75rem',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#4f46e5'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = '#6366f1'}
                                                >
                                                    Search Schools
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChooseLocationModal;
