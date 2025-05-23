// Contact.jsx
import React from 'react';
import Title from "../components/Title.jsx";
import {assets} from "../assets/assets.js";
import NewsletterBox from "../components/NewsletterBox.jsx";
import '../style/Contact.css'; // Import the CSS file

const Contact = () => {
    return (
        <div>
            <div className='contact-title-section'>
                <Title text1={'CONTACT'} text2={' US'}/>
            </div>
            <div className='contact-content-section'>
                <img className='contact-image' src={assets.contact_img} alt="Contact us"/>
                <div className='contact-info'>
                    <p className='store-heading'>Our Store</p>
                    <p className='store-address'>số 11/5 <br/> Linh Xuân, Thủ Đức</p>
                    <p className='store-contact'>Tel: 031231312<br/> Email : Petshop@gmail.com </p>
                </div>
            </div>
            <NewsletterBox/>
        </div>
    );
}

export default Contact;