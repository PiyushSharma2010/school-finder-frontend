import React from 'react';
import { motion } from 'framer-motion';
import { FaGift } from 'react-icons/fa';
import '../../styles/modern-theme.css';

const FreeAccessNotice = ({ style = {} }) => {
    return (
        <div className="container" style={{ ...style }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel"
                style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}
            >
                {/* Decorative background element */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-10%',
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                    }}>
                        <FaGift size={12} /> Early Access
                    </div>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937', margin: 0 }}>
                        Free for Now <span style={{ fontSize: '1.5rem' }}>🎉</span>
                    </h3>

                    <p style={{ color: '#4b5563', fontSize: '1rem', maxWidth: '600px', lineHeight: '1.5', margin: 0 }}>
                        School Finder is currently <span style={{ fontWeight: '600', color: '#6366f1' }}>free to use</span> during our early access phase.
                        Pricing plans will be introduced soon as we roll out advanced features.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default FreeAccessNotice;
