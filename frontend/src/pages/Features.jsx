import React from 'react';
import '../styles/layout.css';

const Features = () => {
    const features = [
        {
            icon: '🔍',
            title: 'Smart Search',
            description: 'Find schools based on precise criteria like location, curriculum, fee range, and facilities.'
        },
        {
            icon: '🤖',
            title: 'AI Insights',
            description: 'Get intelligent summaries and admission probability predictions based on school data.'
        },
        {
            icon: '⚖️',
            title: 'Comparison Tool',
            description: 'Compare multiple schools side-by-side to make informed decisions.'
        },
        {
            icon: '✅',
            title: 'Verified Schools',
            description: 'Look for the verified badge to ensure authentic and up-to-date school information.'
        },
        {
            icon: '📝',
            title: 'Personal Notes',
            description: 'Save private notes about schools to keep track of your thoughts and visits.'
        },
        {
            icon: '📊',
            title: 'Analytics',
            description: 'School admins get detailed insights into profile views and enquiry trends.'
        }
    ];

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Platform Features</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                    Everything you need to find, compare, and connect with the best schools.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {features.map((feature, index) => (
                    <div key={index} className="card" style={{ transition: 'transform 0.2s' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>{feature.title}</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;
