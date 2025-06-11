import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";
import RelatedProduct from "../components/RelatedProduct.jsx";
import "../style/Pro.css";
import { useTranslation } from 'react-i18next';

const Product = () => {
    const { productId } = useParams();
    const { currency } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');
    const [price, setPrice] = useState(0);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const fetchProductData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/sanpham/${productId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProductData(data);
            setImage(data.hinhAnh);

            // Chọn kích cỡ có giá thấp nhất mặc định
            const minPriceDetail = data.chiTietList.reduce((prev, current) => (prev.gia < current.gia) ? prev : current);
            setSize(minPriceDetail.kichCo);
            setPrice(minPriceDetail.gia);
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    useEffect(() => {
        fetchProductData();
    }, [productId]);

    // Cập nhật giá khi chọn size
    const handleSizeSelection = (selectedSize) => {
        setSize(selectedSize);
        const selectedDetail = productData.chiTietList.find(item => item.kichCo === selectedSize);
        if (selectedDetail) {
            setPrice(selectedDetail.gia);
        }
    };

    // Xử lý thêm giỏ hàng
    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }
        if (!size) {
            alert('Vui lòng chọn kích cỡ!');
            return;
        }

        const cartItem = {
            userId: user.maKH,          // user id lấy từ localStorage
            maSP: productData.maSP,
            kichCo: size,
            soluong: 1,
            gia: price,
            anh: image,              // Add image URL here
        };
        console.log('Cart Item:', cartItem);
        try {
            const res = await fetch('http://localhost:8080/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItem),
            });
            if (!res.ok) throw new Error('Failed to add to cart');
            await res.json();
            alert('Thêm vào giỏ hàng thành công!');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Lỗi khi thêm vào giỏ hàng');
        }
    };

    if (!productData) return <div>Loading...</div>;

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
                    <p className='product-price'>{currency}{price}</p>
                    <div className='product-size-selection'>
                        <p>{t('selectSize')}</p>
                        <div className='product-size-buttons'>
                            {productData.chiTietList && productData.chiTietList.map((item, index) => (
                                <button
                                    onClick={() => handleSizeSelection(item.kichCo)}
                                    className={item.kichCo === size ? 'selected' : ''}
                                    key={index}
                                >
                                    {item.kichCo} ({item.soLuong} available)
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleAddToCart} className='add-to-cart-btn'>{t('addToCart')}</button>
                    <hr className='product-info-divider' />
                    <div className='product-guarantee-info'>
                        <p>{t('originalProduct')}</p>
                        <p>{t('codAvailable')}</p>
                        <p>{t('easyReturn')}</p>
                    </div>
                </div>
            </div>
            <div className='description-reviews-section'>
                <div className='description-reviews-tabs'>
                    <b>{t('description')}</b>

                </div>
                <div className='description-content'>
                    <p>{productData.moTa}</p>
                </div>
            </div>
            <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
        </div>
    );
};

export default Product;
