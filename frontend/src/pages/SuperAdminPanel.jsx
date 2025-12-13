import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../styles/layout.css';
import '../styles/pages/superadmin.css';

const SuperAdminPanel = () => {
    const [schools, setSchools] = useState([]);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [adminStats, setAdminStats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedSchoolId, setSelectedSchoolId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('Fetching data for tab:', activeTab);
            if (activeTab === 'pending') {
                const res = await api.get('/admin/schools/pending');
                console.log('Pending schools response:', res.data);
                setSchools(res.data.data || []);
            } else if (activeTab === 'schools') {
                const res = await api.get('/admin/schools');
                console.log('All schools response:', res.data);
                setSchools(res.data.data || []);
            } else if (activeTab === 'users') {
                const res = await api.get('/admin/users');
                console.log('Users response:', res.data);
                setUsers(res.data.data || []);
            } else if (activeTab === 'reviews') {
                const res = await api.get('/admin/reviews');
                console.log('Reviews response:', res.data);
                setReviews(res.data.data || []);
            } else if (activeTab === 'analytics') {
                const res = await api.get('/admin/analytics/platform');
                console.log('Analytics response:', res.data);
                setAnalytics(res.data.data);
            } else if (activeTab === 'admins') {
                const res = await api.get('/admin/users?role=schoolAdmin');
                console.log('Admin stats response:', res.data);
                setAdminStats(res.data.data || []);
            } else if (activeTab === 'messages') {
                const res = await api.get('/contact');
                console.log('Messages response:', res.data);
                setMessages(res.data.data || []);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            console.error('Error details:', err.response?.data);
            setAlert(`Error: ${err.response?.data?.error || err.message}`, 'error');
            setLoading(false);
        }
    };

    const handleRejectSubmit = async () => {
        try {
            await api.put(`/admin/schools/${selectedSchoolId}/approve`, {
                isApproved: false,
                rejectionReason
            });
            setAlert('School rejected', 'success');
            setRejectModalOpen(false);
            setRejectionReason('');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to reject school', 'error');
        }
    };

    const toggleSchoolApproval = async (id, isRejecting) => {
        if (isRejecting) {
            setSelectedSchoolId(id);
            setRejectModalOpen(true);
            return;
        }
        try {
            await api.put(`/admin/schools/${id}/approve`, { isApproved: true });
            setAlert('School approved', 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to update school status', 'error');
        }
    };

    const toggleSchoolVerification = async (id, isVerified) => {
        try {
            await api.put(`/admin/schools/${id}/verify`, { isVerified: !isVerified });
            setAlert(`School ${!isVerified ? 'verified' : 'unverified'}`, 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to update verification status', 'error');
        }
    };

    const toggleSuspicious = async (id) => {
        try {
            await api.put(`/admin/schools/${id}/suspicious`);
            setAlert('School flagged as suspicious', 'warning');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to update suspicious status', 'error');
        }
    };

    const toggleFeatured = async (id) => {
        try {
            await api.put(`/schools/${id}/featured`);
            setAlert('School featured status updated', 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to update featured status', 'error');
        }
    };

    const deleteSchool = async (id) => {
        if (!window.confirm('Are you sure you want to delete this school? This will also delete all related reviews and notes.')) return;
        try {
            await api.delete(`/schools/${id}`);
            setAlert('School deleted', 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to delete school', 'error');
        }
    };

    const toggleUserStatus = async (id, isActive) => {
        try {
            await api.put(`/admin/users/${id}`, { isActive: !isActive });
            setAlert(`User ${!isActive ? 'activated' : 'banned'}`, 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to update user status', 'error');
        }
    };

    const changeUserRole = async (id, role) => {
        try {
            await api.put(`/admin/users/${id}`, { role });
            setAlert('User role updated', 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to update user role', 'error');
        }
    };

    const deleteReview = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await api.delete(`/admin/reviews/${id}`);
            setAlert('Review deleted', 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to delete review', 'error');
        }
    };

    const toggleMessageStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'new' ? 'read' : 'archived';
            await api.put(`/contact/${id}`, { status: newStatus });
            setAlert('Message status updated', 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to update message status', 'error');
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await api.delete(`/contact/${id}`);
            setAlert('Message deleted', 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            setAlert('Failed to delete message', 'error');
        }
    };

    return (
        <div className="superadmin-container">
            <h1 className="superadmin-title">Super Admin Panel</h1>

            <div className="auth-tabs">
                <div className={`auth-tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                    Pending Approvals
                </div>
                <div className={`auth-tab ${activeTab === 'schools' ? 'active' : ''}`} onClick={() => setActiveTab('schools')}>
                    All Schools
                </div>
                <div className={`auth-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                    Users
                </div>
                <div className={`auth-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
                    Reviews
                </div>
                <div className={`auth-tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                    Analytics
                </div>
                <div className={`auth-tab ${activeTab === 'admins' ? 'active' : ''}`} onClick={() => setActiveTab('admins')}>
                    Admin Activity
                </div>
                <div className={`auth-tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
                    Messages
                </div>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#6b7280' }}>
                    Loading data...
                </div>
            )}

            {!loading && activeTab === 'pending' && (
                <div className="superadmin-card">
                    <h2>Pending Approvals</h2>
                    {schools.length === 0 ? <p>No pending schools.</p> : (
                        <div className="table-wrapper">
                            <table className="superadmin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Owner</th>
                                        <th>City</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schools.map(school => (
                                        <tr key={school._id}>
                                            <td>{school.name}</td>
                                            <td>{school.owner?.email}</td>
                                            <td>{school.city}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => toggleSchoolApproval(school._id, false)}
                                                        className="btn btn-primary action-btn"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => toggleSchoolApproval(school._id, true)}
                                                        className="btn btn-outline action-btn"
                                                        style={{ color: 'red', borderColor: 'red' }}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {!loading && activeTab === 'schools' && (
                <div className="superadmin-card">
                    <h2>Manage Schools</h2>
                    <div className="table-wrapper">
                        <table className="superadmin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Owner</th>
                                    <th>Status</th>
                                    <th>Featured</th>
                                    <th>Flags</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schools.map(school => (
                                    <tr key={school._id}>
                                        <td>{school.name}</td>
                                        <td>{school.owner?.email}</td>
                                        <td>
                                            <span className="badge" style={{
                                                background: school.isApproved ? '#dcfce7' : '#fee2e2',
                                                color: school.isApproved ? '#16a34a' : '#dc2626',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '0.875rem'
                                            }}>
                                                {school.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => toggleFeatured(school._id)}
                                                className="badge"
                                                style={{
                                                    background: school.featured ? '#dbeafe' : '#f3f4f6',
                                                    color: school.featured ? '#1e40af' : '#6b7280',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {school.featured ? 'Featured' : 'Standard'}
                                            </button>
                                        </td>
                                        <td>
                                            {school.isVerified && <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', marginRight: '0.5rem', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>✓ Verified</span>}
                                            {school.isSuspicious && <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>⚠ Suspicious</span>}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => toggleSchoolVerification(school._id, school.isVerified)}
                                                    className="btn btn-outline action-btn"
                                                    style={{ color: school.isVerified ? 'orange' : 'green', borderColor: school.isVerified ? 'orange' : 'green' }}
                                                >
                                                    {school.isVerified ? 'Unverify' : 'Verify'}
                                                </button>
                                                <button
                                                    onClick={() => toggleSuspicious(school._id)}
                                                    className="btn btn-outline action-btn"
                                                    style={{ color: 'orange', borderColor: 'orange' }}
                                                >
                                                    {school.isSuspicious ? 'Clear Flag' : 'Mark Suspicious'}
                                                </button>
                                                <button
                                                    onClick={() => deleteSchool(school._id)}
                                                    className="btn btn-outline action-btn"
                                                    style={{ color: 'red', borderColor: 'red' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && activeTab === 'users' && (
                <div className="superadmin-card">
                    <h2>Manage Users</h2>
                    <div className="table-wrapper">
                        <table className="superadmin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeUserRole(user._id, e.target.value)}
                                                className="form-select"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}
                                            >
                                                <option value="user">User</option>
                                                <option value="schoolAdmin">School Admin</option>
                                                <option value="superAdmin">Super Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className="badge" style={{
                                                background: user.isActive ? '#dcfce7' : '#fee2e2',
                                                color: user.isActive ? '#16a34a' : '#dc2626',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '0.875rem'
                                            }}>
                                                {user.isActive ? 'Active' : 'Banned'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => toggleUserStatus(user._id, user.isActive)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: user.isActive ? 'red' : 'green', borderColor: user.isActive ? 'red' : 'green' }}
                                            >
                                                {user.isActive ? 'Ban' : 'Unban'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && activeTab === 'reviews' && (
                <div className="superadmin-card">
                    <h2>Moderate Reviews</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {reviews.length === 0 ? (
                            <p>No reviews to moderate.</p>
                        ) : (
                            reviews.map(review => (
                                <div key={review._id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <strong>{review.school?.name}</strong> - <span className="rating">★ {review.rating}</span>
                                        <p style={{ margin: '0.5rem 0' }}>{review.comment}</p>
                                        <small style={{ color: '#6b7280' }}>By {review.user?.name}</small>
                                    </div>
                                    <button
                                        onClick={() => deleteReview(review._id)}
                                        className="btn btn-outline"
                                        style={{ color: 'red', borderColor: 'red', height: 'fit-content' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {!loading && activeTab === 'analytics' && analytics && (
                <div className="superadmin-card">
                    <h2>Platform Analytics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>{analytics.totalUsers}</h3>
                            <p>Total Users</p>
                        </div>
                        <div className="stat-card">
                            <h3>{analytics.totalSchools}</h3>
                            <p>Total Schools</p>
                        </div>
                        <div className="stat-card">
                            <h3>{analytics.totalApprovedSchools}</h3>
                            <p>Approved Schools</p>
                        </div>
                        <div className="stat-card">
                            <h3>{analytics.totalEnquiries}</h3>
                            <p>Total Enquiries</p>
                        </div>
                    </div>

                    <div className="charts-container">
                        <div className="chart-wrapper">
                            <Bar
                                data={{
                                    labels: ['Users', 'Schools', 'Enquiries', 'Reviews'],
                                    datasets: [{
                                        label: 'Platform Stats',
                                        data: [analytics.totalUsers, analytics.totalSchools, analytics.totalEnquiries, analytics.totalReviews],
                                        backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(153, 102, 255, 0.5)'],
                                        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)'],
                                        borderWidth: 1
                                    }]
                                }}
                                options={{ responsive: true, maintainAspectRatio: false }}
                            />
                        </div>
                        <div className="chart-wrapper">
                            <Pie
                                data={{
                                    labels: ['Approved Schools', 'Pending Schools'],
                                    datasets: [{
                                        data: [analytics.totalApprovedSchools, analytics.totalSchools - analytics.totalApprovedSchools],
                                        backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                                        borderWidth: 1
                                    }]
                                }}
                                options={{ responsive: true, maintainAspectRatio: false }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {!loading && activeTab === 'admins' && (
                <div className="superadmin-card">
                    <h2>School Admin Activity</h2>
                    <div className="table-wrapper">
                        <table className="superadmin-table">
                            <thead>
                                <tr>
                                    <th>Admin Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(adminStats) && adminStats.length > 0 ? (
                                    adminStats.map(admin => (
                                        <tr key={admin._id}>
                                            <td>{admin.name}</td>
                                            <td>{admin.email}</td>
                                            <td>
                                                <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '12px', fontSize: '0.875rem' }}>
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge" style={{
                                                    background: admin.isApproved ? '#dcfce7' : '#fef9c3',
                                                    color: admin.isApproved ? '#16a34a' : '#ca8a04',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {admin.isApproved ? 'Active' : 'Pending'}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.875rem' }}>
                                                {new Date(admin.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                            No school admins found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && activeTab === 'messages' && (
                <div className="superadmin-card">
                    <h2>Contact Messages</h2>
                    <div className="table-wrapper">
                        <table className="superadmin-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Subject</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                            No messages found
                                        </td>
                                    </tr>
                                ) : (
                                    messages.map(msg => (
                                        <tr key={msg._id} style={{ background: msg.status === 'new' ? '#f0f9ff' : 'transparent' }}>
                                            <td style={{ fontSize: '0.875rem' }}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                                            <td>{msg.name}</td>
                                            <td>
                                                <div style={{ fontSize: '0.9rem' }}>{msg.email}</div>
                                                {msg.phone && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{msg.phone}</div>}
                                            </td>
                                            <td>{msg.subject}</td>
                                            <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.message}</td>
                                            <td>
                                                <span className="badge" style={{
                                                    background: msg.status === 'new' ? '#dcfce7' : msg.status === 'read' ? '#dbeafe' : '#f3f4f6',
                                                    color: msg.status === 'new' ? '#16a34a' : msg.status === 'read' ? '#1e40af' : '#6b7280',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {msg.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    {msg.status !== 'archived' && (
                                                        <button
                                                            onClick={() => toggleMessageStatus(msg._id, msg.status)}
                                                            className="btn btn-outline action-btn"
                                                        >
                                                            {msg.status === 'new' ? 'Mark Read' : 'Archive'}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteMessage(msg._id)}
                                                        className="btn btn-outline action-btn"
                                                        style={{ color: 'red', borderColor: 'red' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px', maxWidth: '90%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Reject School</h3>
                        <div className="form-group">
                            <label>Reason for Rejection</label>
                            <textarea
                                className="form-textarea"
                                rows="4"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter reason..."
                                style={{ width: '100%', marginTop: '0.5rem' }}
                            ></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={handleRejectSubmit} className="btn btn-primary" style={{ background: 'red', borderColor: 'red', flex: 1 }}>Reject</button>
                            <button onClick={() => setRejectModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminPanel;
