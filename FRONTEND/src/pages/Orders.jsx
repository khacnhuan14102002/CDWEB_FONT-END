// Orders.jsx
import React, {useContext} from 'react'
import {ShopContext} from "../context/ShopContext.jsx";
import Title from "../components/Title.jsx";
import '../style/Order.css'

const Orders = () =>  {
    const {products , currency} = useContext(ShopContext);

    return (

        <div className='orders-container'>
            <div className='orders-title-wrapper'>
                <Title text1={'MY'} text2={' ORDERS'}/>
            </div>
            <div>
                {
                    products.slice(1,4).map((item,index)=>(
                        <div key={index} className='order-item'>
                            <div className='order-details'>
                                <img className='order-image' src={item.image[0]} alt=""/>
                                <div>
                                    <p className='order-name'>{item.name}</p>
                                    <div className='order-info'>
                                        <p className='order-price'>{currency}{item.price}</p>
                                        <p>Quantity:1</p>
                                        <p>Size: M</p>
                                    </div>
                                    <p className='order-date'>Date: <span className='order-date-value'>25,june 2025</span> </p>
                                </div>
                            </div>
                            <div className='order-actions'>
                                <div className='order-status'>
                                    <p className='status-indicator'></p>
                                    <p className='status-text'>Ready to ship</p>
                                </div>
                                <button className='track-order-button'>Track Order</button>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Orders