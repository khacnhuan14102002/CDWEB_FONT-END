import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from "../components/Title.jsx";
import { assets } from "../assets/assets.js";
import NewsletterBox from "../components/NewsletterBox.jsx";
import '../style/Contact.css';

const Contact = () => {
    const { t } = useTranslation();

    return (
        <div>
            <div className='contact-title-section'>
                <Title text1={t('contact_1.title1')} text2={t('contact_1.title2')} />
            </div>
            <div className='contact-content-section'>
                <img className='contact-image' src={assets.contact_img} alt={t('contact_1.imageAlt')} />
                <div className='contact-info'>
                    <p className='store-heading'>{t('contact_1.storeTitle')}</p>
                    <p className='store-address'>{t('contact_1.address')}</p>
                    <p className='store-contact'>
                        {t('contact_1.tel')}<br />
                        {t('contact_1.email')}
                    </p>
                </div>
            </div>
            <NewsletterBox />
        </div>
    );
};

export default Contact;
