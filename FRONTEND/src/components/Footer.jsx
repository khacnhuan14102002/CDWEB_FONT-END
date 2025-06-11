import React from 'react';
import { assets } from "../assets/assets.js";
import '../style/Foot.css';
import logo from '../assets/anh/logo_1.png';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <div className="footer-wrapper">
            <div className="footer-grid">
                <div className="footer-logo-section">
                    <img src={logo} className="footer-logo" alt="Logo" />
                    <p className="footer-description">
                        {t('footer.description')}
                    </p>
                </div>

                <div className="footer-links">
                    <p className="footer-title">{t('footer.company')}</p>
                    <ul className="footer-list">
                        <li>{t('footer.home')}</li>
                        <li>{t('footer.about')}</li>
                        <li>{t('footer.delivery')}</li>
                        <li>{t('footer.privacy')}</li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <p className="footer-title">{t('footer.getInTouch')}</p>
                    <ul className="footer-list">
                        <li>{t('footer.phone')}</li>
                        <li>{t('footer.email')}</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <hr />
                <p className="footer-copy">{t('footer.copyright')}</p>
            </div>
        </div>
    );
}

export default Footer;
