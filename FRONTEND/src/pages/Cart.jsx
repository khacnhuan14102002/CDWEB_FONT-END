import React, {useContext, useEffect, useState} from 'react'
import {ShopContext} from "../context/ShopContext.jsx";
import Title from "../components/Title.jsx";
import {assets} from "../assets/assets.js";
import '../style/Cart.css';
import CartTotal from "../components/CartTotal.jsx"; // Import the CSS file

const Cart = () =>  {
    const {products, currency, cartItem, updateQuantity,navigate} = useContext(ShopContext); // Added updateQuantity here
    const [cartData,setCartData] = useState([]);

    useEffect(() => {
        const tempData = [];
        for(const  items in cartItem) {
            for (const item in cartItem[items]) {
                if(cartItem[items][item] > 0){
                    tempData.push({
                        _id:items,
                        size:item,
                        quantity:cartItem[items][item]
                    })
                }
            }
        }
        setCartData(tempData);
    }, [cartItem]);

    return (
        <div className='cart-container'>
            <div className='cart-title'>
                <Title text1={'YOUR'} text2={' CART'}/>
            </div>
            <div>
                {cartData.map((item,index)=>{
                    const  productData = products.find((product)=>product._id === item._id);
                    return (
                        <div key={index} className='cart-item'>
                            <div className='cart-item-details'>
                                <img className='cart-item-image' src={productData.image[0]} alt=""/>
                                <div>
                                    <p className='cart-item-name'>{productData.name}</p>
                                    <div className='cart-item-info'>
                                        <p>{currency}{productData.price}</p>
                                        <p className='cart-item-size'>{item.size}</p>
                                    </div>
                                </div>
                            </div>
                            <input onChange={(e)=>(e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id,item.size,Number(e.target.value)))} className='cart-item-quantity-input'  type="number" min={1} defaultValue={item.quantity}/>
                            <img onClick={()=>updateQuantity(item._id,item.size,0)} className='cart-item-remove-icon' src={assets.bin_icon} alt=""/>
                        </div>
                    )
                })}
            </div>
            <div className='cart-summary-container'>
                <div className='cart-total-wrapper'>
                    <CartTotal/>
                    <div className='checkout-button-container'>
                        <button
                            onClick={() => navigate('/place-order')}
                            className='checkout-button'>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart