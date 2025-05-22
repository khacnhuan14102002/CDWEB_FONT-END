import React, {useContext, useEffect, useState} from 'react';
import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";
import '../style/Search.css';
import {useLocation} from "react-router-dom";

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false)
    const  location = useLocation();
    useEffect(() => {
        if(location.pathname.includes('collection')){
            setVisible(true);
        }else{
            setVisible(false)
        }
    }, [location]);
    return showSearch && visible ?(
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
        </div>
    ): null
};

export default SearchBar;