import React, {useContext, useState} from "react";
import { assets } from "../assets/assets.js";
import "../style/navbar.css";
import logo from '../assets/anh/logo_1.png'
import {Link, NavLink} from "react-router-dom";
import {ShopContext} from "../context/ShopContext.jsx";

const Navbar = () =>  {
    const [visible, setVisible] = useState(false);
    const {setShowSearch, getCartCount} = useContext(ShopContext)
    return (
        <div className="navbar">
            <Link to='/'><img src={logo} className="logo" alt=""/></Link>
            <ul className="nav-links">
                <NavLink to='/' className={({isActive}) => (isActive ? "nav-item active" : "nav-item")}>
                    <p>HOME</p>
                    <hr className="nav-underline"/>
                </NavLink>
                <NavLink
                    to="/collection"
                    className={({ isActive }) =>
                        isActive ? "nav-item active collection-parent" : "nav-item collection-parent"
                    }
                >
                    <p>COLLECTION</p>
                    <hr className="nav-underline"/>
                    <div className="mega-menu">
                        <div className="mega-column">
                            <h4>Thức Ăn Cho Chó</h4>
                            <p>Thức Ăn Hạt</p>
                            <p>Thức Ăn Ướt</p>
                            <p>Thức Ăn Điều Trị</p>
                            <p>Thức Ăn Hữu Cơ</p>
                            <p>Không Ngũ Cốc</p>
                        </div>
                        <div className="mega-column">
                            <h4>Bánh Thưởng</h4>
                            <p>Bánh Mềm</p>
                            <p>Xương Gặm</p>
                            <p>Súp</p>
                            <p>Bánh Quy</p>
                            <p>Thịt Sấy Khô</p>
                        </div>
                        <div className="mega-column">
                            <h4>Chăm Sóc</h4>
                            <p>Vệ Sinh</p>
                            <p>Vitamin</p>
                            <p>Thuốc Trị Ve</p>
                            <p>Khử Mùi</p>
                        </div>
                        <div className="mega-column">
                            <h4>Phụ Kiện & Vận Chuyển</h4>
                            <p>Vòng Cổ</p>
                            <p>Quần Áo</p>
                            <p>Dụng Cụ Ăn Uống</p>
                            <p>Lồng Vận Chuyển</p>
                        </div>
                    </div>
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
                <img onClick={()=>setShowSearch(true)} src={assets.search_icon}  className="icon" alt="Search Icon"/>
                <div className="group relative">
                    <img className="icon" src={assets.profile_icon} alt="Profile Icon"/>
                    <div className="dropdown-menu">
                        <div className="menu">
                            <p className="menu-item">My Profile</p>
                            <p className="menu-item">Orders</p>
                            <p className="menu-item">Logout</p>
                        </div>
                    </div>
                </div>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt=""/>
                    <p className='badge'>{getCartCount()}</p>
                </Link>
                <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='menu-c'/>
            </div>
            {/*silde bar*/}
            <div className="navbar">
                {/* ... các phần khác của navbar ... */}
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
        </div>
    )
}

export default Navbar