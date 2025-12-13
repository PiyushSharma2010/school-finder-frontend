import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/layout.css';
import '../styles/modern-theme.css';

const Footer = () => {
    return (
        <footer className="footer" style={{ background: 'var(--surface-dark)', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
            {/* Background Gradient Blob */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>

                    {/* Brand Section */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                            <img src="/logo-icon.svg" alt="Logo" style={{ width: '40px', height: '40px' }} />
                            <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>School Finder</h3>
                        </div>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Empowering parents to find the perfect educational environment for their children through data-driven insights and transparent comparisons.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                                <a key={index} href="#" style={{
                                    width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'all 0.3s ease'
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-gradient)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>Quick Links</h4>
                        <ul className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {['Home', 'Browse Schools', 'Compare', 'Pricing', 'FAQ'].map((item) => (
                                <li key={item}>
                                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} style={{ color: '#94a3b8', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => e.target.style.color = 'var(--neon-blue)'}
                                        onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>Contact Us</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                                <FaMapMarkerAlt style={{ color: 'var(--neon-purple)' }} />
                                <span>123 Education Lane, Knowledge City, India</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                                <FaPhone style={{ color: 'var(--neon-purple)' }} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                                <FaEnvelope style={{ color: 'var(--neon-purple)' }} />
                                <span>support@schoolfinder.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom" style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem'
                }}>
                    <p>&copy; {new Date().getFullYear()} School Finder. All rights reserved. | <Link to="/privacy" style={{ color: '#64748b' }}>Privacy Policy</Link> | <Link to="/terms" style={{ color: '#64748b' }}>Terms of Service</Link></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
