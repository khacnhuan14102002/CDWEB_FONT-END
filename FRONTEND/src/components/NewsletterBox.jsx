import React from 'react';
import { useTranslation } from 'react-i18next';
import '../style/New.css';

const NewsletterBox = () => {
    const { t } = useTranslation();

    const onSubmitHandler = (event) => {
        event.preventDefault();
        // Có thể thêm xử lý gửi email tại đây
    }

    return (
        <div className="newsletter-container">
            <p className="newsletter-title">
                {t("newsletter.title")}
            </p>
            <p className="newsletter-subtitle">
                {t("newsletter.subtitle")}
            </p>
            <form className="newsletter-form" onSubmit={onSubmitHandler}>
                <input
                    className="newsletter-input"
                    type="email"
                    placeholder={t("newsletter.placeholder")}
                />
                <button type="submit" className="newsletter-button">
                    {t("newsletter.button")}
                </button>
            </form>
        </div>
    );
};

export default NewsletterBox;
