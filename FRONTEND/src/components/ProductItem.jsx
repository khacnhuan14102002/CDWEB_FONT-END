import React, { useContext } from 'react';
import '../style/ProductItem.css';
import { ShopContext } from "../context/ShopContext.jsx";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);
    return (
        <Link className='product-link' to={`/product/${id}`}>
            <div className='image-container'>
                <img className='product-image' src={image} alt="" />

            </div>
            <p className='product-name'>{name}</p>
            <p className='product-price'>{currency}{price}</p>
        </Link>
    );
}

export default ProductItem;