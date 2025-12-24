import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import SchoolCard from '../components/SchoolCard';
import FilterPanel from '../components/FilterPanel';
import ChooseLocationModal from '../components/ChooseLocationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSearch, FaSave, FaTimes, FaLocationArrow } from 'react-icons/fa';
import '../styles/modern-theme.css';

const SchoolsList = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { setAlert } = useAlert();

    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        city: '', board: '', minFee: '', maxFee: '',
        facilities: '', classes: '', sort: '-createdAt'
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        if (q) {
            setFilters(prev => ({ ...prev, city: q }));
        }
        fetchSchools(params.toString());
    }, [location.search]);

    const fetchSchools = async (queryString = '') => {
        try {
            setLoading(true);
            const res = await api.get(`/schools?${queryString}`);
            setSchools(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleManualLocationSearch = (searchCity) => {
        setFilters(prev => ({ ...prev, city: searchCity }));
        setAlert(`Searching schools in ${searchCity}`, 'success');
        fetchSchools(`city=${searchCity}`);
    };

    const handleUseLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Reverse geocoding using a free API (e.g., OpenStreetMap Nominatim)
                    // Note: In production, consider using a more robust service or your own backend proxy
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();

                    const city = data.address.city || data.address.town || data.address.village || data.address.county;
                    const state = data.address.state;

                    if (city) {
                        setFilters(prev => ({ ...prev, city }));
                        setAlert(`Location detected: ${city}, ${state}`, 'success');
                        fetchSchools(`city=${city}`);
                    } else {
                        setAlert('Could not detect city from your location', 'warning');
                    }
                } catch (error) {
                    console.error('Geocoding error:', error);
                    setAlert('Failed to get location details', 'error');
                } finally {
                    setLoading(false);
                }
            }, (error) => {
                console.error('Geolocation error:', error);
                setAlert('Location access denied or unavailable', 'error');
                setLoading(false);
            });
        } else {
            setAlert('Geolocation is not supported by this browser.', 'error');
        }
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        fetchSchools(params.toString());
        setShowFilters(false);
    };

    const handleSaveSearch = async () => {
        if (!searchName.trim()) {
            setAlert('Please enter a name for this search', 'warning');
            return;
        }
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });
            const url = `/schools?${params.toString()}`;

            await api.post('/auth/saved-searches', {
                name: searchName,
                filters,
                url
            });
            setAlert('Search saved successfully', 'success');
            setSearchName('');
        } catch (err) {
            setAlert('Failed to save search', 'error');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '100px', paddingBottom: '3rem' }}>
            <div className="container" style={{ maxWidth: '1400px' }}>

                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                                Browse <span className="text-gradient">Schools</span>
                            </h1>
                            <p style={{ color: '#6b7280' }}>Find the perfect school for your child's future</p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn btn-outline"
                                onClick={() => setIsLocationModalOpen(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <FaLocationArrow /> Choose Location
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowFilters(true)}
                                style={{ display: 'none' }}
                                id="mobile-filter-btn"
                            >
                                <FaFilter style={{ marginRight: '8px' }} /> Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="schools-layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Sidebar - Desktop */}
                    <div id="desktop-sidebar">
                        <FilterPanel
                            filters={filters}
                            setFilters={setFilters}
                            onApply={handleApplyFilters}
                        />

                        {isAuthenticated && (
                            <div className="card glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                                <h4 style={{ fontWeight: '700', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaSave style={{ color: '#6366f1' }} /> Save Search
                                </h4>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Give this search a name..."
                                        className="form-input"
                                        value={searchName}
                                        onChange={e => setSearchName(e.target.value)}
                                        style={{ marginBottom: '0.75rem' }}
                                    />
                                    <button
                                        onClick={handleSaveSearch}
                                        className="btn btn-outline btn-block"
                                        style={{ fontSize: '0.875rem' }}
                                    >
                                        Save Current Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Mobile Overlay */}
                    <AnimatePresence>
                        {showFilters && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        position: 'fixed',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.5)',
                                        zIndex: 40
                                    }}
                                    onClick={() => setShowFilters(false)}
                                />
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        height: '100%',
                                        width: '320px',
                                        background: 'white',
                                        zIndex: 50,
                                        overflowY: 'auto',
                                        boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
                                        padding: '1rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#000000' }}>Filters</h3>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            style={{
                                                padding: '0.5rem',
                                                background: '#f3f4f6',
                                                borderRadius: '50%',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <FilterPanel
                                        filters={filters}
                                        setFilters={setFilters}
                                        onApply={handleApplyFilters}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Results Grid */}
                    <div style={{ width: '100%' }}>
                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', justifyContent: 'center' }}>
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="card" style={{ height: '400px', background: '#f3f4f6', animation: 'pulse 2s infinite' }}></div>
                                ))}
                            </div>
                        ) : schools.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', justifyContent: 'center' }}>
                                {schools.map((school, index) => (
                                    <motion.div
                                        key={school._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        style={{ height: '100%' }}
                                    >
                                        <SchoolCard school={school} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="card glass-panel text-center" style={{ padding: '5rem 2rem' }}>
                                <div style={{
                                    width: '96px',
                                    height: '96px',
                                    background: '#eef2ff',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    color: '#c7d2fe'
                                }}>
                                    <FaSearch size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>No Schools Found</h3>
                                <p style={{ color: '#6b7280', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                                    We couldn't find any schools matching your current filters. Try adjusting your search criteria.
                                </p>
                                <button
                                    onClick={() => {
                                        setFilters({
                                            city: '', board: '', minFee: '', maxFee: '',
                                            facilities: '', classes: '', sort: '-createdAt'
                                        });
                                        fetchSchools();
                                    }}
                                    className="btn btn-primary"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <ChooseLocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onUseCurrentLocation={handleUseLocation}
                onManualSearch={handleManualLocationSearch}
            />

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @media (max-width: 992px) {
                    .schools-layout {
                        grid-template-columns: 1fr !important;
                    }
                    #desktop-sidebar { display: none; }
                    #mobile-filter-btn { display: flex !important; }
                }
            `}</style>
        </div>
    );
};

export default SchoolsList;
