import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import '../style/ProductItem.css';
import { ShopContext } from "../context/ShopContext.jsx";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);
    const { t } = useTranslation();

    return (
        <Link className='product-link' to={`/product/${id}`}>
            <div className='image-container'>
                <img className='product-image' src={image} alt={name} />
            </div>
            <p className='product-name'>{name}</p>
            <p className='product-price'>{currency}{price}</p>
            {/* Ví dụ mở rộng: <span className='badge'>{t('product.new')}</span> */}
        </Link>
    );
};

export default ProductItem;
