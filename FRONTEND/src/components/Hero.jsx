import React from 'react';
import { useTranslation } from 'react-i18next';
import { assets } from "../assets/assets.js";
import "../style/Hero.css";
import nen from '../assets/anh/nen.png';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <div className="hero-container">
            {/* Left side */}
            <div className="hero-left">
                <div className="hero-content">
                    <div className="hero-label">
                        <div className="hero-line"></div>
                        <p>{t("hero.label")}</p>
                    </div>
                    <h1 className="hero-title">{t("hero.title")}</h1>
                    <div className="hero-shop-now">
                        <p>{t("hero.shopNow")}</p>
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
