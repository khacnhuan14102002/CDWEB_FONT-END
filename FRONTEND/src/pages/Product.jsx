import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";
import RelatedProduct from "../components/RelatedProduct.jsx";
import "../style/Pro.css";

const Product = () => {
    const { productId } = useParams();
    const { currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(null); // Initialize as null
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');

    const fetchProductData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/sanpham/${productId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProductData(data);

            setImage(data.hinhAnh); // Set to the single image string
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    useEffect(() => {
        fetchProductData();
    }, [productId]);
    console.log("Image URL:", image);
    // Check if productData is defined and has the necessary properties
    if (!productData) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div className='product-page-container'>
            <div className='product-data-section'>
                <div className='product-image-gallery'>
                    <div className='product-main-image'>
                        <img src={image} alt={productData.tenSP} />
                    </div>
                </div>
                <div className='product-info-section'>
                    <h1>{productData.tenSP}</h1>
                    <div className='product-rating'>
                        {[...Array(5)].map((_, index) => (
                            <img src={assets.star_icon} alt="Star rating" key={index} />
                        ))}
                        <p>(122)</p>
                    </div>
                    <p className='product-price'>{currency}{productData.gia}</p>
                    <p className='product-description'>{productData.moTa}</p>
                    <div className='product-size-selection'>
                        <p>Select Size</p>
                        <div className='product-size-buttons'>
                            {Array.isArray(productData.sizes) && productData.sizes.map((item, index) => (
                                <button
                                    onClick={() => setSize(item)}
                                    className={item === size ? 'selected' : ''}
                                    key={index}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => addToCart(productData.maSP, size)} className='add-to-cart-btn'>ADD TO CART</button>
                    <hr className='product-info-divider' />
                    <div className='product-guarantee-info'>
                        <p>100% Original product</p>
                        <p>Cash on delivery is available on this product</p>
                        <p>Easy return and exchange policy within 7 days</p>
                    </div>
                </div>
            </div>
            <div className='description-reviews-section'>
                <div className='description-reviews-tabs'>
                    <b>Description</b>
                    <p>Reviews(22)</p>
                </div>
                <div className='description-content'>
                    <p>{productData.moTa}</p>
                </div>
            </div>
            <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
        </div>
    );
}

export default Product;