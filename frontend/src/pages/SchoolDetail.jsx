import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useComparison } from '../context/ComparisonContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaHeart, FaRegHeart, FaExchangeAlt, FaCheckCircle, FaPhone, FaEnvelope, FaUserTie, FaImages, FaChalkboardTeacher, FaMoneyBillWave, FaBuilding, FaExclamationTriangle, FaFlag } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../styles/modern-theme.css';
import '../styles/pages/school-detail.css';

const SchoolDetail = () => {
    const { slug } = useParams();
    const { user, isAuthenticated } = useAuth();
    const { setAlert } = useAlert();
    const { compareList, addToCompare, removeFromCompare } = useComparison();

    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [similarSchools, setSimilarSchools] = useState([]);
    const [insights, setInsights] = useState(null);
    const [totalSchoolsCount, setTotalSchoolsCount] = useState(0);

    // Forms state
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', message: '' });

    // Favourites & Lightbox state
    const [isFavourited, setIsFavourited] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchSchoolData();
    }, [slug]);

    const fetchSchoolData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/schools/${slug}`);
            const schoolData = res.data.data;
            setSchool(schoolData);

            // Fetch reviews
            const reviewsRes = await api.get(`/schools/${schoolData._id}/reviews`);
            setReviews(reviewsRes.data.data);

            // Fetch similar schools
            const similarRes = await api.get(`/schools/${schoolData._id}/similar`);
            setSimilarSchools(similarRes.data.data);

            // Fetch AI Insights
            try {
                const insightsRes = await api.get(`/schools/${schoolData._id}/insights`);
                setInsights(insightsRes.data.data);
            } catch (e) {
                console.error('Failed to fetch insights', e);
            }

            // Check if favourited
            if (isAuthenticated) {
                try {
                    const favRes = await api.get('/favourites');
                    const isFav = favRes.data.data.some(f => f.school._id === schoolData._id);
                    setIsFavourited(isFav);
                } catch (e) {
                    console.error(e);
                }
            }

            // Fetch total schools count for platform stats
            try {
                const countRes = await api.get('/schools?limit=1');
                setTotalSchoolsCount(countRes.data.count || 0);
            } catch (e) {
                console.error('Failed to fetch total count', e);
            }

            // Save to Recently Viewed (LocalStorage)
            const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const newRecent = [
                { _id: schoolData._id, name: schoolData.name, city: schoolData.city, slug: schoolData.slug },
                ...recent.filter(s => s._id !== schoolData._id)
            ].slice(0, 5);
            localStorage.setItem('recentlyViewed', JSON.stringify(newRecent));

        } catch (err) {
            console.error(err);
            setAlert('Failed to load school data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavourite = async () => {
        if (!isAuthenticated) {
            setAlert('Please login to add favourites', 'warning');
            return;
        }
        try {
            const res = await api.post(`/favourites/${school._id}`);
            // Use API response for reliable state
            setIsFavourited(res.data.isFavorited);
            setAlert(res.data.isFavorited ? 'Added to favourites' : 'Removed from favourites', 'success');
        } catch (err) {
            setAlert('Failed to update favourites', 'error');
        }
    };

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setAlert('Please login to leave a review', 'warning');
            return;
        }
        try {
            await api.post(`/schools/${school._id}/reviews`, reviewForm);
            setAlert('Review submitted successfully', 'success');
            setReviewForm({ rating: 5, comment: '' });
            fetchSchoolData(); // Refresh data
        } catch (err) {
            setAlert(err.response?.data?.error || 'Failed to submit review', 'error');
        }
    };

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/enquiries', { ...enquiryForm, schoolId: school._id });
            setAlert('Enquiry sent successfully', 'success');
            setEnquiryForm({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            setAlert(err.response?.data?.error || 'Failed to send enquiry', 'error');
        }
    };

    // Notes Logic
    const [notes, setNotes] = useState([]);
    const [noteForm, setNoteForm] = useState('');

    const fetchNotes = async () => {
        if (!isAuthenticated || !school) return;
        try {
            const res = await api.get(`/notes/school/${school._id}`);
            setNotes(res.data.data);
        } catch (err) {
            console.error('Failed to fetch notes', err);
        }
    };

    useEffect(() => {
        if (school && isAuthenticated) {
            fetchNotes();
        }
    }, [school, isAuthenticated]);

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/notes', { school: school._id, noteText: noteForm });
            setAlert('Note added', 'success');
            setNoteForm('');
            fetchNotes();
        } catch (err) {
            setAlert('Failed to add note', 'error');
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await api.delete(`/notes/${noteId}`);
            setAlert('Note deleted', 'success');
            fetchNotes();
        } catch (err) {
            setAlert('Failed to delete note', 'error');
        }
    };

    const isComparing = school && compareList.some(s => s._id === school._id);
    const toggleCompare = () => {
        if (isComparing) {
            removeFromCompare(school._id);
            setAlert('Removed from comparison', 'info');
        } else {
            addToCompare(school);
            setAlert('Added to comparison', 'success');
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
    );

    if (!school) return <div className="loading-container">School not found</div>;

    return (
        <div className="school-detail-page">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-overlay" />
                {school.images && school.images.length > 0 ? (
                    <img src={school.images[0]} alt={school.name} className="hero-image" />
                ) : (
                    <div className="hero-placeholder">
                        <FaImages className="hero-placeholder-icon" />
                    </div>
                )}
                <div className="hero-content">
                    <div className="hero-container">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="hero-title"
                        >
                            {school.name}
                        </motion.h1>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="hero-badges"
                        >
                            <span className="hero-badge-item"><FaMapMarkerAlt /> {school.address}, {school.city}</span>
                            <span className="rating-badge">
                                <FaStar className="text-yellow-400" style={{ color: '#facc15' }} /> {school.ratingAverage?.toFixed(1)} ({school.ratingCount} reviews)
                            </span>
                            <span className="board-badge">
                                {school.board}
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="main-container">
                <div className="content-grid">
                    {/* Main Content */}
                    <div className="main-content">

                        {/* Quick Actions Bar */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="quick-actions-bar"
                        >
                            <div className="action-buttons">
                                <button
                                    onClick={toggleCompare}
                                    className={`btn-action btn-compare ${isComparing ? 'active' : ''}`}
                                >
                                    <FaExchangeAlt /> {isComparing ? 'Remove Compare' : 'Add to Compare'}
                                </button>
                                <button
                                    onClick={toggleFavourite}
                                    className={`btn-action btn-favourite ${isFavourited ? 'active' : ''}`}
                                >
                                    {isFavourited ? <FaHeart /> : <FaRegHeart />} {isFavourited ? 'Favourited' : 'Favourite'}
                                </button>
                            </div>
                            {school.isVerified && (
                                <div className="verified-status">
                                    <FaCheckCircle /> Verified School
                                </div>
                            )}
                        </motion.div>

                        {/* AI Summary */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="ai-summary-card"
                        >
                            <h3 className="ai-title">
                                ✨ AI Summary
                            </h3>
                            <p className="ai-text">
                                {insights ? insights.summary : 'Generating insights...'}
                            </p>
                        </motion.div>

                        {/* Overview & Gallery */}
                        <div className="overview-panel">
                            <h2 className="section-heading">Overview</h2>
                            <p className="description-text">{school.description}</p>

                            {school.images && school.images.length > 0 && (
                                <div className="gallery-container">
                                    <h3 className="subsection-title"><FaImages style={{ color: '#3b82f6' }} /> Gallery</h3>
                                    <Swiper
                                        modules={[Navigation, Pagination, EffectFade]}
                                        effect="fade"
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        navigation
                                        pagination={{ clickable: true }}
                                        className="gallery-swiper"
                                    >
                                        {school.images.map((photo, idx) => (
                                            <SwiperSlide key={idx}>
                                                <img
                                                    src={photo}
                                                    alt={`School ${idx + 1}`}
                                                    className="swiper-image"
                                                    onClick={() => openLightbox(idx)}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            )}

                            <div className="facilities-grid">
                                <div>
                                    <h3 className="subsection-title"><FaBuilding style={{ color: '#3b82f6' }} /> Facilities</h3>
                                    <div className="tag-container">
                                        {school.facilities.map((fac, idx) => (
                                            <span key={idx} className="tag tag-blue">
                                                {fac}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="subsection-title"><FaChalkboardTeacher style={{ color: '#22c55e' }} /> Classes Offered</h3>
                                    <div className="tag-container">
                                        {school.classesOffered.map((cls, idx) => (
                                            <span key={idx} className="tag tag-green">
                                                {cls}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="fee-card">
                                <h3 className="fee-title"><FaMoneyBillWave /> Fee Structure</h3>
                                <p className="fee-amount">₹{school.minFee.toLocaleString()} - ₹{school.maxFee.toLocaleString()} <span className="fee-period">per year</span></p>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="reviews-panel">
                            <div className="reviews-header">
                                <h2 className="section-heading" style={{ margin: 0, border: 'none' }}>Reviews & Ratings</h2>
                                <div className="rating-summary">
                                    <FaStar /> {school.ratingAverage?.toFixed(1)} <span className="rating-total">/ 5.0</span>
                                </div>
                            </div>

                            {reviews.length > 0 ? (
                                <div className="reviews-list">
                                    {reviews.map(review => (
                                        <motion.div
                                            key={review._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            className="review-card"
                                        >
                                            <div className="review-card-header">
                                                <div className="reviewer-info">
                                                    <div className="reviewer-avatar">
                                                        {review.user?.name?.charAt(0) || 'A'}
                                                    </div>
                                                    {review.user?.name || 'Anonymous'}
                                                </div>
                                                <div className="review-stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} style={{ color: i < review.rating ? '#facc15' : '#d1d5db' }} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="review-text">{review.comment}</p>
                                            <div className="review-date">{new Date(review.createdAt).toLocaleDateString()}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-reviews">No reviews yet. Be the first to review!</div>
                            )}

                            {isAuthenticated && (
                                <div className="write-review-section">
                                    <h3 className="subsection-title">Write a Review</h3>
                                    <form onSubmit={handleReviewSubmit} className="review-form">
                                        <div className="form-group">
                                            <label className="form-label">Rating</label>
                                            <select
                                                className="form-select"
                                                value={reviewForm.rating}
                                                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                                            >
                                                <option value="5">5 - Excellent</option>
                                                <option value="4">4 - Good</option>
                                                <option value="3">3 - Average</option>
                                                <option value="2">2 - Poor</option>
                                                <option value="1">1 - Terrible</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Comment</label>
                                            <textarea
                                                className="form-textarea"
                                                rows="3"
                                                value={reviewForm.comment}
                                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                required
                                                placeholder="Share your experience..."
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn-submit">Submit Review</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="sidebar">
                        {/* Enquiry Form */}
                        <div className="enquiry-card">
                            <h3 className="enquiry-title">
                                <FaEnvelope style={{ color: '#3b82f6' }} /> Admission Enquiry
                            </h3>
                            <form onSubmit={handleEnquirySubmit} className="review-form">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={enquiryForm.name}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                                        required
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={enquiryForm.email}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                                        required
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={enquiryForm.phone}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                                        required
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        className="form-textarea"
                                        rows="3"
                                        value={enquiryForm.message}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                                        required
                                        placeholder="I am interested in admission for class..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-enquiry">
                                    Send Enquiry
                                </button>
                            </form>
                        </div>

                        {/* School Admin Contact */}
                        <div className="admin-card">
                            <h3 className="subsection-title">
                                <FaUserTie style={{ color: '#4b5563' }} /> School Administration
                            </h3>
                            <div className="admin-info">
                                <div className="admin-row">
                                    <span className="admin-label">Admin Name: </span>
                                    <span className="admin-value">{school.owner?.name || 'N/A'}</span>
                                </div>
                                <div className="admin-row">
                                    <span className="admin-label">Email: </span>
                                    <a href={`mailto:${school.owner?.email}`} className="admin-link">
                                        {school.owner?.email || 'N/A'}
                                    </a>
                                </div>
                                {school.owner?.phone && (
                                    <div className="admin-row">
                                        <span className="admin-label">Phone: </span>
                                        <span className="admin-value">{school.owner.phone}</span>
                                    </div>
                                )}

                            </div>
                            {/* Platform Stats Badge */}
                            <div style={{
                                marginTop: '1rem',
                                padding: '0.75rem 1rem',
                                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                borderRadius: '10px',
                                border: '1px solid #bfdbfe',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '800',
                                    fontSize: '0.9rem'
                                }}>
                                    🏫
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Total Schools on Platform</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e40af', margin: 0 }}>{totalSchoolsCount}+ Schools</p>
                                </div>
                            </div>
                        </div>

                        {/* Rank Predictor */}
                        <div className="rank-card">
                            <h3 className="rank-title">
                                🏆 Rank Predictor
                            </h3>
                            <p className="description-text" style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>Based on your profile, your admission chance is:</p>
                            {insights ? (
                                <div>
                                    <div className="progress-bar">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${insights.admissionChance}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="progress-fill"
                                        />
                                    </div>
                                    <p style={{ textAlign: 'right', fontSize: '0.875rem', fontWeight: '700', color: '#db2777' }}>
                                        {insights.admissionChance}% {insights.admissionLabel}
                                    </p>
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Calculating...</p>
                            )}
                        </div>

                        {/* Private Notes */}
                        {isAuthenticated && (
                            <div className="notes-card">
                                <h3 className="notes-title">
                                    📝 My Notes
                                </h3>
                                <p style={{ fontSize: '0.75rem', color: '#d97706', marginBottom: '1rem' }}>Private notes only visible to you.</p>

                                {notes.length > 0 && (
                                    <div className="notes-list">
                                        {notes.map(note => (
                                            <div key={note._id} className="note-item">
                                                <p style={{ fontSize: '0.875rem', color: '#374151', whiteSpace: 'pre-wrap' }}>{note.noteText}</p>
                                                <button
                                                    onClick={() => handleDeleteNote(note._id)}
                                                    className="delete-note"
                                                    title="Delete Note"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <form onSubmit={handleNoteSubmit} className="note-form">
                                    <textarea
                                        className="form-input"
                                        style={{ fontSize: '0.875rem', minHeight: '40px', padding: '0.5rem' }}
                                        rows="1"
                                        placeholder="Add a note..."
                                        value={noteForm}
                                        onChange={(e) => setNoteForm(e.target.value)}
                                        required
                                    ></textarea>
                                    <button type="submit" className="btn-add-note">
                                        Add
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Similar Schools */}
                        {similarSchools.length > 0 && (
                            <div className="similar-schools-section">
                                <h3 className="subsection-title">Similar Schools</h3>
                                <div>
                                    {similarSchools.map(simSchool => (
                                        <Link key={simSchool._id} to={`/schools/${simSchool.slug}`} style={{ textDecoration: 'none' }}>
                                            <div className="similar-card">
                                                <h4 className="similar-name">{simSchool.name}</h4>
                                                <p className="similar-location">{simSchool.area}, {simSchool.city}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Report / Claim */}
                        <div className="report-section">
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Is this your school?</p>
                            <button className="btn-claim" onClick={() => setAlert('Claim request sent! We will contact you.', 'success')}>
                                Claim this School
                            </button>
                            <button className="btn-report" onClick={() => setAlert('Report submitted for review.', 'info')}>
                                <FaFlag /> Report this School
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lightbox-overlay"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <img
                            src={school.images[currentImageIndex]}
                            alt="Full view"
                            className="lightbox-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
                            &times;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SchoolDetail;
