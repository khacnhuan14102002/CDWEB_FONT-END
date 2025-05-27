import React, { useEffect, useState } from 'react';
import Title from "../components/Title.jsx";
import { assets } from "../assets/assets.js";
import '../style/Cart.css';
import CartTotal from "../components/CartTotal.jsx";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [cartData, setCartData] = useState([]);
    const [currency, setCurrency] = useState('$');
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    // State lưu giá trị input tạm thời
    const [inputValues, setInputValues] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserId(user.maKH);
        }
    }, []);

    useEffect(() => {
        const fetchCartData = async () => {
            if (userId) {
                try {
                    const response = await fetch(`http://localhost:8080/api/cart/${userId}`);
                    const data = await response.json();
                    setCartData(data);

                    // Đồng bộ inputValues với dữ liệu từ server
                    const inputs = {};
                    data.forEach(item => {
                        inputs[item.id] = item.soLuong;
                    });
                    setInputValues(inputs);
                } catch (error) {
                    console.error("Error fetching cart data:", error);
                }
            }
        };

        fetchCartData();
    }, [userId]);

    const updateQuantity = async (id, kichCo, newQuantity) => {
        if (newQuantity === 0) {
            // Xóa sản phẩm
            try {
                await fetch(`http://localhost:8080/api/cart/remove/${id}`, {
                    method: 'DELETE',
                });
                setCartData(prev => prev.filter(item => item.id !== id));
                setInputValues(prev => {
                    const newInputs = { ...prev };
                    delete newInputs[id];
                    return newInputs;
                });
            } catch (error) {
                console.error("Error removing item:", error);
            }
        } else {
            // Cập nhật số lượng
            try {
                const updatedItem = {
                    soLuong: newQuantity,
                };
                await fetch(`http://localhost:8080/api/cart/update/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedItem),
                });

                setCartData(prev =>
                    prev.map(item =>
                        item.id === id ? { ...item, soLuong: newQuantity } : item
                    )
                );
                setInputValues(prev => ({ ...prev, [id]: newQuantity }));
            } catch (error) {
                console.error("Error updating quantity:", error);
            }
        }
    };

    const handleCheckout = () => {
        if (cartData.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        navigate('/place-order');
    };

    return (
        <div className='cart-container'>
            <div className='cart-title'>
                <Title text1={'YOUR'} text2={' CART'} />
            </div>
            <div>
                {cartData.map((item) => (
                    <div key={item.id} className='cart-item'>
                        <div className='cart-item-details'>
                            <img className='cart-item-image' src={item.anh} alt="" />
                            <div>
                                <p className='cart-item-name'>{item.tenSP}</p>
                                <div className='cart-item-info'>
                                    <p>{currency}{item.gia}</p>
                                    <p className='cart-item-size'>{item.kichCo}</p>
                                </div>
                            </div>
                        </div>
                        <input
                            type="number"
                            min={1}
                            className='cart-item-quantity-input'
                            value={inputValues[item.id] !== undefined ? inputValues[item.id] : item.soLuong}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Cho phép nhập rỗng để sửa, hoặc số nguyên >= 1
                                if (value === '' || (/^\d+$/.test(value) && Number(value) >= 1)) {
                                    setInputValues(prev => ({ ...prev, [item.id]: value }));
                                }
                            }}
                            onBlur={() => {
                                const inputValRaw = inputValues[item.id];
                                const value = Number(inputValRaw);

                                // Lấy số lượng hiện tại từ cartData mới nhất
                                const currentItem = cartData.find(i => i.id === item.id);
                                const currentQty = currentItem ? currentItem.soLuong : 0;

                                if (!inputValRaw || value < 1) {
                                    // Reset lại nếu input không hợp lệ
                                    setInputValues(prev => ({ ...prev, [item.id]: currentQty }));
                                    return;
                                }

                                if (value !== currentQty) {
                                    updateQuantity(item.id, item.kichCo, value);
                                } else {
                                    // Reset lại nếu không thay đổi
                                    setInputValues(prev => ({ ...prev, [item.id]: currentQty }));
                                }
                            }}
                        />
                        <img
                            onClick={() => updateQuantity(item.id, item.kichCo, 0)}
                            className='cart-item-remove-icon'
                            src={assets.bin_icon}
                            alt="Remove item"
                        />
                    </div>
                ))}
            </div>
            <div className='cart-summary-container'>
                <div className='cart-total-wrapper'>
                    <CartTotal cartData={cartData} currency={currency} />
                    <div className='checkout-button-container'>
                        <button className='checkout-button' onClick={handleCheckout}>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
