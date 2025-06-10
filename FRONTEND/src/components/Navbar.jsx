import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets.js";
import "../style/navbar.css";
import logo from '../assets/anh/logo_1.png';
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";
import mana from '../assets/management.png';
import { useNavigate } from "react-router-dom";
const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { setShowSearch } = useContext(ShopContext);
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    // Lấy user từ localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Lấy số lượng sản phẩm trong giỏ hàng từ API backend
    useEffect(() => {
        const fetchCartCount = async () => {
            if (!user || !user.maKH) {
                setCartCount(0);
                return;
            }
            try {
                const res = await fetch(`http://localhost:8080/api/cart/${user.maKH}`);
                if (!res.ok) throw new Error('Failed to fetch cart items');
                const data = await res.json();
                // Tính tổng số lượng sản phẩm trong giỏ hàng, chú ý tên trường là soLuong
                const totalCount = data.reduce((sum, item) => {
                    const quantity = Number(item.soLuong);
                    return sum + (isNaN(quantity) ? 0 : quantity);
                }, 0);
                setCartCount(totalCount);
            } catch (error) {
                console.error(error);
                setCartCount(0);
            }
        };
        fetchCartCount();
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <div className="navbar">
            <Link to='/'><img src={logo} className="logo" alt=""/></Link>
            <ul className="nav-links">
                <NavLink to='/' className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                    <p>HOME</p>
                    <hr className="nav-underline"/>
                </NavLink>
                <NavLink to="/collection" className={({ isActive }) => isActive ? "nav-item active collection-parent" : "nav-item collection-parent"}>
                    <p>COLLECTION</p>
                    <hr className="nav-underline"/>
                </NavLink>
                <NavLink to='/about' className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                    <p>ABOUT</p>
                    <hr className="nav-underline"/>
                </NavLink>
                <NavLink to='/contact' className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                    <p>CONTACT</p>
                    <hr className="nav-underline"/>
                </NavLink>
            </ul>

            <div className="flex items-center gap-6">
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} className="icon" alt="Search Icon"/>

                <div className="group relative">
                    <Link to={user ? '#' : '/login'} onClick={user ? (e) => e.preventDefault() : null}>
                        <img className="icon" src={assets.profile_icon} alt="Profile Icon"/>
                    </Link>
                    {user && (
                        <div className="dropdown-menu">
                            <div className="menu">
                                <p className="menu-item">Xin chào, {user.hoTen}</p>
                                <p  onClick={() => navigate('/profile')}className="menu-item">My Profile</p>
                                <p onClick={() => navigate('/orders')} className="menu-item">Orders</p>
                                <p onClick={handleLogout} className="menu-item">Logout</p>
                            </div>
                        </div>
                    )}
                </div>

                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart Icon"/>
                    <p className='badge'>{cartCount}</p>
                </Link>
                {user?.role === "admin" && (
                    <Link to='/admin' className='relative'>
                        <img src={mana} className='w-5 min-w-5' alt="Admin Icon" />
                    </Link>
                )}

                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='menu-c' alt="Menu Icon"/>
            </div>

            <div className={`sidebar ${visible ? 'active' : ''}`}>
                <div className="sidebar-content">
                    <div className="back-button" onClick={() => setVisible(false)}>
                        <img className="icon_d" src={assets.dropdown_icon} alt="Dropdown Icon"/>
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className="nav-link" to="/">HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className="nav-link" to="/collection">COLLECTION</NavLink>
                    <NavLink onClick={() => setVisible(false)} className="nav-link" to="/about">ABOUT</NavLink>
                    <NavLink onClick={() => setVisible(false)} className="nav-link" to="/contact">CONTACT</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
