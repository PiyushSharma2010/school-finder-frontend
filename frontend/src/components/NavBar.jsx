import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useComparison } from '../context/ComparisonContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaSchool, FaUserCircle } from 'react-icons/fa';
import '../styles/layout.css';
import '../styles/modern-theme.css';

const NavBar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { compareList } = useComparison();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const onLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Browse Schools', path: '/schools' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <motion.header
            className={`header ${scrolled ? 'glass-panel' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                padding: scrolled ? '0.8rem 0' : '1.2rem 0',
                transition: 'all 0.3s ease',
                background: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.3)' : 'none',
                boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'
            }}
        >
            <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* Logo */}
                <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src="/logo-icon.svg"
                            alt="School Finder Logo"
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                        />
                    </motion.div>
                    <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        School Finder
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="nav-links hidden-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="nav-link"
                            style={{
                                position: 'relative',
                                fontWeight: '500',
                                color: location.pathname === link.path ? 'var(--color-primary)' : 'var(--color-text-muted)'
                            }}
                        >
                            {link.name}
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="underline"
                                    style={{
                                        position: 'absolute',
                                        bottom: '-4px',
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        background: 'var(--primary-gradient)',
                                        borderRadius: '2px'
                                    }}
                                />
                            )}
                        </Link>
                    ))}

                    {/* Compare Badge */}
                    {compareList.length > 0 && (
                        <Link to="/compare" className="nav-link" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            Compare
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-12px',
                                    background: 'var(--accent-gradient)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                }}
                            >
                                {compareList.length}
                            </motion.span>
                        </Link>
                    )}

                    {/* Auth Buttons */}
                    {isAuthenticated ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Link to="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-glass"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '12px' }}
                                >
                                    <FaUserCircle size={18} />
                                    <span>Dashboard</span>
                                </motion.button>
                            </Link>

                            {user && user.role === 'schoolAdmin' && (
                                <Link to="/admin" className="nav-link">School Admin</Link>
                            )}

                            {user && (user.role === 'superAdmin' || user.role === 'superadmin') && (
                                <Link to="/superadmin" className="nav-link" style={{ color: '#ef4444', fontWeight: 'bold' }}>
                                    Super Admin
                                </Link>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onLogout}
                                className="btn-modern"
                                style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}
                            >
                                Logout
                            </motion.button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-glass"
                                >
                                    Login
                                </motion.button>
                            </Link>
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-modern"
                                >
                                    Register
                                </motion.button>
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <motion.button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        display: 'none',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#1f2937',
                        padding: '10px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                        width: '44px',
                        height: '44px',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
                </motion.button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mobile-menu glass-panel"
                        style={{
                            overflow: 'hidden',
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="nav-link"
                                onClick={() => setIsMenuOpen(false)}
                                style={{ padding: '0.8rem', borderRadius: '8px', background: location.pathname === link.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {compareList.length > 0 && (
                            <Link to="/compare" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                Compare ({compareList.length})
                            </Link>
                        )}

                        <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0.5rem 0' }}></div>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="nav-link"
                                    style={{
                                        display: 'block',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        background: '#f3f4f6',
                                        color: '#374151',
                                        fontWeight: '600'
                                    }}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>

                                {user && user.role === 'schoolAdmin' && (
                                    <Link
                                        to="/admin"
                                        className="nav-link"
                                        style={{
                                            display: 'block',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            background: '#e0e7ff',
                                            color: '#4338ca',
                                            fontWeight: '600',
                                            border: '1px solid #c7d2fe'
                                        }}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        School Admin Panel
                                    </Link>
                                )}

                                {user && (user.role === 'superAdmin' || user.role === 'superadmin') && (
                                    <Link
                                        to="/superadmin"
                                        className="nav-link"
                                        style={{
                                            display: 'block',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            background: '#fee2e2',
                                            color: '#b91c1c',
                                            fontWeight: '600',
                                            border: '1px solid #fecaca'
                                        }}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Super Admin Panel
                                    </Link>
                                )}

                                <button
                                    onClick={onLogout}
                                    className="btn-modern"
                                    style={{ width: '100%', marginTop: '0.5rem' }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Link to="/login" className="btn-glass" style={{ textAlign: 'center', justifyContent: 'center' }} onClick={() => setIsMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="btn-modern" style={{ textAlign: 'center', justifyContent: 'center' }} onClick={() => setIsMenuOpen(false)}>Register</Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 992px) {
                    .hidden-mobile { display: none !important; }
                    .mobile-menu-btn { display: flex !important; }
                }
            `}</style>
        </motion.header>
    );
};

export default NavBar;
