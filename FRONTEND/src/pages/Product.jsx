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
    const [activeTab, setActiveTab] = useState('description');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [newQuestion, setNewQuestion] = useState('');
    const [allQuestions, setAllQuestions] = useState([]);

    const fetchProductData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/sanpham/${productId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProductData(data);
            setImage(data.hinhAnh);

            const minPriceDetail = data.chiTietList.reduce((prev, current) =>
                (prev.gia < current.gia) ? prev : current
            );
            setSize(minPriceDetail.kichCo);
            setPrice(minPriceDetail.gia);
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/cauhoi/sanpham/${productId}`);
            if (!response.ok) throw new Error('Failed to fetch questions');
            const data = await response.json();
            setAllQuestions(data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    useEffect(() => {
        fetchProductData();
        fetchQuestions();
    }, [productId]);

    const handleSizeSelection = (selectedSize) => {
        setSize(selectedSize);
        const selectedDetail = productData.chiTietList.find(item => item.kichCo === selectedSize);
        if (selectedDetail) {
            setPrice(selectedDetail.gia);
        }
    };

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
            userId: user.maKH,
            maSP: productData.maSP,
            kichCo: size,
            soluong: 1,
            gia: price,
            anh: image,
        };

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

    const handleSubmitQuestion = async () => {
        if (!newQuestion.trim()) {
            alert('Vui lòng nhập câu hỏi.');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        const payload = {
            maSP: productData.maSP,
            maKH: user.maKH,
            noiDung: newQuestion,
            traLoi: null
        };

        try {
            const res = await fetch('http://localhost:8080/api/cauhoi/them', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to submit question');
            await res.json();
            alert('Câu hỏi đã được gửi!');
            setNewQuestion('');
            fetchQuestions();
        } catch (err) {
            console.error(err);
            alert('Không thể gửi câu hỏi');
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
                            <img src={assets.star_icon} alt="Star" key={index} />
                        ))}
                        <p>(122)</p>
                    </div>
                    <p className='product-price'>{currency}{price}</p>

                    <div className='product-size-selection'>
                        <p>{t('selectSize')}</p>
                        <div className='product-size-buttons'>
                            {productData.chiTietList?.map((item, index) => (
                                <button
                                    onClick={() => handleSizeSelection(item.kichCo)}
                                    className={item.kichCo === size ? 'selected' : ''}
                                    key={index}
                                >
                                    {item.kichCo} ({item.soLuong} còn)
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleAddToCart} className='add-to-cart-btn'>
                        {t('addToCart')}
                    </button>

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
                    <button
                        className={activeTab === 'description' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('description')}
                    >
                        {t('description')}
                    </button>
                    <button
                        className={activeTab === 'qa' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('qa')}
                    >
                        {t('productQnA') || 'Hỏi đáp'}
                    </button>
                </div>

                <div className='description-content'>
                    {activeTab === 'description' ? (
                        <p>{productData.moTa}</p>
                    ) : (
                        <div className="qa-section">
                            {allQuestions.length === 0 ? (
                                <p>{t('noQuestions') || 'Chưa có câu hỏi nào'}</p>
                            ) : (
                                allQuestions.map((q, index) => (
                                    <div className='qa-item' key={index}>
                                        <p><strong>Q:</strong> {q.noiDung}</p>
                                        <p><strong>A:</strong> {q.traLoi || 'Chưa có câu trả lời'}</p>
                                    </div>
                                ))
                            )}

                            <div className='qa-form'>
                                <textarea
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder="Nhập câu hỏi của bạn..."
                                    rows={3}
                                />
                                <button onClick={handleSubmitQuestion}>
                                    {t('submitQuestion') || 'Gửi câu hỏi'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <RelatedProduct
                categoryId={productData.maDanhMuc}
                typeId={productData.maType}
                productId={productData.maSP}
            />
        </div>
    );
};

export default Product;
