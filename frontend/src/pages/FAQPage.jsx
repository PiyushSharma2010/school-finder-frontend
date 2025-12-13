import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/modern-theme.css';

const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "Is School Finder free for parents?",
            answer: "Yes! Parents can search, compare, and contact schools completely free of charge. Our platform is designed to help you make the best educational decisions for your children without any cost."
        },
        {
            question: "How do I list my school?",
            answer: "Simply click on 'Register' and select 'School Admin' during registration. Once you verify your email, you can start building your school profile, add photos, and manage enquiries."
        },
        {
            question: "What does the 'Verified' badge mean?",
            answer: "The Verified badge indicates that we have manually verified the school's credentials and existence, providing an extra layer of trust for parents. This includes verification of registration documents and physical address."
        },
        {
            question: "Can I edit my review after posting?",
            answer: "Currently, reviews cannot be edited to ensure authenticity and prevent manipulation. However, you can delete your review and post a new one if needed. This policy helps maintain trust in our review system."
        },
        {
            question: "How are school ratings calculated?",
            answer: "Ratings are an average of all user-submitted reviews. We use a weighted average system that considers factors like review recency and reviewer credibility to ensure fairness and accuracy."
        },
        {
            question: "Can I compare multiple schools?",
            answer: "Absolutely! You can compare up to 4 schools side by side. Just click the 'Compare' button on any school card, and they'll be added to your comparison list. You can then view detailed comparisons of fees, facilities, ratings, and more."
        },
        {
            question: "How do I contact a school?",
            answer: "Each school profile has an enquiry form. Simply fill in your details and message, and the school will receive your enquiry directly. You can track all your enquiries from your dashboard."
        },
        {
            question: "What payment methods do you accept?",
            answer: "For school subscriptions, we accept all major credit/debit cards, UPI, and net banking. All payments are processed securely through our payment gateway partners."
        },
        {
            question: "How do I save my favorite schools?",
            answer: "When viewing a school profile, click the heart icon to add it to your favorites. You can access all your saved schools from your dashboard under 'Favourites'. This helps you keep track of schools you're interested in."
        },
        {
            question: "Is there a mobile app available?",
            answer: "Currently, School Finder is a responsive web application that works seamlessly on mobile browsers. We are working on dedicated iOS and Android apps that will be available soon with additional features."
        },
        {
            question: "How accurate is the school information?",
            answer: "We strive to maintain accurate and up-to-date information. School admins can update their profiles anytime. We also encourage parents to report any discrepancies they notice through the Report feature on school pages."
        },
        {
            question: "Can I save my search preferences?",
            answer: "Yes! After performing a search with your preferred filters, click 'Save Search' to store it. You can access all your saved searches from your dashboard and quickly run them again anytime."
        },
        {
            question: "How do I reset my password?",
            answer: "Click on 'Forgot Password' on the login page. Enter your registered email, and we'll send you a 4-digit OTP. Enter the OTP and set your new password. The OTP is valid for 5 minutes."
        },
        {
            question: "What is the AI Summary feature?",
            answer: "Our AI Summary analyzes school data, reviews, and comparisons to provide you with quick insights about each school. It highlights key strengths, areas of improvement, and overall suitability based on various factors."
        },
        {
            question: "Can I add private notes to schools?",
            answer: "Yes! Logged-in users can add private notes to any school. These notes are only visible to you and help you remember important details during your school search process."
        },
        {
            question: "How do I delete my account?",
            answer: "Account deletion can be requested through the Settings page in your dashboard or by contacting our support team. Please note that this action is irreversible and will remove all your data including reviews and saved preferences."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '100px', paddingBottom: '3rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>

                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem' }}
                    >
                        Frequently Asked <span className="text-gradient">Questions</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}
                    >
                        Find answers to common questions about School Finder
                    </motion.p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="card glass-panel"
                            style={{ padding: 0, overflow: 'hidden' }}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem 1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <span style={{ fontWeight: '600', color: '#1f2937', paddingRight: '1rem' }}>{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ flexShrink: 0 }}
                                >
                                    <FaChevronDown style={{ color: activeIndex === index ? '#6366f1' : '#6b7280' }} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            padding: '0 1.5rem 1.25rem 1.5rem',
                                            color: '#6b7280',
                                            lineHeight: '1.6',
                                            borderTop: '1px solid #f3f4f6',
                                            paddingTop: '1rem'
                                        }}>
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="card glass-panel text-center"
                    style={{ marginTop: '3rem', padding: '2rem' }}
                >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Still have questions?</h3>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Can't find the answer you're looking for? Please reach out to our friendly team.</p>
                    <a href="/contact" className="btn btn-primary">
                        Contact Support
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQPage;
