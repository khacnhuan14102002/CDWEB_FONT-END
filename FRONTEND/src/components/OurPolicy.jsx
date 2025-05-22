import React from 'react';
import { assets } from "../assets/assets.js";
import '../style/Our.css';

const OurPolicy = () => {
    return (
        <div className="our-policy">
            <div className="policy-item">
                <img src={assets.exchange_icon} className="policy-icon" alt=""/>
                <p className="policy-title">Easy Exchange Policy</p>
                <p className="policy-description">We offer hassle free exchange policy</p>
            </div>
            <div className="policy-item">
                <img src={assets.quality_icon} className="policy-icon" alt=""/>
                <p className="policy-title">7 Days Return Policy</p>
                <p className="policy-description">We provide 7 days free return policy</p>
            </div>
            <div className="policy-item">
                <img src={assets.support_img} className="policy-icon" alt=""/>
                <p className="policy-title">Best customer support</p>
                <p className="policy-description">We provide 24/7 customer support</p>
            </div>
        </div>
    );
}

export default OurPolicy;
