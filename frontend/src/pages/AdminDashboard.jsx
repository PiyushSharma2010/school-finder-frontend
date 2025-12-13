import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSchool, FaPlus, FaEdit, FaChartLine, FaEnvelope,
    FaStickyNote, FaArrowLeft, FaBars, FaTimes, FaTrash,
    FaCheckCircle, FaExclamationCircle, FaDownload, FaSearch
} from 'react-icons/fa';
import '../styles/layout.css';
import '../styles/components/forms.css';
import '../styles/pages/dashboard.css';
import '../styles/modern-theme.css';

// --- Sub-components ---

const AdminNotes = ({ schoolId }) => {
    const { setAlert } = useAlert();
    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, [schoolId]);

    const fetchNotes = async () => {
        try {
            const res = await api.get(`/notes/school/${schoolId}`);
            setNotes(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!noteContent.trim()) return;
        try {
            await api.post('/notes', { school: schoolId, noteText: noteContent });
            setAlert('Note added', 'success');
            setNoteContent('');
            fetchNotes();
        } catch (err) {
            setAlert('Failed to add note', 'error');
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm('Delete note?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n._id !== id));
            setAlert('Note deleted', 'success');
        } catch (err) {
            setAlert('Failed to delete note', 'error');
        }
    };

    return (
        <div className="card glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaStickyNote style={{ color: '#eab308' }} /> Private Notes
            </h3>

            <form onSubmit={handleAddNote} style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <textarea
                        className="form-textarea"
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.5)', border: '1px solid #e5e7eb', resize: 'none' }}
                        rows="3"
                        placeholder="Add a private note about this school..."
                        value={noteContent}
                        onChange={e => setNoteContent(e.target.value)}
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="btn-modern"
                        style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '0.875rem', padding: '4px 12px' }}
                    >
                        Add Note
                    </button>
                </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                {loading ? (
                    <p className="text-center" style={{ color: '#6b7280' }}>Loading notes...</p>
                ) : notes.length > 0 ? (
                    <AnimatePresence>
                        {notes.map(note => (
                            <motion.div
                                key={note._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="note-item"
                                style={{
                                    background: '#fef9c3',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #fef08a',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    position: 'relative'
                                }}
                            >
                                <p style={{ color: '#4b5563', whiteSpace: 'pre-wrap', paddingRight: '1.5rem' }}>{note.noteText}</p>
                                <button
                                    onClick={() => handleDeleteNote(note._id)}
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        color: '#f87171',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        opacity: 0,
                                        transition: 'opacity 0.2s, color 0.2s'
                                    }}
                                    className="note-delete"
                                    onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                                    onMouseLeave={(e) => e.target.style.color = '#f87171'}
                                >
                                    <FaTrash size={14} />
                                </button>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '8px', display: 'block' }}>
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="text-center" style={{ padding: '2rem 0', color: '#9ca3af', background: 'rgba(249,250,251,0.5)', borderRadius: '8px', border: '2px dashed #e5e7eb' }}>
                        <FaStickyNote style={{ margin: '0 auto 8px', fontSize: '2rem', opacity: 0.2 }} />
                        <p>No notes yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="card glass-card"
        style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
        <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
            <h3 style={{ fontSize: '1.875rem', fontWeight: '700', marginTop: '4px', color: '#1f2937' }}>{value}</h3>
        </div>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }} className={color}>
            {icon}
        </div>
    </motion.div>
);

// --- Main Component ---

