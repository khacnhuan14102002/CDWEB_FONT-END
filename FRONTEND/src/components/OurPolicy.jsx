import React from 'react';
import { useTranslation } from 'react-i18next';
import { assets } from "../assets/assets.js";
import '../style/Our.css';

const OurPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="our-policy">
            <div className="policy-item">
                <img src={assets.exchange_icon} className="policy-icon" alt=""/>
                <p className="policy-title">{t("policy.exchangeTitle")}</p>
                <p className="policy-description">{t("policy.exchangeDescription")}</p>
            </div>
            <div className="policy-item">
                <img src={assets.quality_icon} className="policy-icon" alt=""/>
                <p className="policy-title">{t("policy.returnTitle")}</p>
                <p className="policy-description">{t("policy.returnDescription")}</p>
            </div>
            <div className="policy-item">
                <img src={assets.support_img} className="policy-icon" alt=""/>
                <p className="policy-title">{t("policy.supportTitle")}</p>
                <p className="policy-description">{t("policy.supportDescription")}</p>
            </div>
        </div>
    );
}

export default OurPolicy;
