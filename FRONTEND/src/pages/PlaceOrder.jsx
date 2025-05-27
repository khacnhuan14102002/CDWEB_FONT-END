import React, { useEffect, useState } from 'react';
import Title from "../components/Title.jsx";
import CartTotal from "../components/CartTotal.jsx";
import { assets } from "../assets/assets.js";
import { useNavigate } from 'react-router-dom';
import '../style/Place.css';

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const [cartData, setCartData] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    // Địa chỉ
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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [phone, setPhone] = useState('');

    // Lấy userId từ localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log("User ID:", user.maKH); // Kiểm tra userId
            setUserId(user.maKH);
        }
    }, []);

    // Fetch giỏ hàng từ backend
    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8080/api/cart/${userId}`)
                .then(res => res.json())
                .then(data => setCartData(data))
                .catch(err => console.error("Error fetching cart:", err));
        }
    }, [userId]);

    // Load tỉnh thành
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error('Error loading provinces:', err));
    }, []);

    // Load quận/huyện theo tỉnh
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

    // Load xã/phường theo quận/huyện
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

    // Hàm xử lý đặt hàng
    const handlePlaceOrder = () => {
        if (!userId) {
            alert("Bạn cần đăng nhập để đặt hàng.");
            return;
        }
        if (cartData.length === 0) {
            alert("Giỏ hàng trống.");
            return;
        }
        if (!firstName || !lastName || !email || !street || !phone || !provinceInput || !districtInput || !communeInput) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng.");
            return;
        }

        // Tạo địa chỉ đầy đủ
        const fullAddress = `${street}, ${communeInput}, ${districtInput}, ${provinceInput}`;
        const totalAmount = cartData.reduce((sum, item) => sum + item.gia * item.soLuong, 0);

        // Tạo dữ liệu đơn hàng, thêm ngày đặt
        const orderData = {
            maKH: userId,
            hoTenNguoiNhan: `${firstName} ${lastName}`,
            emailNguoiNhan: email,
            diaChiGiaoHang: fullAddress,
            soDienThoai: phone,
            phuongThucThanhToan: method,
            tongTien: totalAmount,
            ngayDat: new Date().toISOString(),
            diaChi: fullAddress,// Thêm ngày đặt đơn theo ISO
            chiTietDonHangList: cartData.map(item => ({
                maSP: item.maSP,
                kichCo: item.kichCo,
                soLuong: item.soLuong,
                gia: item.gia
            })),
        };

        fetch('http://localhost:8080/api/donhang', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        })
            .then(res => {
                if (!res.ok) throw new Error('Không thể tạo đơn hàng');
                return res.json();
            })
            .then(data => {
                alert("Đặt hàng thành công!");
                // Có thể xóa giỏ hàng nếu muốn
                navigate('/orders'); // Chuyển đến trang danh sách đơn hàng
            })
            .catch(err => {
                alert("Đã có lỗi xảy ra khi đặt hàng: " + err.message);
            });
    };

    return (
        <div className='place-order-container'>
            {/* LEFT SIDE: Delivery Info */}
            <div className='delivery-info-section'>
                <div className='delivery-info-title'>
                    <Title text1={'DELIVERY'} text2={' INFORMATION'} />
                </div>
                <div className='name-inputs'>
                    <input
                        className='delivery-input'
                        type="text"
                        placeholder='First name'
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <input
                        className='delivery-input'
                        type="text"
                        placeholder='Last name'
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                </div>
                <input
                    className='delivery-input'
                    type="email"
                    placeholder='Email address'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className='delivery-input'
                    type="text"
                    placeholder='Street'
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                />

                {/* Province autocomplete */}
                <div className="autocomplete-wrapper">
                    <input
                        className='delivery-input'
                        type="text"
                        placeholder='Province'
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

                {/* District autocomplete */}
                <div className="autocomplete-wrapper">
                    <input
                        className='delivery-input'
                        type="text"
                        placeholder='District '
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

                {/* Commune autocomplete */}
                <div className="autocomplete-wrapper">
                    <input
                        className='delivery-input'
                        type="text"
                        placeholder='Commune'
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
                    placeholder='Phone'
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
            </div>

            {/* RIGHT SIDE: Order Summary */}
            <div className='order-summary-section'>
                <div className='cart-total-wrapper'>
                    <CartTotal cartData={cartData} currency="$" />
                </div>

                <div className='payment-method-section'>
                    <Title text1={'PAYMENT'} text2={' METHOD'} />
                    <div className='payment-method-options'>
                        <div onClick={() => setMethod('stripe')} className='payment-option'>
                            <p className={`payment-radio-button ${method === 'stripe' ? 'active' : ''}`}></p>
                            <img className='stripe-logo' src={assets.stripe_logo} alt="Stripe Logo" />
                        </div>
                        <div onClick={() => setMethod('cod')} className='payment-option'>
                            <p className={`payment-radio-button ${method === 'cod' ? 'active' : ''}`}></p>
                            <p className='cod-text'>CASH ON DELIVERY</p>
                        </div>
                    </div>
                </div>

                <div className='place-order-button-wrapper'>
                    <button onClick={handlePlaceOrder} className='place-order-button'>
                        PLACE ORDER
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
