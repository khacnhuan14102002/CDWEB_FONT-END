import React from 'react';
import '../style/New.css'; // Import the plain CSS

const NewsletterBox = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

    return (
        <div className="newsletter-container">
            <p className="newsletter-title">
                Subscribe now & get 20% off
            </p>
            <p className="newsletter-subtitle">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
            <form className="newsletter-form" onSubmit={onSubmitHandler}>
                <input
                    className="newsletter-input"
                    type="email"
                    placeholder="Enter your mail"
                />
                <button type="submit" className="newsletter-button">
                    SUBSCRIBE
                </button>
            </form>
        </div>
    );
}

export default NewsletterBox;
