import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser, FaHeart, FaStickyNote, FaHistory, FaMapMarkedAlt,
    FaSearch, FaExchangeAlt, FaCog, FaEdit, FaTrash,
    FaExclamationTriangle, FaLock, FaTimes, FaBars, FaSignOutAlt,
    FaClipboardList, FaClock, FaCheck, FaTimes as FaTimesCircle
} from 'react-icons/fa';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useComparison } from '../context/ComparisonContext';
import SchoolCard from '../components/SchoolCard';
import MapView from '../components/common/MapView';
import SearchAutocomplete from '../components/common/SearchAutocomplete';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout, loadUser } = useAuth();
    const { setAlert } = useAlert();
    const { compareList, removeFromCompare } = useComparison();
    const [favourites, setFavourites] = useState([]);
    const [notes, setNotes] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    const [showNoteModal, setShowNoteModal] = useState(false);
    const [newNote, setNewNote] = useState({ school: '', noteText: '' });
    const [allSchools, setAllSchools] = useState([]);

    // Edit Profile State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', city: '', state: '', address: '' });

    // Complete Profile Modal State
    const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
    const [completeProfileForm, setCompleteProfileForm] = useState({ city: '', state: '', address: '' });
    const [completeProfileLoading, setCompleteProfileLoading] = useState(false);

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteStep, setDeleteStep] = useState(1); // 1 = password, 2 = confirm text
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchUserData();
        fetchSchools();
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentlyViewed(recent);
    }, []);

    // Show Complete Profile modal if profile is not complete
    useEffect(() => {
        if (user && user.isProfileComplete === false) {
            setShowCompleteProfileModal(true);
        }
    }, [user]);

    const fetchSchools = async () => {
        try {
            const res = await api.get('/schools?select=name,location,city,slug,address');
            setAllSchools(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const favRes = await api.get('/favourites');
            setFavourites(favRes.data.data);

            const notesRes = await api.get('/notes');
            setNotes(notesRes.data.data);


        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    // Handle Complete Profile submission
    const handleCompleteProfile = async (e) => {
        e.preventDefault();
        setCompleteProfileLoading(true);
        try {
            await api.put('/auth/update', {
                ...completeProfileForm,
                name: user?.name
            });
            await loadUser(); // Refresh user data
            setShowCompleteProfileModal(false);
            setAlert('Profile completed successfully!', 'success');
        } catch (err) {
            setAlert(err.response?.data?.error || 'Failed to update profile', 'error');
        } finally {
            setCompleteProfileLoading(false);
        }
    };

    const removeFavourite = async (schoolId) => {
        try {
            await api.delete(`/favourites/${schoolId}`);
            setFavourites(favourites.filter(fav => fav.school._id !== schoolId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/notes', newNote);
            setNotes([res.data.data, ...notes]);
            setShowNoteModal(false);
            setNewNote({ school: '', noteText: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to add note');
        }
    };

    const deleteNote = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Edit Profile Handlers
    const handleEditClick = () => {
        setPasswordInput('');
        setPasswordError('');
        setShowPasswordModal(true);
    };

    const handleVerifyPassword = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError('');

        try {
            await api.post('/auth/verify-password', { password: passwordInput });
            setShowPasswordModal(false);
            setEditForm({
                name: user?.name || '',
                phone: user?.phone || '',
                city: user?.city || '',
                state: user?.state || ''
            });
            setShowEditModal(true);
        } catch (err) {
            setPasswordError(err.response?.data?.error || 'Incorrect password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);

        try {
            await api.put('/auth/update', editForm);
            await loadUser(); // Refresh user data
            setAlert('Profile updated successfully!', 'success');
            setShowEditModal(false);
        } catch (err) {
            setAlert(err.response?.data?.error || 'Failed to update profile', 'error');
        } finally {
            setPasswordLoading(false);
        }
    };

    // Delete Account Handlers
    const handleDeleteClick = () => {
        setDeletePassword('');
        setDeleteConfirmText('');
        setDeleteError('');
        setDeleteStep(1);
        setShowDeleteModal(true);
    };

    const handleDeletePasswordVerify = async (e) => {
        e.preventDefault();
        setDeleteLoading(true);
        setDeleteError('');

        try {
            await api.post('/auth/verify-password', { password: deletePassword });
            setDeleteStep(2);
        } catch (err) {
            setDeleteError(err.response?.data?.error || 'Incorrect password');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (deleteConfirmText !== 'delete my account') {
            setDeleteError('Please type "delete my account" exactly');
            return;
        }

        setDeleteLoading(true);
        setDeleteError('');

        try {
            await api.delete('/auth/delete-account', {
                data: { password: deletePassword, confirmText: deleteConfirmText }
            });
            setAlert('Account deleted successfully', 'success');
            logout();
            navigate('/');
        } catch (err) {
            setDeleteError(err.response?.data?.error || 'Failed to delete account');
        } finally {
            setDeleteLoading(false);
        }
    };

    const navItems = [
        { id: 'profile', label: 'Profile', icon: <FaUser /> },

        { id: 'favourites', label: 'Favourites', icon: <FaHeart /> },
        { id: 'notes', label: 'My Notes', icon: <FaStickyNote /> },
        { id: 'recent', label: 'Recently Viewed', icon: <FaHistory /> },
        { id: 'map', label: 'Map View', icon: <FaMapMarkedAlt /> },
        { id: 'savedSearches', label: 'Saved Searches', icon: <FaSearch /> },
        { id: 'comparison', label: 'Comparison List', icon: <FaExchangeAlt /> },
        { id: 'settings', label: 'Settings', icon: <FaCog /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', background: '#f8fafc', marginTop: '70px' }}>
            {/* Sidebar Navigation */}
            <motion.div
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '280px',
                    minWidth: '280px',
                    background: 'white',
                    borderRight: '1px solid #e2e8f0',
                    padding: '2rem 1rem',
                    zIndex: 40,
                    overflowY: 'auto'
                }}
                id="dashboard-sidebar"
                className={mobileMenuOpen ? 'mobile-open' : ''}
            >
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', padding: '0 1rem', color: '#1f2937' }}>Dashboard</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                transition: 'all 0.2s',
                                background: activeTab === item.id ? '#eff6ff' : 'transparent',
                                color: activeTab === item.id ? '#2563eb' : '#6b7280',
                                fontWeight: activeTab === item.id ? '600' : '400',
                                boxShadow: activeTab === item.id ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== item.id) {
                                    e.target.style.background = '#f9fafb';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== item.id) {
                                    e.target.style.background = 'transparent';
                                }
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            color: '#ef4444',
                            marginTop: '2rem',
                            transition: 'all 0.2s',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </motion.div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 30
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    id="mobile-overlay"
                />
            )}

            {/* Main Content */}
            <div style={{ flex: 1, padding: '1rem', minWidth: 0 }} id="dashboard-main">
                {/* Mobile Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }} id="mobile-header">
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>My Dashboard</h1>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            padding: '8px',
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #e5e7eb',
                            color: '#6b7280',
                            cursor: 'pointer'
                        }}
                        id="mobile-menu-btn"
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'profile' && (
                        <div className="card glass-panel" style={{ padding: '2rem', maxWidth: '700px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    overflow: 'hidden'
                                }}>
                                    {user?.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase() || <FaUser />
                                    )}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>{user?.name}</h2>
                                    <p style={{ color: '#6b7280' }}>{user?.role === 'user' ? 'Parent / Student' : user?.role}</p>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                                    <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Email Address</label>
                                    <p style={{ fontWeight: '500', color: '#1f2937' }}>{user?.email}</p>
                                </div>
                                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                                    <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                                    <p style={{ fontWeight: '500', color: '#1f2937' }}>{user?.phone || 'Not provided'}</p>
                                </div>
                                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                                    <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '4px' }}>City</label>
                                    <p style={{ fontWeight: '500', color: '#1f2937' }}>{user?.city || 'Not provided'}</p>
                                </div>
                                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                                    <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '4px' }}>State</label>
                                    <p style={{ fontWeight: '500', color: '#1f2937' }}>{user?.state || 'Not provided'}</p>
                                </div>
                            </div>
                            <button onClick={handleEditClick} className="btn-modern" style={{ marginTop: '1.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FaEdit /> Edit Profile
                            </button>
                        </div>
                    )}





                    {activeTab === 'favourites' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>My Favourites</h2>
                            {loading ? <div className="text-center" style={{ padding: '2.5rem 0' }}>Loading...</div> : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {favourites.length > 0 ? (
                                        favourites.map(fav => (
                                            <div key={fav._id} style={{ position: 'relative' }} className="fav-item">
                                                <SchoolCard school={fav.school} />
                                                <button
                                                    onClick={() => removeFavourite(fav.school._id)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '16px',
                                                        right: '16px',
                                                        background: 'rgba(255,255,255,0.9)',
                                                        padding: '8px',
                                                        borderRadius: '50%',
                                                        color: '#ef4444',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                        opacity: 0,
                                                        transition: 'opacity 0.2s',
                                                        border: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                    className="fav-delete-btn"
                                                    title="Remove from favourites"
                                                    onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                                                    onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.9)'}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="card text-center" style={{ gridColumn: '1 / -1', padding: '2.5rem', border: '2px dashed #e5e7eb', color: '#6b7280' }}>
                                            No favourites added yet. Browse schools to add them here!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>My Notes</h2>
                                <button onClick={() => setShowNoteModal(true)} className="btn-modern" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaStickyNote /> Add Note
                                </button>
                            </div>

                            {notes.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                    {notes.map(note => (
                                        <div key={note._id} className="note-card" style={{
                                            background: '#fef9c3',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #fef08a',
                                            position: 'relative',
                                            transition: 'box-shadow 0.2s'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                                        >
                                            <h3 style={{ fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>{note.school?.name}</h3>
                                            <p style={{ color: '#4b5563', whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{note.noteText}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#6b7280' }}>
                                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                                <button
                                                    onClick={() => deleteNote(note._id)}
                                                    style={{
                                                        color: '#f87171',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        opacity: 0,
                                                        transition: 'opacity 0.2s, color 0.2s'
                                                    }}
                                                    className="note-delete-btn"
                                                    onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                                                    onMouseLeave={(e) => e.target.style.color = '#f87171'}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center" style={{ padding: '2.5rem 0', color: '#6b7280' }}>No notes added yet.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'recent' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>Recently Viewed Schools</h2>
                            {recentlyViewed.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    {recentlyViewed.map(school => (
                                        <div key={school._id} className="card glass-card" style={{ padding: '1.5rem', transition: 'box-shadow 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
                                        >
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>{school.name}</h3>
                                            <p style={{ color: '#6b7280', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><FaUser /> {school.city}</p>
                                            <a href={`/school/${school.slug}`} className="btn-modern" style={{ width: '100%', textAlign: 'center', display: 'block' }}>View Details</a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="card text-center" style={{ padding: '2.5rem', border: '2px dashed #e5e7eb', color: '#6b7280' }}>
                                    No recently viewed schools.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'map' && (
                        <div className="dashboard-section card glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '10px' }}>Interactive Map</h2>
                                <p style={{ marginBottom: '20px', color: '#666' }}>Find schools near you or explore markers.</p>
                                <div style={{ marginBottom: '20px', maxWidth: '600px' }}>
                                    <SearchAutocomplete />
                                </div>
                            </div>
                            <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                                <MapView schools={allSchools} height="500px" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'savedSearches' && (
                        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>Saved Searches</h2>
                            {user?.savedSearches && user.savedSearches.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {user.savedSearches.map(search => (
                                        <div key={search._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid #f3f4f6', transition: 'box-shadow 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                                        >
                                            <div>
                                                <h4 style={{ fontWeight: '700', color: '#1f2937' }}>{search.name}</h4>
                                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Created: {new Date(search.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <a href={search.url} style={{ padding: '8px 16px', background: '#eff6ff', color: '#2563eb', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', transition: 'background 0.2s' }}
                                                    onMouseEnter={(e) => e.target.style.background = '#dbeafe'}
                                                    onMouseLeave={(e) => e.target.style.background = '#eff6ff'}
                                                >Run Search</a>
                                                <button
                                                    onClick={async () => {
                                                        if (!window.confirm('Delete this saved search?')) return;
                                                        try {
                                                            await api.delete(`/auth/saved-searches/${search._id}`);
                                                            window.location.reload();
                                                        } catch (err) {
                                                            console.error(err);
                                                            alert('Failed to delete search');
                                                        }
                                                    }}
                                                    style={{ padding: '8px', color: '#f87171', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    onMouseEnter={(e) => { e.target.style.color = '#dc2626'; e.target.style.background = '#fef2f2'; }}
                                                    onMouseLeave={(e) => { e.target.style.color = '#f87171'; e.target.style.background = 'transparent'; }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center" style={{ padding: '2.5rem 0', color: '#6b7280' }}>No saved searches yet.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'comparison' && (
                        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>Comparison List</h2>
                            {compareList.length > 0 ? (
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                                        {compareList.map(school => (
                                            <div key={school._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                                                <span style={{ fontWeight: '500', color: '#1f2937' }}>{school.name}</span>
                                                <button onClick={() => removeFromCompare(school._id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontSize: '0.875rem', cursor: 'pointer', transition: 'color 0.2s' }}
                                                    onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                                                    onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                                                >Remove</button>
                                            </div>
                                        ))}
                                    </div>
                                    <a href="/compare" className="btn-modern" style={{ display: 'block', textAlign: 'center' }}>Go to Compare Page</a>
                                </div>
                            ) : (
                                <div className="text-center" style={{ padding: '2.5rem 0', color: '#6b7280' }}>No schools selected for comparison.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="card glass-panel" style={{ padding: '1.5rem', maxWidth: '700px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>Account Settings</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Reset Password */}
                                <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '12px', border: '1px solid #fcd34d' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontWeight: '700', color: '#92400e', marginBottom: '4px' }}>Reset Password</h3>
                                            <p style={{ fontSize: '0.875rem', color: '#a16207' }}>Change your account password using OTP verification</p>
                                        </div>
                                        <a
                                            href="/forgot-password"
                                            className="btn-modern"
                                            style={{ padding: '8px 20px', fontSize: '0.875rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                                        >
                                            Reset
                                        </a>
                                    </div>
                                </div>
                                {/* Notification Preferences */}
                                <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontWeight: '700', color: '#374151', marginBottom: '4px' }}>Notification Preferences</h3>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Manage email and push notifications</p>
                                        </div>
                                        <span style={{ padding: '4px 12px', background: '#e5e7eb', borderRadius: '20px', fontSize: '0.75rem', color: '#6b7280' }}>Coming Soon</span>
                                    </div>
                                </div>
                                {/* Delete Account */}
                                <div style={{ padding: '1.5rem', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontWeight: '700', color: '#991b1b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FaExclamationTriangle /> Delete Account
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>Permanently delete your account and all data. This action cannot be undone.</p>
                                        </div>
                                        <button
                                            onClick={handleDeleteClick}
                                            className="btn-modern"
                                            style={{ padding: '8px 20px', fontSize: '0.875rem', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Add Note Modal */}
            <AnimatePresence>
                {showNoteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 50,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                width: '100%',
                                maxWidth: '500px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                            }}
                        >
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Add Note</h3>
                            <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>School</label>
                                    <select
                                        className="form-input"
                                        style={{ width: '100%' }}
                                        value={newNote.school}
                                        onChange={e => setNewNote({ ...newNote, school: e.target.value })}
                                        required
                                    >
                                        <option value="">Select School</option>
                                        {allSchools.map(s => (
                                            <option key={s._id} value={s._id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>Note</label>
                                    <textarea
                                        className="form-textarea"
                                        style={{ width: '100%' }}
                                        rows="4"
                                        value={newNote.noteText}
                                        onChange={e => setNewNote({ ...newNote, noteText: e.target.value })}
                                        required
                                        placeholder="Enter your note here..."
                                    ></textarea>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                    <button type="button" onClick={() => setShowNoteModal(false)} style={{ padding: '8px 16px', color: '#6b7280', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >Cancel</button>
                                    <button type="submit" className="btn-modern">Save Note</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Password Verify Modal for Edit */}
            < AnimatePresence >
                {showPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 50,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                width: '100%',
                                maxWidth: '400px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', background: '#dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                    <FaLock size={18} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>Verify Password</h3>
                            </div>
                            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.9rem' }}>Please enter your password to edit your profile.</p>
                            <form onSubmit={handleVerifyPassword}>
                                <input
                                    type="password"
                                    className="form-input"
                                    style={{ width: '100%', marginBottom: '0.5rem' }}
                                    placeholder="Enter your password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    required
                                />
                                {passwordError && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{passwordError}</p>}
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                    <button type="button" onClick={() => setShowPasswordModal(false)} style={{ padding: '8px 16px', color: '#6b7280', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" className="btn-modern" disabled={passwordLoading}>
                                        {passwordLoading ? 'Verifying...' : 'Continue'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Edit Profile Modal */}
            < AnimatePresence >
                {showEditModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 50,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                width: '100%',
                                maxWidth: '500px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                            }}
                        >
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>Edit Profile</h3>
                            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{ width: '100%' }}
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>Phone</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        style={{ width: '100%' }}
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        placeholder="10-digit number"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>City</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            style={{ width: '100%' }}
                                            value={editForm.city}
                                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>State</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            style={{ width: '100%' }}
                                            value={editForm.state}
                                            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                    <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: '8px 16px', color: '#6b7280', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" className="btn-modern" disabled={passwordLoading}>
                                        {passwordLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Delete Account Modal */}
            < AnimatePresence >
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 50,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                width: '100%',
                                maxWidth: '450px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', background: '#fef2f2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                    <FaExclamationTriangle size={18} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#991b1b' }}>Delete Account</h3>
                            </div>

                            {deleteStep === 1 && (
                                <form onSubmit={handleDeletePasswordVerify}>
                                    <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.9rem' }}>Please enter your password to continue with account deletion.</p>
                                    <input
                                        type="password"
                                        className="form-input"
                                        style={{ width: '100%', marginBottom: '0.5rem' }}
                                        placeholder="Enter your password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        required
                                    />
                                    {deleteError && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{deleteError}</p>}
                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                        <button type="button" onClick={() => setShowDeleteModal(false)} style={{ padding: '8px 16px', color: '#6b7280', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                        <button type="submit" className="btn-modern" disabled={deleteLoading} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                                            {deleteLoading ? 'Verifying...' : 'Continue'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {deleteStep === 2 && (
                                <form onSubmit={handleDeleteAccount}>
                                    <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                        <p style={{ color: '#991b1b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px' }}>⚠️ This action is permanent!</p>
                                        <p style={{ color: '#dc2626', fontSize: '0.8rem' }}>All your data including favourites, notes, reviews, and saved searches will be permanently deleted.</p>
                                    </div>
                                    <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Type <strong style={{ color: '#991b1b' }}>delete my account</strong> to confirm:</p>
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{ width: '100%', marginBottom: '0.5rem' }}
                                        placeholder="delete my account"
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        required
                                    />
                                    {deleteError && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{deleteError}</p>}
                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                        <button type="button" onClick={() => setShowDeleteModal(false)} style={{ padding: '8px 16px', color: '#6b7280', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                        <button
                                            type="submit"
                                            className="btn-modern"
                                            disabled={deleteLoading || deleteConfirmText !== 'delete my account'}
                                            style={{
                                                background: deleteConfirmText === 'delete my account'
                                                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                                    : '#e5e7eb',
                                                color: deleteConfirmText === 'delete my account' ? 'white' : '#9ca3af',
                                                cursor: deleteConfirmText === 'delete my account' ? 'pointer' : 'not-allowed'
                                            }}
                                        >
                                            {deleteLoading ? 'Deleting...' : 'Delete My Account'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}

                {/* Complete Profile Modal */}
                {showCompleteProfileModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100,
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '2rem',
                                maxWidth: '450px',
                                width: '100%',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                            }}
                        >
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1f2937' }}>
                                Complete Your Profile
                            </h2>
                            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                Please fill in your details to continue
                            </p>
                            <form onSubmit={handleCompleteProfile}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>City *</label>
                                    <input
                                        type="text"
                                        value={completeProfileForm.city}
                                        onChange={(e) => setCompleteProfileForm({ ...completeProfileForm, city: e.target.value })}
                                        required
                                        placeholder="Enter your city"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '10px',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>State *</label>
                                    <input
                                        type="text"
                                        value={completeProfileForm.state}
                                        onChange={(e) => setCompleteProfileForm({ ...completeProfileForm, state: e.target.value })}
                                        required
                                        placeholder="Enter your state"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '10px',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Address *</label>
                                    <textarea
                                        value={completeProfileForm.address}
                                        onChange={(e) => setCompleteProfileForm({ ...completeProfileForm, address: e.target.value })}
                                        required
                                        placeholder="Enter your full address"
                                        rows="2"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            resize: 'none'
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={completeProfileLoading}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: completeProfileLoading ? 'wait' : 'pointer'
                                    }}
                                >
                                    {completeProfileLoading ? 'Saving...' : 'Complete Profile'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            <style>{`
                /* Desktop styles */
                @media (min-width: 1024px) {
                    #dashboard-sidebar {
                        display: flex !important;
                        flex-direction: column;
                        position: sticky !important;
                        top: 0;
                        height: calc(100vh - 70px);
                        align-self: flex-start;
                    }
                    #dashboard-main {
                        padding: 2rem;
                    }
                    #mobile-header {
                        display: none !important;
                    }
                    #mobile-overlay {
                        display: none !important;
                    }
                }
                /* Mobile styles */
                @media (max-width: 1023px) {
                    #dashboard-sidebar {
                        display: ${mobileMenuOpen ? 'flex' : 'none'};
                        flex-direction: column;
                        position: fixed !important;
                        top: 70px;
                        left: 0;
                        bottom: 0;
                        width: 280px !important;
                        z-index: 45;
                        box-shadow: 4px 0 20px rgba(0,0,0,0.1);
                    }
                }
                .fav-item:hover .fav-delete-btn {
                    opacity: 1;
                }
                .note-card:hover .note-delete-btn {
                    opacity: 1;
                }
            `}</style>
        </div >
    );
};

export default Dashboard;
