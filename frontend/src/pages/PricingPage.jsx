import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaCrown, FaRocket } from 'react-icons/fa';
import FreeAccessNotice from '../components/common/FreeAccessNotice';
import '../styles/modern-theme.css';

const PricingPage = () => {
    const plans = [
        {
            name: 'Basic',
            price: '₹0',
            period: '/ month',
            icon: FaRocket,
            color: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
            features: [
                { text: 'Basic School Profile', included: true },
                { text: 'Receive Enquiries', included: true },
                { text: 'Respond to Reviews', included: true },
                { text: 'Verified Badge', included: false },
                { text: 'Featured Listing', included: false }
            ],
            cta: 'Get Started',
            link: '/register',
            popular: false
        },
        {
            name: 'Pro',
            price: '₹XXX',
            period: '/ month',
            icon: FaCrown,
            color: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            features: [
                { text: 'Verified Badge', included: true, highlight: true },
                { text: 'Enhanced Profile with Gallery', included: true },
                { text: 'Priority Support', included: true },
                { text: 'Analytics Dashboard', included: true },
                { text: '5 Featured Days/Month', included: true }
            ],
            cta: 'Coming Soon',
            link: '/register',
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            icon: FaRocket,
            color: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            features: [
                { text: 'Multiple Branch Management', included: true },
                { text: 'Dedicated Account Manager', included: true },
                { text: 'API Access', included: true },
                { text: 'Custom Branding', included: true },
                { text: 'Unlimited Featured Listings', included: true }
            ],
            cta: 'Contact Sales',
            link: '/contact',
            popular: false
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '100px', paddingBottom: '3rem' }}>
            <div className="container" style={{ maxWidth: '1400px' }}>

                <FreeAccessNotice style={{ marginBottom: '3rem' }} />

                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem' }}
                    >
                        Simple, <span className="text-gradient">Transparent</span> Pricing
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}
                    >
                        Choose the plan that fits your school's needs. No hidden fees, cancel anytime.
                    </motion.p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card glass-panel"
                            whileHover={{ y: -8 }}
                            style={{
                                padding: '2rem',
                                position: 'relative',
                                border: plan.popular ? '2px solid #6366f1' : '1px solid #e5e7eb',
                                boxShadow: plan.popular ? '0 20px 40px rgba(99, 102, 241, 0.15)' : '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-16px',
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                }}>
                                    <span style={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        color: 'white',
                                        padding: '4px 16px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                    }}>
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center" style={{ marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: plan.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    color: 'white'
                                }}>
                                    <plan.icon size={28} />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>{plan.name}</h2>
                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827' }}>{plan.price}</span>
                                    {plan.period && <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{plan.period}</span>}
                                </div>
                            </div>

                            <ul style={{ marginBottom: '2rem' }}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '0.75rem' }}>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            marginTop: '2px',
                                            background: feature.included ? '#dcfce7' : '#f3f4f6',
                                            color: feature.included ? '#16a34a' : '#9ca3af'
                                        }}>
                                            {feature.included ? <FaCheck size={10} /> : '✗'}
                                        </div>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: feature.included ? '#4b5563' : '#9ca3af',
                                            fontWeight: feature.highlight ? '700' : '400'
                                        }}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link to={plan.link}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={plan.popular ? 'btn btn-primary btn-block' : 'btn btn-outline btn-block'}
                                    style={{
                                        padding: '0.875rem',
                                        boxShadow: plan.popular ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
                                    }}
                                >
                                    {plan.cta}
                                </motion.button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                    style={{ marginTop: '3rem', color: '#6b7280', fontSize: '0.875rem' }}
                >
                    <p>All plans include basic features. Need a custom solution? <Link to="/contact" style={{ color: '#6366f1', fontWeight: '500' }}>Contact us</Link></p>
                </motion.div>

                {/* Feature Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ marginTop: '4rem' }}
                >
                    <h2 className="text-center" style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '2rem' }}>
                        Detailed <span className="text-gradient">Feature Comparison</span>
                    </h2>

                    <div className="card glass-panel" style={{ overflow: 'auto', maxWidth: '1000px', margin: '0 auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#1f2937', borderBottom: '2px solid #e5e7eb' }}>Feature</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#6b7280', borderBottom: '2px solid #e5e7eb' }}>Basic (Free)</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#6366f1', borderBottom: '2px solid #6366f1', background: 'rgba(99, 102, 241, 0.05)' }}>Pro ₹XXX/mo</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#3b82f6', borderBottom: '2px solid #e5e7eb' }}>Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: '📄 School Profile', basic: '✓', pro: '✓ Enhanced', enterprise: '✓ Custom' },
                                    { feature: '📸 Photo Gallery', basic: '3 images', pro: '10 images', enterprise: 'Unlimited' },
                                    { feature: '📩 Receive Enquiries', basic: '✓', pro: '✓', enterprise: '✓' },
                                    { feature: '💬 Reply to Reviews', basic: '✓', pro: '✓', enterprise: '✓' },
                                    { feature: '✅ Verified Badge', basic: '✗', pro: '✓', enterprise: '✓' },
                                    { feature: '⭐ Featured Listing', basic: '✗', pro: '5 days/month', enterprise: 'Unlimited' },
                                    { feature: '📊 Analytics Dashboard', basic: '✗', pro: '✓ Basic', enterprise: '✓ Advanced' },
                                    { feature: '📧 Email Notifications', basic: '✓', pro: '✓', enterprise: '✓' },
                                    { feature: '🏢 Multi-branch Support', basic: '✗', pro: '✗', enterprise: '✓' },
                                    { feature: '👤 Dedicated Manager', basic: '✗', pro: '✗', enterprise: '✓' },
                                    { feature: '🔌 API Access', basic: '✗', pro: '✗', enterprise: '✓' },
                                    { feature: '🎨 Custom Branding', basic: '✗', pro: '✗', enterprise: '✓' },
                                    { feature: '📞 Priority Support', basic: '✗', pro: '✓', enterprise: '✓ 24/7' },
                                ].map((row, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '0.875rem 1rem', fontWeight: '500', color: '#374151' }}>{row.feature}</td>
                                        <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: row.basic === '✗' ? '#d1d5db' : '#16a34a' }}>{row.basic}</td>
                                        <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: row.pro === '✗' ? '#d1d5db' : '#6366f1', fontWeight: '500', background: 'rgba(99, 102, 241, 0.02)' }}>{row.pro}</td>
                                        <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: row.enterprise === '✗' ? '#d1d5db' : '#3b82f6' }}>{row.enterprise}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Money-back Guarantee */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="card glass-panel text-center"
                    style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #a7f3d0' }}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#065f46', marginBottom: '0.5rem' }}>30-Day Money-Back Guarantee</h3>
                    <p style={{ color: '#047857', maxWidth: '500px', margin: '0 auto' }}>
                        Not satisfied? Get a full refund within 30 days of purchase. No questions asked.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PricingPage;
