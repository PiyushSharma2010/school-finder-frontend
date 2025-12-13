import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import FreeAccessNotice from '../components/common/FreeAccessNotice';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { FaSearch, FaMapMarkerAlt, FaStar, FaCheckCircle, FaArrowRight, FaSchool, FaUserGraduate, FaChalkboardTeacher, FaAward } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/layout.css';
import '../styles/modern-theme.css';

const Home = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [featuredSchools, setFeaturedSchools] = useState([]);

    useEffect(() => {
        const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        setRecentSearches(recent);

        const fetchFeatured = async () => {
            try {
                const res = await api.get('/schools?featured=true&limit=6'); // Increased limit for carousel
                setFeaturedSchools(res.data.data);
            } catch (err) {
                console.error('Failed to fetch featured schools', err);
            }
        };
        fetchFeatured();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            const newRecent = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
            localStorage.setItem('recentSearches', JSON.stringify(newRecent));
            navigate(`/schools?q=${search}`);
        } else {
            navigate(`/schools`);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="home-page" style={{ overflowX: 'hidden' }}>
            {/* Hero Section */}
            <section className="hero hero-content" style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                overflow: 'hidden',
            }}>
                {/* Background Shapes */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 }}
                />
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 }}
                />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center lg:text-left"
                        >
                            <motion.span variants={itemVariants} className="text-gradient" style={{ fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                                Discover Your Future
                            </motion.span>
                            <motion.h1 variants={itemVariants} className="text-4xl lg:text-6xl font-extrabold text-surface-dark mb-6 mt-4 leading-tight lg:leading-snug">
                                Find the <span className="text-gradient">Best Schools</span> Near You
                            </motion.h1>
                            <motion.p variants={itemVariants} className="text-lg text-slate-500 mb-10 max-w-lg mx-auto lg:mx-0">
                                Explore top-rated schools, compare fees, facilities, and reviews to make the best decision for your child's education.
                            </motion.p>

                            <motion.form variants={itemVariants} onSubmit={handleSearch} className="flex gap-2 bg-white p-2 rounded-full shadow-lg max-w-lg mx-auto lg:mx-0 w-full relative z-10">
                                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
                                    <FaMapMarkerAlt color="#94a3b8" />
                                    <input
                                        type="text"
                                        placeholder="Enter City, Area, or School Name..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        style={{ border: 'none', outline: 'none', width: '100%', padding: '10px 15px', fontSize: '1rem', color: '#334155', background: 'transparent' }}
                                    />
                                </div>
                                <button type="submit" className="btn-modern" style={{ padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                                    <FaSearch /> <span className="hidden sm:inline">Search</span>
                                </button>
                            </motion.form>

                            {/* Recent Searches Pills */}
                            {recentSearches.length > 0 && (
                                <motion.div variants={itemVariants} style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.8rem', alignItems: 'center', justifyContent: 'center' }} className="lg:justify-start">
                                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Recent:</span>
                                    {recentSearches.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => navigate(`/schools?q=${item}`)}
                                            style={{
                                                background: 'white', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '20px',
                                                fontSize: '0.85rem', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--neon-blue)'; e.currentTarget.style.color = 'var(--neon-blue)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                                        >
                                            ↺ {item}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Hero Image / Animation Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full mt-12 lg:mt-0 relative"
                            style={{ position: 'relative' }}
                        >
                            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px', position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.6)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
                                        <div style={{ width: '50px', height: '50px', background: 'var(--primary-gradient)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white' }}>
                                            <FaSchool size={24} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>500+</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Top Schools</p>
                                    </div>
                                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', textAlign: 'center', marginTop: '2rem' }}>
                                        <div style={{ width: '50px', height: '50px', background: 'var(--secondary-gradient)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white' }}>
                                            <FaUserGraduate size={24} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>10k+</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Happy Students</p>
                                    </div>
                                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
                                        <div style={{ width: '50px', height: '50px', background: 'var(--accent-gradient)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white' }}>
                                            <FaAward size={24} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>#1</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Trusted Platform</p>
                                    </div>
                                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', textAlign: 'center', marginTop: '2rem' }}>
                                        <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white' }}>
                                            <FaChalkboardTeacher size={24} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>98%</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Satisfaction</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Curved Bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0 }}>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '60px' }}>
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
                    </svg>
                </div>
            </section>

            {/* Trending Searches */}
            <section className="section-padding" style={{ background: 'white' }}>
                <div className="container">
                    <div className="text-center mb-6">
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>Trending Searches</h2>
                        <div style={{ width: '60px', height: '4px', background: 'var(--primary-gradient)', margin: '0 auto', borderRadius: '2px' }}></div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                        {['Delhi', 'Mumbai', 'Bangalore', 'CBSE', 'ICSE', 'International', 'Boarding', 'Play School'].map((item, index) => (
                            <motion.button
                                key={item}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                onClick={() => navigate(`/schools?q=${item}`)}
                                className="glass-card"
                                style={{
                                    padding: '10px 24px', borderRadius: '50px', border: '1px solid #e2e8f0',
                                    fontSize: '1rem', fontWeight: '500', color: '#475569', cursor: 'pointer', background: 'white'
                                }}
                            >
                                {item}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Banner Notice */}
            <section style={{ padding: '2rem 0', background: 'white' }}>
                <FreeAccessNotice />
            </section>

            {/* Featured Schools */}
            <section className="section-padding" style={{ background: '#f8fafc' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
                        <div>
                            <span className="text-gradient" style={{ fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Top Rated</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', marginTop: '0.5rem' }}>Featured Schools</h2>
                        </div>
                        <Link to="/schools" className="btn-modern hidden-mobile" style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }}>View All Schools</Link>
                    </div>

                    {featuredSchools.length > 0 ? (
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            style={{ paddingBottom: '3rem' }}
                        >
                            {featuredSchools.map((school) => (
                                <SwiperSlide key={school._id}>
                                    <motion.div
                                        className="card glass-card"
                                        whileHover={{ y: -10 }}
                                        style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                    >
                                        <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                                            {school.images && school.images.length > 0 ? (
                                                <img src={school.images[0]} alt={school.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FaSchool size={48} color="#94a3b8" />
                                                </div>
                                            )}
                                            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                                <FaStar /> {school.ratingAverage ? school.ratingAverage.toFixed(1) : 'New'}
                                            </div>
                                            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary-gradient)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Featured
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>{school.name}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                                <FaMapMarkerAlt color="#ef4444" />
                                                <span>{school.city}, {school.area}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                                <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500' }}>{school.board}</span>
                                                <span style={{ background: '#f0fdf4', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500' }}>Co-Ed</span>
                                            </div>
                                            <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>View Details</span>
                                                <Link to={`/schools/${school.slug}`} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', transition: 'all 0.2s' }}>
                                                    <FaArrowRight />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="text-center py-10 text-gray-500">Loading featured schools...</div>
                    )}
                </div>
            </section>

            {/* Trust Section - Real School Logos with Marquee */}
            <section className="section-padding" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', overflow: 'hidden' }}>
                <div className="container">
                    <p className="text-center mb-6" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '600' }}>
                        <span className="text-gradient">Trusted by Leading Institutions</span>
                    </p>
                </div>
                <div className="marquee-container" style={{ overflow: 'hidden', position: 'relative' }}>
                    <div className="marquee-content" style={{
                        display: 'flex',
                        gap: '2rem',
                        animation: 'marquee 40s linear infinite',
                        width: 'max-content'
                    }}>
                        {/* First set of logos */}
                        {[
                            { name: 'Delhi Public School', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/DPS-logo.svg/150px-DPS-logo.svg.png' },
                            { name: 'DAV Public School', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/DAV_Logo.svg/150px-DAV_Logo.svg.png' },
                            { name: 'Kendriya Vidyalaya', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Kendriya_Vidyalaya_Sangathan_logo.svg/150px-Kendriya_Vidyalaya_Sangathan_logo.svg.png' },
                            { name: 'Ryan International', logo: 'https://rfrp.in/wp-content/uploads/2022/09/GRACE-RYAN.png' },
                            { name: 'Amity International', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Amity_University_logo.svg/150px-Amity_University_logo.svg.png' },
                            { name: 'Bal Bharati Public', logo: 'https://www.bbpsgkp.com/images/logo.png' },
                            { name: 'Modern School', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b5/Modernschool.jpg' },
                            { name: 'Springdales School', logo: 'https://www.springdales.com/pusa-road/images/logo.png' },
                            { name: 'The Heritage School', logo: 'https://www.theheritageschool.in/assets/images/logo.png' },
                            { name: 'Sanskriti School', logo: 'https://www.sanskritischool.edu.in/images/logo-new.png' },
                            { name: 'Lotus Valley', logo: 'https://lotusvalley.org/wp-content/uploads/2019/09/logo.png' },
                            { name: 'MIS School', logo: 'https://mothersinternational.org/images/logo.png' },
                        ].map((school, i) => (
                            <div key={i} className="glass-panel" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 24px',
                                borderRadius: '16px',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                            }}>
                                <img
                                    src={school.logo}
                                    alt={school.name}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'var(--primary-gradient)',
                                    borderRadius: '8px',
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '0.75rem'
                                }}>
                                    {school.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                                </div>
                                <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>{school.name}</span>
                            </div>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {[
                            { name: 'Delhi Public School', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/DPS-logo.svg/150px-DPS-logo.svg.png' },
                            { name: 'DAV Public School', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/DAV_Logo.svg/150px-DAV_Logo.svg.png' },
                            { name: 'Kendriya Vidyalaya', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Kendriya_Vidyalaya_Sangathan_logo.svg/150px-Kendriya_Vidyalaya_Sangathan_logo.svg.png' },
                            { name: 'Ryan International', logo: 'https://rfrp.in/wp-content/uploads/2022/09/GRACE-RYAN.png' },
                            { name: 'Amity International', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Amity_University_logo.svg/150px-Amity_University_logo.svg.png' },
                            { name: 'Bal Bharati Public', logo: 'https://www.bbpsgkp.com/images/logo.png' },
                        ].map((school, i) => (
                            <div key={`dup-${i}`} className="glass-panel" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 24px',
                                borderRadius: '16px',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                            }}>
                                <img
                                    src={school.logo}
                                    alt={school.name}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'var(--primary-gradient)',
                                    borderRadius: '8px',
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '0.75rem'
                                }}>
                                    {school.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                                </div>
                                <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>{school.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="section-padding" style={{ background: 'white' }}>
                <div className="container">
                    <div className="text-center mb-6">
                        <span className="text-gradient" style={{ fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Why School Finder</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', marginTop: '0.5rem' }}>Why Parents <span className="text-gradient">Love Us</span></h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { icon: '🎯', title: 'Accurate Information', desc: 'Verified school data with real reviews from parents and students.' },
                            { icon: '🔍', title: 'Smart Search', desc: 'AI-powered filters to find the perfect school match for your child.' },
                            { icon: '📊', title: 'Easy Comparison', desc: 'Compare multiple schools side-by-side with detailed metrics.' },
                            { icon: '💬', title: 'Direct Connect', desc: 'Send enquiries directly to school admissions offices.' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="glass-panel"
                                style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    borderRadius: '20px'
                                }}
                            >
                                <div style={{
                                    fontSize: '2.5rem',
                                    marginBottom: '1rem',
                                    width: '70px',
                                    height: '70px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                                    borderRadius: '16px'
                                }}>{item.icon}</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{item.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Using Primary Gradient */}
            <section style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                padding: '5rem 0',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.5
                }} />
                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem' }}>
                            Ready to Find the Perfect School?
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                            Join thousands of parents who have found their ideal school through School Finder.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/schools" className="btn-glass" style={{
                                padding: '1rem 2.5rem',
                                fontSize: '1rem',
                                background: 'white',
                                color: '#6366f1',
                                fontWeight: '700',
                                border: 'none',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}>
                                Browse Schools
                            </Link>
                            <Link to="/register" className="btn-glass" style={{
                                padding: '1rem 2.5rem',
                                fontSize: '1rem',
                                background: 'transparent',
                                color: 'white',
                                fontWeight: '700',
                                border: '2px solid rgba(255,255,255,0.5)'
                            }}>
                                Get Started Free
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding" style={{ background: 'var(--surface-dark)', color: 'white', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="text-center mb-6">
                        <span style={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Testimonials</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', marginTop: '0.5rem' }}>What Parents Say</h2>
                        <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>Hear from thousands of parents who found the perfect school for their children using School Finder.</p>
                    </div>

                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000 }}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        style={{ paddingBottom: '3rem' }}
                    >
                        {[
                            { name: "Priya Sharma", role: "Parent, Delhi", text: "School Finder made it so easy to find the perfect school for my daughter. The comparison tool is a lifesaver!" },
                            { name: "Rahul Verma", role: "Parent, Mumbai", text: "I loved the AI insights. It helped me understand which schools were realistic options for us." },
                            { name: "Anjali Gupta", role: "Parent, Bangalore", text: "The verified badges gave me confidence that the information was accurate. Highly recommended!" },
                            { name: "Suresh Kumar", role: "Parent, Chennai", text: "As a busy professional, I appreciated how quickly I could filter schools by location and fees." },
                            { name: "Meera Patel", role: "Parent, Ahmedabad", text: "The direct enquiry feature saved us so much time. We got responses within 24 hours!" },
                            { name: "Vikram Singh", role: "Parent, Pune", text: "Finally, a platform that gives honest reviews. Found the perfect ICSE school for my son." },
                        ].map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '1rem' }}>
                                        {[1, 2, 3, 4, 5].map(i => <FaStar key={i} size={14} />)}
                                    </div>
                                    <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic', opacity: 0.9 }}>"{testimonial.text}"</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {testimonial.name[0]}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>{testimonial.name}</h4>
                                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{testimonial.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-container:hover .marquee-content {
                    animation-play-state: paused;
                }
                .swiper-pagination-bullet { background: white; opacity: 0.5; }
                .swiper-pagination-bullet-active { background: var(--color-primary); opacity: 1; }
                .hero-search-input::placeholder { color: #94a3b8; }
                
                @media (max-width: 992px) {
                    .hero { padding-top: 60px; min-height: auto; padding-bottom: 80px; }
                    .hero .container { grid-template-columns: 1fr !important; gap: 2rem; text-align: center; padding: 0 1.5rem !important; }
                    .hero h1 { font-size: 2.5rem !important; }
                    .hero p { margin: 0 auto 2rem !important; text-align: center; }
                    .hidden-mobile { display: none !important; }
                }
                
                @media (max-width: 768px) {
                    .hero { padding-top: 40px; padding-bottom: 60px; }
                    .hero .container { padding: 0 1rem !important; }
                    .hero h1 { font-size: 2rem !important; line-height: 1.2 !important; }
                    .hero p { font-size: 1rem !important; }
                    .hero form { flex-direction: column !important; padding: 0.75rem !important; max-width: 100% !important; border-radius: 20px !important; }
                    .hero form > div { padding-left: 0.75rem !important; }
                    .hero form button { width: 100% !important; padding: 0.875rem !important; border-radius: 12px !important; }
                    .section-padding { padding: 3rem 0 !important; }
                    .section-padding h2 { font-size: 1.75rem !important; }
                }
                
                @media (max-width: 480px) {
                    .hero { padding-top: 30px; padding-bottom: 50px; }
                    .hero h1 { font-size: 1.75rem !important; }
                    .hero p { font-size: 0.95rem !important; margin-bottom: 1.5rem !important; }
                    .hero form { padding: 0.5rem !important; }
                    .section-padding { padding: 2rem 0 !important; }
                    .section-padding h2 { font-size: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
};

export default Home;
