import React from 'react';
import { assets } from "../assets/assets.js";
import "../style/Hero.css";
import nen from '../assets/anh/nen.png'
const Hero = () => {
    return (
        <div className="hero-container">
            {/* Left side */}
            <div className="hero-left">
                <div className="hero-content">
                    <div className="hero-label">
                        <div className="hero-line"></div>
                        <p>OUR BESTSELLERS</p>
                    </div>
                    <h1 className="hero-title">LATEST ARRIVALS</h1>
                    <div className="hero-shop-now">
                        <p>SHOP NOW</p>
                        <div className="hero-line-thin"></div>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <img className="hero-image" src={nen} alt="Hero" />
        </div>
    );
};

export default Hero;
