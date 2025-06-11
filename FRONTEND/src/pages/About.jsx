import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from "../components/Title.jsx";
import { assets } from "../assets/assets.js";
import NewsletterBox from "../components/NewsletterBox.jsx";
import '../style/About.css';

const About = () => {
    const { t } = useTranslation();

    return (
        <div>
            <div className='about-title-section'>
                <Title text1={t('about_1.title1')} text2={t('about_1.title2')} />
            </div>

            <div className='about-content-section'>
                <img className='about-image' src={assets.about_img} alt={t('about_1.imageAlt')} />
                <div className='about-text-content'>
                    <p>
                        <strong>{t('about_1.introTitle')}</strong><br />
                        {t('about_1.introDescription')}
                    </p>
                    <p>
                        <strong>{t('about_1.weProvide')}</strong><br /><br />

                        <strong>{t('about_1.section1.title')}</strong><br />
                        ✔ {t('about_1.section1.point1')}<br />
                        ✔ {t('about_1.section1.point2')}<br />
                        ✔ {t('about_1.section1.point3')}<br /><br />

                        <strong>{t('about_1.section2.title')}</strong><br />
                        ✔ {t('about_1.section2.point1')}<br />
                        ✔ {t('about_1.section2.point2')}<br />
                        ✔ {t('about_1.section2.point3')}<br /><br />

                        <strong>{t('about_1.section3.title')}</strong><br />
                        ✔ {t('about_1.section3.point1')}<br />
                        ✔ {t('about_1.section3.point2')}<br />
                        ✔ {t('about_1.section3.point3')}<br />
                    </p>
                </div>
            </div>

            <div className='why-choose-us-title'>
                <Title text1={t('about_1.whyChooseUsTitle1')} text2={t('about_1.whyChooseUsTitle2')} />
            </div>

            <div className='why-choose-us-items'>
                <div className='why-choose-us-item'>
                    <b>{t('about_1.why1.title')}</b>
                    <p className='why-choose-us-text'>{t('about_1.why1.text')}</p>
                </div>
                <div className='why-choose-us-item'>
                    <b>{t('about_1.why2.title')}</b>
                    <p className='why-choose-us-text'>{t('about_1.why2.text')}</p>
                </div>
                <div className='why-choose-us-item'>
                    <b>{t('about_1.why3.title')}</b>
                    <p className='why-choose-us-text'>{t('about_1.why3.text')}</p>
                </div>
            </div>

            <NewsletterBox />
        </div>
    );
};

export default About;
