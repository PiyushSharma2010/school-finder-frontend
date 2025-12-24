import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSchool, FaMapMarkerAlt, FaChalkboardTeacher, FaRupeeSign, FaImage, FaCheck, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';

const EditSchool = () => {
    const { schoolId } = useParams();
    const navigate = useNavigate();
    const { setAlert } = useAlert();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        area: '',
        phone: '',
        email: '',
        website: '',
        description: '',
        board: 'CBSE',
        medium: 'English',
        type: 'Co-ed',
        classesOffered: [],
        facilities: [],
        minFee: '',
        maxFee: ''
    });

    // Options (Hardcoded for now, ideal to fetch from config/constants)
    const boards = ['CBSE', 'ICSE', 'IB', 'State Board', 'IGCSE'];
    const mediums = ['English', 'Hindi', 'Marathi', 'Gujarati', 'French', 'Mixed'];
    const types = ['Co-ed', 'Boys', 'Girls'];
    const classOptions = ['Preschool', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const facilityOptions = ['Smart Class', 'Playground', 'Library', 'Transport', 'Cafeteria', 'Swimming Pool', 'CCTV', 'Computer Lab', 'Science Lab', 'Auditorium', 'Hostel', 'Sports Complex', 'AC Classrooms', 'Medical Room', 'Wi-Fi'];

    useEffect(() => {
        fetchSchoolData();
    }, [schoolId]);

    const fetchSchoolData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/schools/${schoolId}/edit`);
            const school = res.data.data;

            setFormData({
                name: school.name,
                address: school.address,
                city: school.city,
                state: school.state,
                area: school.area,
                phone: school.phone || '', // Check for owner phone if school phone missing?
                email: school.email || '',
                website: school.website || '',
                description: school.description || '',
                board: school.board,
                medium: school.medium,
                type: school.type,
                classesOffered: school.classesOffered,
                facilities: school.facilities,
                minFee: school.minFee || '',
                maxFee: school.maxFee || ''
            });
        } catch (err) {
            console.error(err);
            setAlert(err.response?.data?.error || 'Failed to fetch school details', 'error');
            navigate('/dashboard'); // Kick back to dashboard on error
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayToggle = (field, value) => {
        const current = formData[field];
        let updated;
        if (current.includes(value)) {
            updated = current.filter(item => item !== value);
        } else {
            updated = [...current, value];
        }
        setFormData({ ...formData, [field]: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Note: Images are handled separately via upload (omitted for simplicity in this prompt context or handled differently)
            // If images update is required, valid prompt would ask, but we stick to patching the data

            await api.put(`/schools/${schoolId}`, formData);
            setAlert('School details submitted for review successfully!', 'success');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setAlert(err.response?.data?.error || 'Failed to update school', 'error');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '-70px' }}>
                <div className="spinner"></div> // Use your app's spinner
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '100px 20px 40px' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', marginBottom: '20px' }}>
                    <FaArrowLeft /> Back to Dashboard
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card glass-panel"
                    style={{ padding: '2rem' }}
                >
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Complete School Details</h1>
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Please fill in all the details to submit your school for final approval.</p>

                    <form onSubmit={handleSubmit}>
                        {/* Basic Info */}
                        <div className="form-section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaSchool className="text-primary" /> Basic Information
                            </h3>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>School Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label>Website</label>
                                    <input type="url" name="website" value={formData.website} onChange={handleChange} className="input-field" placeholder="https://" />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="form-section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaMapMarkerAlt className="text-primary" /> Location
                            </h3>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Address</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} required className="input-field" rows="3" style={{ resize: 'vertical' }}></textarea>
                            </div>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Area</label>
                                    <input type="text" name="area" value={formData.area} onChange={handleChange} required className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input type="text" name="state" value={formData.state} onChange={handleChange} required className="input-field" />
                                </div>
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div className="form-section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaChalkboardTeacher className="text-primary" /> Academics
                            </h3>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Board</label>
                                    <select name="board" value={formData.board} onChange={handleChange} className="input-field">
                                        {boards.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Medium</label>
                                    <select name="medium" value={formData.medium} onChange={handleChange} className="input-field">
                                        {mediums.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Classes Offered</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {classOptions.map(cls => (
                                        <button
                                            key={cls}
                                            type="button"
                                            onClick={() => handleArrayToggle('classesOffered', cls)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                border: formData.classesOffered.includes(cls) ? '2px solid #2563eb' : '1px solid #e2e8f0',
                                                background: formData.classesOffered.includes(cls) ? '#eff6ff' : 'white',
                                                color: formData.classesOffered.includes(cls) ? '#2563eb' : '#64748b',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Fees & Description */}
                        <div className="form-section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaRupeeSign className="text-primary" /> Fees & Description
                            </h3>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label>Min Fees (Yearly)</label>
                                    <input type="number" name="minFee" value={formData.minFee} onChange={handleChange} required className="input-field" min="0" />
                                </div>
                                <div className="form-group">
                                    <label>Max Fees (Yearly)</label>
                                    <input type="number" name="maxFee" value={formData.maxFee} onChange={handleChange} required className="input-field" min="0" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required className="input-field" rows="4"></textarea>
                            </div>
                        </div>

                        {/* Facilities */}
                        <div className="form-section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaCheck className="text-primary" /> Facilities
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                                {facilityOptions.map(facility => (
                                    <label key={facility} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: formData.facilities.includes(facility) ? '#eff6ff' : '#f8fafc', border: '1px solid', borderColor: formData.facilities.includes(facility) ? '#bfdbfe' : '#f1f5f9' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.facilities.includes(facility)}
                                            onChange={() => handleArrayToggle('facilities', facility)}
                                            style={{ accentColor: '#2563eb' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: '#334155' }}>{facility}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-modern"
                            style={{ width: '100%', padding: '14px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            {submitting ? 'Submitting...' : 'Submit School Details'}
                        </button>

                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default EditSchool;
