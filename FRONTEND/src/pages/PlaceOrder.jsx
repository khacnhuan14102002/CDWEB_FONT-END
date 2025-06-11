import React, { useEffect, useState } from 'react';
import Title from "../components/Title.jsx";
import CartTotal from "../components/CartTotal.jsx";
import { assets } from "../assets/assets.js";
import { useNavigate } from 'react-router-dom';
import '../style/Place.css';
import { useTranslation } from 'react-i18next';
const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const [cartData, setCartData] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');

    const [provinceInput, setProvinceInput] = useState('');
    const [districtInput, setDistrictInput] = useState('');
    const [communeInput, setCommuneInput] = useState('');

    const [filteredProvinces, setFilteredProvinces] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [filteredCommunes, setFilteredCommunes] = useState([]);

    const [showProvinceSuggestions, setShowProvinceSuggestions] = useState(false);
    const [showDistrictSuggestions, setShowDistrictSuggestions] = useState(false);
    const [showCommuneSuggestions, setShowCommuneSuggestions] = useState(false);

    // Thông tin người nhận
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [phone, setPhone] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserId(user.maKH);
            setFullName(user.hoTen || '');
            setEmail(user.email || '');
            setPhone(user.soDienThoai || '');
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8080/api/cart/${userId}`)
                .then(res => res.json())
                .then(data => setCartData(data))
                .catch(err => console.error("Error fetching cart:", err));
        }
    }, [userId]);

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error('Error loading provinces:', err));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    setDistricts(data.districts);
                    setCommunes([]);
                    setSelectedDistrict('');
                    setSelectedCommune('');
                    setDistrictInput('');
                    setCommuneInput('');
                });
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    setCommunes(data.wards);
                    setSelectedCommune('');
                    setCommuneInput('');
                });
        }
    }, [selectedDistrict]);

    const handlePlaceOrder = async () => {
        if (!userId) {
            alert("Bạn cần đăng nhập để đặt hàng.");
            return;
        }
        if (cartData.length === 0) {
            alert("Giỏ hàng trống.");
            return;
        }
        if (!fullName || !email || !street || !phone || !provinceInput || !districtInput || !communeInput) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng.");
            return;
        }

        const fullAddress = `${street}, ${communeInput}, ${districtInput}, ${provinceInput}`;
        const totalAmount = cartData.reduce((sum, item) => sum + item.gia * item.soLuong, 0);

        const orderData = {
            khachHang: {
                maKH: userId
            },
            hoTenNguoiNhan: fullName,
            emailNguoiNhan: email,
            diaChiGiaoHang: fullAddress,
            soDienThoai: phone,
            phuongThucThanhToan: method,
            tongTien: totalAmount,
            ngayDat: new Date().toISOString(),
            diaChi: fullAddress
        };

        try {
            // Tạo đơn hàng
            const resOrder = await fetch('http://localhost:8080/api/donhang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!resOrder.ok) {
                const errorText = await resOrder.text();
                throw new Error('Không thể tạo đơn hàng: ' + errorText);
            }

            const createdOrder = await resOrder.json();
            const maDH = createdOrder.maDH;

            // Gửi từng chi tiết đơn hàng
            for (const item of cartData) {
                const chiTietData = {
                    maDH: maDH,
                    maSP: item.maSP,
                    kichThuoc: item.kichCo, // fallback nếu thiếu
                    soLuong: item.soLuong,
                    donGia: item.gia,
                    thanhTien: item.soLuong * item.gia
                };

                const resDetail = await fetch('http://localhost:8080/api/chitietdonhang', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(chiTietData),
                });

                if (!resDetail.ok) {
                    const errorText = await resDetail.text();
                    throw new Error('Lỗi khi tạo chi tiết đơn hàng: ' + errorText);
                }
            }

            // Xóa giỏ hàng
            const resClearCart = await fetch(`http://localhost:8080/api/cart/clear/${userId}`, {
                method: 'DELETE',
            });

            if (!resClearCart.ok) {
                throw new Error('Không thể xóa giỏ hàng.');
            }

            navigate('/orders');
            window.location.reload();
        } catch (err) {
            console.error("Order placement error:", err);
            alert("Đã có lỗi xảy ra khi đặt hàng: " + err.message);
        }
    };

    return (
        <div className='place-order-container'>
            <div className='delivery-info-section'>
                <div className='delivery-info-title'>
                    <Title text1={t('checkout.delivery1')} text2={t('checkout.delivery2')} />
                </div>

                <input
                    className='delivery-input'
                    type="text"
                    placeholder={t('checkout.fullName')}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                />
                <input
                    className='delivery-input'
                    type="email"
                    placeholder={t('checkout.email')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className='delivery-input'
                    type="text"
                    placeholder={t('checkout.street')}
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                />

                <div className="autocomplete-wrapper">
                    <input
                        className='delivery-input'
                        type="text"
                        placeholder={t('checkout.province')}
                        value={provinceInput}
                        onChange={e => {
                            const value = e.target.value;
                            setProvinceInput(value);
                            setFilteredProvinces(
                                provinces.filter(p =>
                                    p.name.toLowerCase().includes(value.toLowerCase())
                                )
                            );
                            setShowProvinceSuggestions(true);
                        }}
                        onFocus={() => setShowProvinceSuggestions(true)}
                    />
                    {showProvinceSuggestions && filteredProvinces.length > 0 && (
                        <ul className="suggestion-list">
                            {filteredProvinces.map(p => (
                                <li key={p.code} onClick={() => {
                                    setSelectedProvince(p.code);
                                    setProvinceInput(p.name);
                                    setShowProvinceSuggestions(false);
                                }}>
                                    {p.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="autocomplete-wrapper">
                    <input
                        className='delivery-input'
                        type="text"
                        placeholder={t('checkout.district')}
                        value={districtInput}
                        onChange={e => {
                            const value = e.target.value;
                            setDistrictInput(value);
                            setFilteredDistricts(
                                districts.filter(d =>
                                    d.name.toLowerCase().includes(value.toLowerCase())
                                )
                            );
                            setShowDistrictSuggestions(true);
                        }}
                        onFocus={() => setShowDistrictSuggestions(true)}
                        disabled={!districts.length}
                    />
                    {showDistrictSuggestions && filteredDistricts.length > 0 && (
                        <ul className="suggestion-list">
                            {filteredDistricts.map(d => (
                                <li key={d.code} onClick={() => {
                                    setSelectedDistrict(d.code);
                                    setDistrictInput(d.name);
                                    setShowDistrictSuggestions(false);
                                }}>
                                    {d.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="autocomplete-wrapper">
                    <input
                        className='delivery-input'
                        type="text"
                        placeholder={t('checkout.commune')}
                        value={communeInput}
                        onChange={e => {
                            const value = e.target.value;
                            setCommuneInput(value);
                            setFilteredCommunes(
                                communes.filter(c =>
                                    c.name.toLowerCase().includes(value.toLowerCase())
                                )
                            );
                            setShowCommuneSuggestions(true);
                        }}
                        onFocus={() => setShowCommuneSuggestions(true)}
                        disabled={!communes.length}
                    />
                    {showCommuneSuggestions && filteredCommunes.length > 0 && (
                        <ul className="suggestion-list">
                            {filteredCommunes.map(c => (
                                <li key={c.code} onClick={() => {
                                    setSelectedCommune(c.code);
                                    setCommuneInput(c.name);
                                    setShowCommuneSuggestions(false);
                                }}>
                                    {c.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <input
                    className='delivery-input'
                    type="tel"
                    placeholder={t('checkout.phone')}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
            </div>

            <div className='order-summary-section'>
                <div className='cart-total-wrapper'>
                    <CartTotal cartData={cartData} currency="$" />
                </div>

                <div className='payment-method-section'>
                    <Title text1={t('checkout.payment1')} text2={t('checkout.payment2')} />
                    <div className='payment-method-options'>
                        <div onClick={() => setMethod('stripe')} className='payment-option'>
                            <p className={`payment-radio-button ${method === 'stripe' ? 'active' : ''}`}></p>
                            <img className='stripe-logo' src={assets.stripe_logo} alt="Stripe Logo" />
                        </div>
                        <div onClick={() => setMethod('cod')} className='payment-option'>
                            <p className={`payment-radio-button ${method === 'cod' ? 'active' : ''}`}></p>
                            <p className='cod-text'>{t('checkout.cashOnDelivery')}</p>

                        </div>
                    </div>
                </div>

                <div className='place-order-button-wrapper'>
                    <button onClick={handlePlaceOrder} className='place-order-button'>
                        {t('checkout.checkout')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
