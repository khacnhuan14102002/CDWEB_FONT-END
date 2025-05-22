import React from 'react';
import { assets } from "../assets/assets.js";
import '../style/Foot.css';
import logo from '../assets/anh/logo_1.png'
const Footer = () => {
    return (
        <div className="footer-wrapper">
            <div className="footer-grid">
                <div className="footer-logo-section">
                    <img src={logo} className="footer-logo" alt="" />
                    <p className="footer-description">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the...
                    </p>
                </div>

                <div className="footer-links">
                    <p className="footer-title">COMPANY</p>
                    <ul className="footer-list">
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <p className="footer-title">GET IN TOUCH</p>
                    <ul className="footer-list">
                        <li>+1-212-456-7890</li>
                        <li>contact@gmail.com</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <hr />
                <p className="footer-copy">Copyright 2025@ petshop.com - All Right Reserved.</p>
            </div>
        </div>
    );
}

export default Footer;
