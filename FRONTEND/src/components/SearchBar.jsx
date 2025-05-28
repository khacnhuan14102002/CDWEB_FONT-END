import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";
import '../style/Search.css';
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.trim() === '') {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/sanpham/search?keyword=${search}`);
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300); // debounce

        return () => clearTimeout(debounce);
    }, [search]);

    const handleSelect = (id) => {
        setSearch('');
        setShowSearch(false);
        setSuggestions([]);
        navigate(`/product/${id}`);
    };

    return showSearch && visible ? (
        <div className={`searchbar-container ${showSearch ? 'visible' : 'hidden'}`}>
            <div className="searchbar-input-wrapper">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search"
                    className="searchbar-input"
                />
                <img className="searchbar-icon" src={assets.search_icon} alt="search icon" />
            </div>
            <img
                onClick={() => setShowSearch(false)}
                className="searchbar-close-icon"
                src={assets.cross_icon}
                alt="close icon"
            />

            {suggestions.length > 0 && (
                <ul className="autocomplete-list">
                    {suggestions.map((item) => (
                        <li key={item.maSP} onClick={() => handleSelect(item.maSP)}>
                            <img src={item.hinhAnh} alt={item.tenSP} />
                            <span>{item.tenSP}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    ) : null;
};

export default SearchBar;
