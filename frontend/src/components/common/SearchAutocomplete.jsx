import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

// Styled Components for a clean UI
const SearchContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 500px;
    z-index: 1000;
`;

const SearchInputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 0 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: all 0.3s ease;

    &:focus-within {
        border-color: var(--primary);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
`;

const SearchIcon = styled(FaSearch)`
    color: #888;
    margin-right: 10px;
`;

const Input = styled.input`
    border: none;
    outline: none;
    width: 100%;
    padding: 12px 0;
    font-size: 15px;
    color: #333;

    &::placeholder {
        color: #aaa;
    }
`;

const Dropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 8px;
    margin-top: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #f0f0f0;
    display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.div`
    padding: 12px 15px;
    cursor: pointer;
    border-bottom: 1px solid #f9f9f9;
    transition: background 0.2s;

    &:hover {
        background: #f5f7fa;
    }

    &:last-child {
        border-bottom: none;
    }

    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ItemInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const SchoolName = styled.span`
    font-weight: 600;
    color: #333;
    font-size: 14px;
`;

const SchoolAddress = styled.span`
    font-size: 12px;
    color: #777;
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
`;

const LoadingText = styled.div`
    padding: 15px;
    text-align: center;
    color: #888;
    font-size: 14px;
`;

const NoResults = styled.div`
    padding: 15px;
    text-align: center;
    color: #888;
    font-size: 14px;
`;

const SearchAutocomplete = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                fetchSuggestions(query);
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        }, 400); // 400ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    // Fetch from Backend
    const fetchSuggestions = async (searchTerm) => {
        setLoading(true);
        try {
            // Using existing Search API, filtering fields for speed
            const baseURL = import.meta.env.VITE_API_URL;
            const res = await axios.get(`${baseURL}/schools?q=${searchTerm}&select=name,address,city,slug,_id&limit=6`);
            if (res.data.success) {
                setSuggestions(res.data.data);
                setShowDropdown(true);
            }
        } catch (error) {
            console.error("Search error", error);
        } finally {
            setLoading(false);
        }
    };

    // Click Outside to Close
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (slug) => {
        navigate(`/school/${slug}`);
        setShowDropdown(false);
        setQuery('');
    };

    return (
        <SearchContainer ref={wrapperRef}>
            <SearchInputWrapper>
                <SearchIcon />
                <Input
                    type="text"
                    placeholder="Search schools, cities, or areas..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowDropdown(true)}
                />
            </SearchInputWrapper>

            <Dropdown isOpen={showDropdown}>
                {loading ? (
                    <LoadingText>Searching...</LoadingText>
                ) : suggestions.length > 0 ? (
                    suggestions.map(school => (
                        <DropdownItem key={school._id} onClick={() => handleSelect(school.slug)}>
                            <ItemInfo>
                                <SchoolName>{school.name}</SchoolName>
                                <SchoolAddress>
                                    <FaMapMarkerAlt size={10} /> {school.city}, {school.address?.substring(0, 25)}...
                                </SchoolAddress>
                            </ItemInfo>
                        </DropdownItem>
                    ))
                ) : (
                    <NoResults>No schools found</NoResults>
                )}
            </Dropdown>
        </SearchContainer>
    );
};

export default SearchAutocomplete;
