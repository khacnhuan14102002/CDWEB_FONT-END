import React, {useContext, useState} from 'react'
import Title from "../components/Title.jsx";
import CartTotal from "../components/CartTotal.jsx";
import {assets} from "../assets/assets.js";
import {ShopContext} from "../context/ShopContext.jsx";
import '../style/Place.css'

const PlaceOrder = () =>  {
    const [method, setMethod] = useState('cod')
    const {navigate} = useContext(ShopContext); // Assuming navigate is part of your ShopContext

    return (
        <div className='place-order-container'>

            {/* left side*/}
            <div className='delivery-info-section'>

                <div className='delivery-info-title'>
                    <Title text1={'DELIVERY'} text2={' INFORMATION'}/>
                </div>
                <div className='name-inputs'>
                    <input className='delivery-input' type="text" placeholder='First name'/>
                    <input className='delivery-input' type="text" placeholder='Last name'/>
                </div>
                <input className='delivery-input' type="email" placeholder='Email address'/>
                <input className='delivery-input' type="text" placeholder='Street'/>
                <div className='city-state-inputs'>
                    <input className='delivery-input' type="text" placeholder='City'/>
                    <input className='delivery-input' type="text" placeholder='State'/>
                </div>
                <input className='delivery-input' type="number" placeholder='Phone'/>
            </div>
            {/* right side*/}
            <div className='order-summary-section'>
                <div className='cart-total-wrapper'>
                    <CartTotal/>
                </div>
                <div className='payment-method-section'>
                    <Title text1={'PAYMENT'} text2={' METHOD'} />
                    {/* method selection*/}
                    <div className='payment-method-options'>
                        <div onClick={()=>setMethod('stripe')} className='payment-option'>
                            <p className={`payment-radio-button ${method === 'stripe' ? 'active' : ''}`}></p>
                            <img className= 'stripe-logo' src={assets.stripe_logo} alt="Stripe Logo"/>
                        </div>
                        <div  onClick={()=>setMethod('cod')} className='payment-option'>
                            <p className={`payment-radio-button ${method === 'cod' ? 'active' : ''}`}></p>
                            <p className='cod-text'>CASH ON DELIVERY</p>
                        </div>
                    </div>
                </div>
                <div className='place-order-button-wrapper'>
                    <button onClick={()=>navigate('/orders')} className='place-order-button'>
                        PLACE ORDER
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder