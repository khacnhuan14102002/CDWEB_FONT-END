import React, {useContext, useState, useEffect} from "react";
import { assets } from "../assets/assets.js";
import "../style/navbar.css";
import logo from '../assets/anh/logo_1.png';
import {Link, NavLink} from "react-router-dom";
import {ShopContext} from "../context/ShopContext.jsx";
import mana from '../assets/management.png';

const Navbar = () =>  {
    const [visible, setVisible] = useState(false);
    const {setShowSearch, getCartCount} = useContext(ShopContext);

    // ✅ State để lưu tên người dùng
    const [user, setUser] = useState(null);

    // ✅ Lấy thông tin người dùng từ localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ✅ Hàm đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login"; // hoặc dùng navigate + reload
         navigate("/");
        // window.location.reload();
    };

    return (
        <div className="navbar">
            <Link to='/'><img src={logo} className="logo" alt=""/></Link>
            <ul className="nav-links">
                <NavLink to='/' className={({isActive}) => (isActive ? "nav-item active" : "nav-item")}>
                    <p>HOME</p>
                    <hr className="nav-underline"/>
                </NavLink>
                <NavLink to="/collection" className={({ isActive }) => isActive ? "nav-item active collection-parent" : "nav-item collection-parent"}>
                    <p>COLLECTION</p>
                    <hr className="nav-underline"/>
                    {/* Mega menu nội dung giữ nguyên */}
                </NavLink>
                <NavLink to='/about' className={({isActive}) => (isActive ? "nav-item active" : "nav-item")}>
                    <p>ABOUT</p>
                    <hr className="nav-underline"/>
                </NavLink>
                <NavLink to='/contact' className={({isActive}) => (isActive ? "nav-item active" : "nav-item")}>
                    <p>CONTACT</p>
                    <hr className="nav-underline"/>
                </NavLink>
            </ul>

            <div className="flex items-center gap-6">
                <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className="icon" alt="Search Icon"/>

                <div className="group relative">
                    <Link to='/login' ><img className="icon" src={assets.profile_icon} alt="Profile Icon"/></Link>
                    <div className="dropdown-menu">
                        <div className="menu">
                            {user && <p className="menu-item">Xin chào, {user.hoTen}</p>} {/* ✅ Hiện tên */}
                            <p className="menu-item">My Profile</p>
                            <p className="menu-item">Orders</p>
                            <p onClick={()=>handleLogout()} className="menu-item" >Logout</p> {/* ✅ Logout */}
                        </div>
                    </div>
                </div>

                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt=""/>
                    <p className='badge'>{getCartCount()}</p>
                </Link>
                <Link to='/admin' className='relative'>
                    <img src={mana} className='w-5 min-w-5' alt=""/>
                </Link>
                <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='menu-c'/>
            </div>

            {/* Sidebar cho mobile */}
            <div className={`sidebar ${visible ? 'active' : ''}`}>
                <div className="sidebar-content">
                    <div className="back-button" onClick={() => setVisible(false)}>
                        <img className="icon_d" src={assets.dropdown_icon} alt="Dropdown Icon"/>
                        <p>Back</p>
                    </div>
                    <NavLink onClick={()=>setVisible(false)} className="nav-link" to="/">HOME</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className="nav-link" to="/collection">COLLECTION</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className="nav-link" to="/about">ABOUT</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className="nav-link" to="/contact">CONTACT</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