const AdminDashboard = () => {
    const { setAlert } = useAlert();

    // Navigation State
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'school'
    const [activeTab, setActiveTab] = useState('edit'); // 'edit', 'enquiries', 'analytics', 'notes'
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Data State
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [enquiries, setEnquiries] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const initialFormState = {
        name: '', description: '', city: '', state: '', area: '', address: '',
        board: 'CBSE', mediums: [], minFee: '', maxFee: '',
        classesOffered: '', facilities: '', images: []
    };
    const [schoolForm, setSchoolForm] = useState(initialFormState);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            setLoading(true);
            const res = await api.get('/schools/mine');
            setSchools(res.data.data);
        } catch (err) {
            console.error(err);
            setAlert('Failed to fetch schools', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSchoolSelect = async (school) => {
        if (!school.isApproved) {
            setAlert('You can only edit approved schools. Pending schools are locked until approval.', 'warning');
            return;
        }

        setSelectedSchool(school);
        setSchoolForm({
            name: school.name,
            description: school.description,
            city: school.city,
            state: school.state || '',
            area: school.area,
            address: school.address,
            board: school.board,
            mediums: school.mediums || [],
            minFee: school.minFee,
            maxFee: school.maxFee,
            classesOffered: school.classesOffered.join(', '),
            facilities: school.facilities.join(', '),
            images: school.images || []
        });
        setSelectedImages([]);
        setImagePreviews(school.images || []);

        setViewMode('school');
        setActiveTab('edit');
        setSidebarOpen(false);

        // Fetch data for this school
        try {
            const analyticsRes = await api.get(`/admin/analytics/my-school?schoolId=${school._id}`);
            setAnalytics(analyticsRes.data.data);

            const enquiriesRes = await api.get('/enquiries/mine');
            setEnquiries(enquiriesRes.data.data.filter(e => e.school === school._id || e.school?._id === school._id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateNew = () => {
        setSelectedSchool(null);
        setSchoolForm(initialFormState);
        setSelectedImages([]);
        setImagePreviews([]);
        setViewMode('create');
        setSidebarOpen(false);
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedSchool(null);
        setSidebarOpen(false);
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        // Validate max 3 images
        if (files.length + (schoolForm.images?.length || 0) > 3) {
            setAlert('Maximum 3 images allowed', 'error');
            return;
        }

        // Validate file size (2MB per file)
        const invalidFiles = files.filter(file => file.size > 2 * 1024 * 1024);
        if (invalidFiles.length > 0) {
            setAlert('Each image must be less than 2MB', 'error');
            return;
        }

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const invalidTypes = files.filter(file => !validTypes.includes(file.type));
        if (invalidTypes.length > 0) {
            setAlert('Only JPG, JPEG, PNG, and WEBP images are allowed', 'error');
            return;
        }

        try {
            setLoading(true);
            const uploadedImages = await Promise.all(
                files.map(async (file) => {
                    const data = new FormData();
                    data.append("file", file);
                    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "YOUR_UPLOAD_PRESET");

                    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME"}/image/upload`, {
                        method: "POST",
                        body: data
                    });

                    const fileData = await res.json();
                    if (fileData.error) throw new Error(fileData.error.message);
                    return fileData.secure_url;
                })
            );

            setSchoolForm(prev => ({
                ...prev,
                images: [...(prev.images || []), ...uploadedImages]
            }));

            // Update previews
            setImagePreviews(prev => [...prev, ...uploadedImages]);
            setAlert('Images uploaded successfully', 'success');
        } catch (err) {
            console.error(err);
            setAlert('Failed to upload images: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSchoolSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            // Append form fields
            formData.append('name', schoolForm.name);
            formData.append('description', schoolForm.description);
            formData.append('city', schoolForm.city);
            formData.append('area', schoolForm.area);
            formData.append('address', schoolForm.address);
            formData.append('board', schoolForm.board);
            formData.append('minFee', schoolForm.minFee);
            formData.append('maxFee', schoolForm.maxFee);

            // Append arrays
            const classesArray = schoolForm.classesOffered.split(',').map(s => s.trim());
            const facilitiesArray = schoolForm.facilities.split(',').map(s => s.trim());

            classesArray.forEach(cls => formData.append('classesOffered', cls));
            facilitiesArray.forEach(fac => formData.append('facilities', fac));

            // Append mediums (required field)
            schoolForm.mediums.forEach(medium => formData.append('mediums', medium));

            // Append images
            // Append images (URLs)
            if (schoolForm.images && schoolForm.images.length > 0) {
                schoolForm.images.forEach(image => {
                    formData.append('images', image);
                });
            }

            // Append state
            formData.append('state', schoolForm.state);

            if (selectedSchool) {
                await api.put(`/schools/${selectedSchool._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setAlert('School updated successfully', 'success');
                fetchSchools();
            } else {
                await api.post('/schools', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setAlert('School created successfully', 'success');
                fetchSchools();
                setViewMode('list');
            }

            setSelectedImages([]);
            setImagePreviews([]);
        } catch (err) {
            setAlert(err.response?.data?.error || 'Operation failed', 'error');
        }
    };

    const updateEnquiryStatus = async (id, status) => {
        try {
            await api.put(`/enquiries/${id}`, { status });
            setEnquiries(enquiries.map(e => e._id === id ? { ...e, status } : e));
            setAlert('Status updated', 'success');
        } catch (err) {
            setAlert('Failed to update status', 'error');
        }
    };

    const handleExport = async () => {
        try {
            const res = await api.get('/enquiries/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'enquiries.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setAlert('Failed to export enquiries', 'error');
        }
    };

    // --- Render Helpers ---

    const SidebarItem = ({ icon: Icon, label, active, onClick, danger = false }) => (
        <motion.div
            whileHover={{ x: 5 }}
            onClick={(e) => {
                if (onClick) onClick(e);
                setSidebarOpen(false);
            }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '8px',
                background: active ? '#4f46e5' : 'transparent',
                color: active ? 'white' : danger ? '#ef4444' : '#6b7280',
                boxShadow: active ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.background = danger ? '#fef2f2' : 'white';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                }
            }}
        >
            <Icon style={{ color: active ? 'white' : danger ? '#ef4444' : '#6366f1' }} />
            <span style={{ fontWeight: '500' }}>{label}</span>
        </motion.div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'rgba(249,250,251,0.5)', paddingTop: '80px' }}>
            {/* Mobile Header */}
            <div id="admin-mobile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 1rem' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>School Admin</h1>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        padding: '8px',
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px'
                    }}
                >
                    {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 40,
                        backdropFilter: 'blur(2px)'
                    }}
                />
            )}

            <div style={{ position: 'relative', padding: '0 1rem' }} className="admin-layout-container">
                {/* Sidebar */}
                <motion.div
                    className={`card glass-panel admin-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}
                    id="admin-sidebar"
                    initial={false}
                    animate={{ x: 0 }}
                >
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Panel</h2>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>Manage your schools</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {viewMode === 'school' ? (
                            <>
                                <SidebarItem
                                    icon={FaArrowLeft}
                                    label="Back to Schools"
                                    onClick={handleBackToList}
                                />
                                <div style={{ margin: '1rem 0', borderBottom: '1px solid rgba(229,231,235,0.5)' }}></div>
                                <div style={{ padding: '0 1rem', marginBottom: '8px', fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {selectedSchool?.name || 'School'}
                                </div>
                                <SidebarItem
                                    icon={FaEdit}
                                    label="Edit Details"
                                    active={activeTab === 'edit'}
                                    onClick={() => setActiveTab('edit')}
                                />
                                <SidebarItem
                                    icon={FaEnvelope}
                                    label="Enquiries"
                                    active={activeTab === 'enquiries'}
                                    onClick={() => setActiveTab('enquiries')}
                                />
                                <SidebarItem
                                    icon={FaChartLine}
                                    label="Analytics"
                                    active={activeTab === 'analytics'}
                                    onClick={() => setActiveTab('analytics')}
                                />
                                <SidebarItem
                                    icon={FaStickyNote}
                                    label="Notes"
                                    active={activeTab === 'notes'}
                                    onClick={() => setActiveTab('notes')}
                                />
                            </>
                        ) : (
                            <>
                                <SidebarItem
                                    icon={FaSchool}
                                    label="My Schools"
                                    active={viewMode === 'list'}
                                    onClick={handleBackToList}
                                />
                                <SidebarItem
                                    icon={FaPlus}
                                    label="Add New School"
                                    active={viewMode === 'create'}
                                    onClick={handleCreateNew}
                                />
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Main Content */}
                <div id="admin-content">
                    <AnimatePresence mode="wait">
                        {viewMode === 'list' && (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937' }}>My Schools</h1>
                                    <button onClick={handleCreateNew} className="btn-modern" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaPlus /> Add New School
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="text-center" style={{ padding: '3rem 0' }}>
                                        <div style={{ width: '48px', height: '48px', border: '3px solid #e5e7eb', borderTop: '3px solid #6366f1', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                                    </div>
                                ) : schools.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', justifyContent: 'center' }}>
                                        {schools.map(school => (
                                            <motion.div
                                                key={school._id}
                                                whileHover={{ y: -5 }}
                                                onClick={() => handleSchoolSelect(school)}
                                                className="card glass-card school-card"
                                                style={{ padding: '1.5rem', borderRadius: '12px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                                            >
                                                <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        background: school.status === 'approved' ? '#dcfce7' : school.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                                                        color: school.status === 'approved' ? '#16a34a' : school.status === 'rejected' ? '#dc2626' : '#ca8a04'
                                                    }}>
                                                        {school.status === 'approved' ? 'Approved' : school.status === 'rejected' ? 'Rejected' : 'Pending'}
                                                    </span>
                                                </div>

                                                <div style={{ width: '48px', height: '48px', background: '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', marginBottom: '1rem' }}>
                                                    <FaSchool size={24} />
                                                </div>

                                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>{school.name}</h3>
                                                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{school.city}, {school.area}</p>

                                                {school.status === 'rejected' && (
                                                    <div style={{ marginTop: '8px', padding: '12px', background: '#fef2f2', borderRadius: '8px', fontSize: '0.75rem', color: '#dc2626', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                        <FaExclamationCircle style={{ marginTop: '2px', flexShrink: 0 }} />
                                                        <span>{school.rejectionReason || 'No reason provided'}</span>
                                                    </div>
                                                )}

                                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                                                    <span>{school.board}</span>
                                                    <span className="manage-arrow" style={{ transition: 'color 0.2s' }}>Manage →</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="card glass-panel text-center" style={{ padding: '4rem 2rem', borderRadius: '16px' }}>
                                        <div style={{ width: '80px', height: '80px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#9ca3af' }}>
                                            <FaSchool size={40} />
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>No Schools Yet</h3>
                                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Get started by adding your first school to the platform.</p>
                                        <button onClick={handleCreateNew} className="btn-modern">Create School</button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {(viewMode === 'create' || (viewMode === 'school' && activeTab === 'edit')) && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="card glass-panel"
                                style={{ padding: '2rem', borderRadius: '16px' }}
                            >
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                                    {viewMode === 'create' ? 'Add New School' : `Edit ${schoolForm.name}`}
                                </h2>

                                <form onSubmit={handleSchoolSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">School Name</label>
                                            <input type="text" className="form-input"
                                                value={schoolForm.name} onChange={e => setSchoolForm({ ...schoolForm, name: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Board</label>
                                            <select className="form-select"
                                                value={schoolForm.board} onChange={e => setSchoolForm({ ...schoolForm, board: e.target.value })}>
                                                <option value="CBSE">CBSE</option>
                                                <option value="ICSE">ICSE</option>
                                                <option value="State Board">State Board</option>
                                                <option value="IB">IB</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Medium of Instruction</label>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {['English', 'Hindi', 'Other'].map(medium => (
                                                <label key={medium} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={schoolForm.mediums.includes(medium)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSchoolForm({ ...schoolForm, mediums: [...schoolForm.mediums, medium] });
                                                            } else {
                                                                setSchoolForm({ ...schoolForm, mediums: schoolForm.mediums.filter(m => m !== medium) });
                                                            }
                                                        }}
                                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                    />
                                                    <span style={{ fontSize: '0.95rem', color: '#374151' }}>{medium}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Select at least one medium</p>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-textarea"
                                            rows="4" value={schoolForm.description} onChange={e => setSchoolForm({ ...schoolForm, description: e.target.value })} required />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">City</label>
                                            <input type="text" className="form-input"
                                                value={schoolForm.city} onChange={e => setSchoolForm({ ...schoolForm, city: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">State</label>
                                            <input type="text" className="form-input"
                                                value={schoolForm.state} onChange={e => setSchoolForm({ ...schoolForm, state: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Area</label>
                                            <input type="text" className="form-input"
                                                value={schoolForm.area} onChange={e => setSchoolForm({ ...schoolForm, area: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Address</label>
                                            <input type="text" className="form-input"
                                                value={schoolForm.address} onChange={e => setSchoolForm({ ...schoolForm, address: e.target.value })} required />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">Min Fee (₹)</label>
                                            <input type="number" className="form-input"
                                                value={schoolForm.minFee} onChange={e => setSchoolForm({ ...schoolForm, minFee: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Max Fee (₹)</label>
                                            <input type="number" className="form-input"
                                                value={schoolForm.maxFee} onChange={e => setSchoolForm({ ...schoolForm, maxFee: e.target.value })} required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Classes Offered</label>
                                        <input type="text" className="form-input"
                                            value={schoolForm.classesOffered} onChange={e => setSchoolForm({ ...schoolForm, classesOffered: e.target.value })}
                                            placeholder="e.g. Nursery, KG, 1-10, 11-12 (comma separated)" required />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Facilities</label>
                                        <input type="text" className="form-input"
                                            value={schoolForm.facilities} onChange={e => setSchoolForm({ ...schoolForm, facilities: e.target.value })}
                                            placeholder="e.g. Transport, Labs, Library, Swimming Pool (comma separated)" required />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">School Images (Max 3, 2MB each)</label>
                                        <input
                                            type="file"
                                            className="form-input"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            multiple
                                            onChange={handleImageUpload}
                                            style={{ padding: '0.5rem' }}
                                        />
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                                            Select up to 3 images (JPG, PNG, WEBP). Max 2MB per image.
                                        </p>

                                        {imagePreviews.length > 0 && (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                                {imagePreviews.map((preview, idx) => (
                                                    <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${idx + 1}`}
                                                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                        />
                                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px', textAlign: 'center', fontSize: '0.75rem' }}>
                                                            Image {idx + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ paddingTop: '1rem', display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className="btn-modern" style={{ flex: 1 }}>
                                            {viewMode === 'create' ? 'Create School' : 'Save Changes'}
                                        </button>
                                        {viewMode === 'create' && (
                                            <button type="button" onClick={handleBackToList} className="btn-outline">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {viewMode === 'school' && activeTab === 'enquiries' && (
                            <motion.div
                                key="enquiries"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="card glass-panel"
                                style={{ padding: '1.5rem', borderRadius: '16px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>Enquiries</h2>
                                    <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#dcfce7', color: '#16a34a', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.target.style.background = '#bbf7d0'}
                                        onMouseLeave={(e) => e.target.style.background = '#dcfce7'}
                                    >
                                        <FaDownload size={14} /> Export CSV
                                    </button>
                                </div>

                                {enquiries.length > 0 ? (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    <th style={{ paddingBottom: '12px', paddingLeft: '8px' }}>Name</th>
                                                    <th style={{ paddingBottom: '12px' }}>Contact</th>
                                                    <th style={{ paddingBottom: '12px' }}>Message</th>
                                                    <th style={{ paddingBottom: '12px' }}>Status</th>
                                                    <th style={{ paddingBottom: '12px' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {enquiries.map(enq => (
                                                    <tr key={enq._id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(249,250,251,0.5)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <td style={{ padding: '1rem 0 1rem 8px', fontWeight: '500', color: '#1f2937' }}>{enq.name}</td>
                                                        <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span>{enq.email}</span>
                                                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{enq.phone}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: '#6b7280', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={enq.message}>
                                                            {enq.message}
                                                        </td>
                                                        <td style={{ padding: '1rem 0' }}>
                                                            <span style={{
                                                                padding: '4px 8px',
                                                                borderRadius: '20px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500',
                                                                background: enq.status === 'Contacted' ? '#dcfce7' : '#fef9c3',
                                                                color: enq.status === 'Contacted' ? '#16a34a' : '#ca8a04'
                                                            }}>
                                                                {enq.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1rem 0' }}>
                                                            {enq.status === 'Pending' && (
                                                                <button
                                                                    onClick={() => updateEnquiryStatus(enq._id, 'Contacted')}
                                                                    style={{ fontSize: '0.75rem', background: '#eef2ff', color: '#6366f1', padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                                                                    onMouseEnter={(e) => e.target.style.background = '#dbeafe'}
                                                                    onMouseLeave={(e) => e.target.style.background = '#eef2ff'}
                                                                >
                                                                    Mark Contacted
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center" style={{ padding: '3rem 0', color: '#9ca3af' }}>
                                        <FaEnvelope style={{ margin: '0 auto 12px', fontSize: '3rem', opacity: 0.2 }} />
                                        <p>No enquiries received yet.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {viewMode === 'school' && activeTab === 'analytics' && analytics && (
                            <motion.div
                                key="analytics"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                            >
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>Performance Overview</h2>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                    <StatCard
                                        title="Total Views"
                                        value={analytics.views}
                                        icon={<FaSearch />}
                                        color="bg-blue-stat"
                                    />
                                    <StatCard
                                        title="Enquiries"
                                        value={analytics.enquiries}
                                        icon={<FaEnvelope />}
                                        color="bg-purple-stat"
                                    />
                                    <StatCard
                                        title="Avg Rating"
                                        value={analytics.averageRating?.toFixed(1) || 'N/A'}
                                        icon={<FaCheckCircle />}
                                        color="bg-yellow-stat"
                                    />
                                </div>

                                <div className="card glass-panel text-center" style={{ padding: '2rem', borderRadius: '16px' }}>
                                    <FaChartLine style={{ margin: '0 auto', fontSize: '4rem', color: '#c7d2fe', marginBottom: '1rem' }} />
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1f2937' }}>Detailed Analytics Coming Soon</h3>
                                    <p style={{ color: '#6b7280', marginTop: '8px' }}>We are working on bringing you more insights about your school's performance.</p>
                                </div>
                            </motion.div>
                        )}

                        {viewMode === 'school' && activeTab === 'notes' && (
                            <motion.div
                                key="notes"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <AdminNotes schoolId={selectedSchool._id} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .note-item:hover .note-delete {
                    opacity: 1;
                }
                .school-card:hover .manage-arrow {
                    color: #6366f1;
                }
                .bg-blue-stat {
                    background: #dbeafe;
                    color: #2563eb;
                }
                .bg-purple-stat {
                    background: #f3e8ff;
                    color: #9333ea;
                }
                .bg-yellow-stat {
                    background: #fef9c3;
                    color: #ca8a04;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
