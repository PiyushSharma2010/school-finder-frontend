import React from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { FaTimes, FaTrash, FaStar, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/modern-theme.css';

const ComparisonTable = () => {
    const { compareList, removeFromCompare, clearCompare } = useComparison();

    if (compareList.length === 0) {
        return (
            <div className="card glass-panel text-center" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#eef2ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: '#c7d2fe'
                }}>
                    <FaCheckCircle size={40} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>No schools selected</h3>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    Browse schools and click the "Compare" button to add them here.
                </p>
                <Link to="/schools" className="btn btn-primary">
                    Browse Schools
                </Link>
            </div>
        );
    }

    return (
        <div className="card glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{
                                padding: '1.5rem',
                                textAlign: 'left',
                                width: '250px',
                                background: 'rgba(249, 250, 251, 0.5)',
                                borderBottom: '2px solid #e5e7eb'
                            }}>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Features</span>
                                <button
                                    onClick={clearCompare}
                                    style={{
                                        color: '#ef4444',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                                    onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                                >
                                    <FaTrash size={12} /> Clear All
                                </button>
                            </th>
                            {compareList.map(school => (
                                <th key={school._id} style={{
                                    padding: '1.5rem',
                                    textAlign: 'left',
                                    minWidth: '250px',
                                    borderBottom: '2px solid #e5e7eb',
                                    position: 'relative'
                                }}>
                                    <button
                                        onClick={() => removeFromCompare(school._id)}
                                        style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            color: '#9ca3af',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                        onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                                    >
                                        <FaTimes />
                                    </button>
                                    <div style={{ paddingRight: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.25rem' }}>{school.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: '#6b7280' }}>
                                            <FaMapMarkerAlt size={12} /> {school.city}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#4b5563', background: 'rgba(249, 250, 251, 0.3)', borderBottom: '1px solid #f3f4f6' }}>Rating</td>
                            {compareList.map(school => (
                                <td key={school._id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: '700' }}>
                                        <FaStar /> {school.ratingAverage?.toFixed(1) || 'N/A'}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#4b5563', background: 'rgba(249, 250, 251, 0.3)', borderBottom: '1px solid #f3f4f6' }}>Board</td>
                            {compareList.map(school => (
                                <td key={school._id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        background: '#eef2ff',
                                        color: '#6366f1',
                                        borderRadius: '20px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }}>
                                        {school.board}
                                    </span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#4b5563', background: 'rgba(249, 250, 251, 0.3)', borderBottom: '1px solid #f3f4f6' }}>Annual Fee</td>
                            {compareList.map(school => (
                                <td key={school._id} style={{ padding: '1rem 1.5rem', fontWeight: '500', color: '#1f2937', borderBottom: '1px solid #f3f4f6' }}>
                                    ₹{school.minFee?.toLocaleString()} - ₹{school.maxFee?.toLocaleString()}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#4b5563', background: 'rgba(249, 250, 251, 0.3)', borderBottom: '1px solid #f3f4f6' }}>Facilities</td>
                            {compareList.map(school => (
                                <td key={school._id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {school.facilities.slice(0, 5).map((fac, idx) => (
                                            <span key={idx} style={{
                                                padding: '4px 10px',
                                                background: '#f3f4f6',
                                                color: '#4b5563',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem'
                                            }}>
                                                {fac}
                                            </span>
                                        ))}
                                        {school.facilities.length > 5 && (
                                            <span style={{
                                                padding: '4px 10px',
                                                background: '#f3f4f6',
                                                color: '#9ca3af',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem'
                                            }}>
                                                +{school.facilities.length - 5}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem 1.5rem', background: 'rgba(249, 250, 251, 0.3)' }}></td>
                            {compareList.map(school => (
                                <td key={school._id} style={{ padding: '1.5rem' }}>
                                    <Link
                                        to={`/schools/${school.slug}`}
                                        className="btn btn-primary btn-block"
                                        style={{ fontSize: '0.875rem', padding: '0.75rem' }}
                                    >
                                        View Details
                                    </Link>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonTable;
