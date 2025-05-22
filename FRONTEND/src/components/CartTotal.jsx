import React, {useContext} from 'react'
import {ShopContext} from "../context/ShopContext.jsx";
import Title from "./Title.jsx";
import '../style/CartTotal.css'; // Import the CSS file

const CartTotal = () => {
    const {currency,delivery_fee, getCartAmount} = useContext(ShopContext);

    return (
        <div className='cart-total-container'>
            <div className='cart-total-title'>
                <Title text1={'CART'} text2={' TOTAL'}/>
            </div>
            <div className='cart-total-details'>
                <div className='cart-total-row'>
                    <p>Subtotal</p>
                    <p>{currency} {getCartAmount()}.00</p>
                </div>
                {/* The line below this is implied by the divider in the image,
                but in your code, an hr is used, so let's adjust it */}
                <hr className='cart-total-divider-subtotal'/> {/* NEW: Add a specific divider */}
                <div className='cart-total-row'>
                    <p>Shipping Fee</p>
                    <p>{currency}{delivery_fee}.00</p>
                </div>
                <hr className='cart-total-divider-shipping'/> {/* NEW: Add a specific divider */}

                <div className='cart-total-row cart-total-row-total'> {/* NEW CLASS HERE */}
                    <p>Total</p>
                    <p>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</p>
                </div>

            </div>
        </div>
    );
}

export default CartTotal