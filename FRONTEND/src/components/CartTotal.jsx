import React from 'react';
import Title from "./Title.jsx";
import '../style/CartTotal.css';

const CartTotal = ({ cartData, currency = "$", delivery_fee = 2 }) => {
    const subtotal = cartData.reduce(
        (sum, item) => sum + item.gia * item.soLuong, 0
    );
    const total = cartData.length === 0 ? 0 : subtotal + delivery_fee;

    return (
        <div className='cart-total-container'>
            <div className='cart-total-title'>
                <Title text1={'CART'} text2={' TOTAL'} />
            </div>
            <div className='cart-total-details'>
                <div className='cart-total-row'>
                    <p>Subtotal</p>
                    <p>{currency}{subtotal.toFixed(2)}</p>
                </div>
                <hr className='cart-total-divider-subtotal' />
                <div className='cart-total-row'>
                    <p>Shipping Fee</p>
                    <p>{currency}{delivery_fee.toFixed(2)}</p>
                </div>
                <hr className='cart-total-divider-shipping' />
                <div className='cart-total-row cart-total-row-total'>
                    <p>Total</p>
                    <p>{currency}{total.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;
