import React from 'react';
import ComparisonTable from '../components/ComparisonTable';
import '../styles/modern-theme.css';

const Compare = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '100px', paddingBottom: '3rem' }}>
            <div className="container" style={{ maxWidth: '1400px' }}>
                <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem' }}>
                        Compare <span className="text-gradient">Schools</span>
                    </h1>
                    <p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
                        Compare up to 4 schools side by side to make the best decision for your child.
                    </p>
                </div>
                <ComparisonTable />
            </div>
        </div>
    );
};

export default Compare;
