import React from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaCheckCircle, FaExchangeAlt, FaArrowRight, FaSchool } from 'react-icons/fa';
import '../styles/modern-theme.css';

const SchoolCard = ({ school }) => {
    const { compareList, addToCompare, removeFromCompare } = useComparison();
    const isComparing = compareList.some(s => s._id === school._id);

    const toggleCompare = (e) => {
        e.preventDefault();
        if (isComparing) {
            removeFromCompare(school._id);
        } else {
            addToCompare(school);
        }
    };

    return (
        <motion.div
            className="card glass-card"
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                padding: 0,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Image Section */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                {school.images && school.images.length > 0 ? (
                    <img
                        src={school.images[0]}
                        alt={school.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.7s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af'
                    }}>
                        <FaSchool size={48} />
                    </div>
                )}

                {/* Badges */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    {school.isVerified && (
                        <span style={{
                            background: 'rgba(59, 130, 246, 0.9)',
                            backdropFilter: 'blur(8px)',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <FaCheckCircle /> Verified
                        </span>
                    )}
                    <span style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        color: '#f59e0b',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <FaStar /> {school.ratingAverage ? school.ratingAverage.toFixed(1) : 'New'}
                    </span>
                </div>

                {/* Board Badge */}
                <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                    <span style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(12px)',
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        {school.board}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s'
                }}
                    onMouseEnter={(e) => e.target.style.color = '#6366f1'}
                    onMouseLeave={(e) => e.target.style.color = '#1f2937'}
                >
                    {school.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <FaMapMarkerAlt style={{ color: '#ef4444', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.city}, {school.area}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                    {school.classesOffered.slice(0, 3).map((cls, idx) => (
                        <span key={idx} style={{
                            padding: '4px 10px',
                            background: '#f3f4f6',
                            color: '#4b5563',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            {cls}
                        </span>
                    ))}
                    {school.classesOffered.length > 3 && (
                        <span style={{
                            padding: '4px 10px',
                            background: '#f3f4f6',
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            +{school.classesOffered.length - 3}
                        </span>
                    )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <button
                        onClick={toggleCompare}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '10px',
                            borderRadius: '10px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            background: isComparing ? '#eef2ff' : 'white',
                            color: isComparing ? '#6366f1' : '#6b7280',
                            border: isComparing ? '1px solid #c7d2fe' : '1px solid #e5e7eb',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            if (!isComparing) {
                                e.target.style.background = '#f9fafb';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isComparing) {
                                e.target.style.background = 'white';
                            }
                        }}
                    >
                        <FaExchangeAlt style={{ color: isComparing ? '#6366f1' : '#9ca3af' }} />
                        {isComparing ? 'Added' : 'Compare'}
                    </button>

                    <Link
                        to={`/schools/${school.slug}`}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '10px',
                            background: '#1f2937',
                            color: 'white',
                            borderRadius: '10px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(31, 41, 55, 0.2)',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#111827';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#1f2937';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Details <FaArrowRight size={12} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default SchoolCard;
