import React from 'react'


import '../style/Title.css'; // Import the CSS file

const Title = ({ text1, text2 }) => {
    return (
        <div className='title-container'>
            <p className='text'>{text1}<span className='highlight'>{text2}</span></p>
            <p className='line'></p>
        </div>
    );
}

export default Title