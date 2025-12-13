import React from 'react';
import '../styles/layout.css';

const HowItWorks = () => {
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>How School Finder Works</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                    Finding the perfect school for your child has never been easier. Follow these simple steps to get started.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Step 1 */}
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', background: '#dbeafe', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1.5rem' }}>1</div>
                    <h3 style={{ marginBottom: '1rem' }}>Search & Filter</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Use our advanced filters to find schools by location, board (CBSE, ICSE, IB), fees, and facilities.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', background: '#fce7f3', color: '#db2777', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1.5rem' }}>2</div>
                    <h3 style={{ marginBottom: '1rem' }}>Compare & Analyze</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Compare up to 4 schools side-by-side. Use our AI insights to understand admission chances and key strengths.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1.5rem' }}>3</div>
                    <h3 style={{ marginBottom: '1rem' }}>Connect & Apply</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Contact schools directly through our platform, schedule visits, and track your application status.
                    </p>
                </div>
            </div>

            <div style={{ marginTop: '6rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>For Schools & Admins</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Manage Your Presence</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#2563eb' }}>✓</span> Update school details and photos
                            </li>
                            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#2563eb' }}>✓</span> Respond to parent enquiries
                            </li>
                            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#2563eb' }}>✓</span> Track analytics and views
                            </li>
                        </ul>
                    </div>
                    <div className="card" style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' }}>
                        Admin Dashboard Preview
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
