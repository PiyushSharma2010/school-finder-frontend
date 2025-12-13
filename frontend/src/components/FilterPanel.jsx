import React from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaCity, FaGraduationCap, FaMoneyBillWave, FaTools, FaLayerGroup, FaSortAmountDown } from 'react-icons/fa';
import '../styles/modern-theme.css';

const FilterPanel = ({ filters, setFilters, onApply }) => {
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const InputGroup = ({ icon: Icon, label, children }) => (
        <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon style={{ color: '#6366f1', fontSize: '0.75rem' }} /> {label}
            </label>
            {children}
        </div>
    );

    return (
        <div className="card glass-panel" style={{ position: 'sticky', top: '100px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: '#eef2ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6366f1'
                }}>
                    <FaFilter size={14} />
                </div>
                <h3 style={{ fontWeight: '700', color: '#1f2937', fontSize: '1.125rem', margin: 0 }}>Smart Filters</h3>
            </div>

            <div>
                <InputGroup icon={FaCity} label="City">
                    <input
                        type="text"
                        name="city"
                        value={filters.city || ''}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g. Mumbai"
                    />
                </InputGroup>

                <InputGroup icon={FaGraduationCap} label="Board">
                    <select
                        name="board"
                        value={filters.board || ''}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="">All Boards</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">IB</option>
                    </select>
                </InputGroup>

                <InputGroup icon={FaMoneyBillWave} label="Fee Range (₹)">
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="number"
                            name="minFee"
                            value={filters.minFee || ''}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Min"
                        />
                        <input
                            type="number"
                            name="maxFee"
                            value={filters.maxFee || ''}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Max"
                        />
                    </div>
                </InputGroup>

                <InputGroup icon={FaTools} label="Facilities">
                    <input
                        type="text"
                        name="facilities"
                        value={filters.facilities || ''}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g. Swimming Pool"
                    />
                </InputGroup>

                <InputGroup icon={FaLayerGroup} label="Classes">
                    <input
                        type="text"
                        name="classes"
                        value={filters.classes || ''}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g. 11, 12"
                    />
                </InputGroup>

                <InputGroup icon={FaSortAmountDown} label="Sort By">
                    <select
                        name="sort"
                        value={filters.sort || ''}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="-createdAt">Newest First</option>
                        <option value="-ratingAverage">Best Rated</option>
                        <option value="minFee">Lowest Fee</option>
                        <option value="-minFee">Highest Fee</option>
                    </select>
                </InputGroup>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onApply}
                className="btn btn-primary btn-block"
                style={{ marginTop: '1.5rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
            >
                Apply Filters
            </motion.button>
        </div>
    );
};

export default FilterPanel;
