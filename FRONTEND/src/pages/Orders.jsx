import React, { useEffect, useState } from 'react';
import Title from "../components/Title.jsx";
import '../style/Order.css';
import { useTranslation } from 'react-i18next';

const Orders = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [expandedOrderIndex, setExpandedOrderIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    const currency = '$';
    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            fetch(`http://localhost:8080/api/donhang/khachhang/${parsedUser.maKH}`)
                .then(res => res.json())
                .then(data => {
                    const sortedOrders = data.sort((a, b) => b.maDH - a.maDH);
                    setOrders(sortedOrders);
                })
                .catch(err => console.error("Fetch error:", err));
        }
    }, []);

    const toggleExpand = (index) => {
        setExpandedOrderIndex(prev => (prev === index ? null : index));
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const goToPrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className='orders-container'>
            <div className='orders-title-wrapper'>
                <Title text1={t('order.my1')} text2={t('order.my2')} />
            </div>

            <div>
                {orders.length === 0 ? (
                    <p>{t('order.noOrders')}</p>

                ) : (
                    currentOrders.map((order, index) => (
                        <div key={order.maDH || index} className='order-item'>
                            <div className='order-summary' onClick={() => toggleExpand(index)}>
                                <p><strong>{t('order.order')} #{order.maDH}</strong> - {order.ngayDat}</p>
                                <p>{t('order.status')}: {order.trangThai}</p>
                                <p>{t('order.total')}: {currency}{order.tongTien}</p>
                                <p className='order-date'>{t('order.payment')}: {order.phuongThucThanhToan}</p>
                            </div>

                            {expandedOrderIndex === index && (
                                <div className='order-details-expanded'>
                                    {order.chiTietDonHang?.map((item, idx) => (
                                        <div key={idx} className='order-details'>
                                            <img
                                                className='order-image'
                                                src={item.sanPham?.hinhAnh}
                                                alt={item.sanPham?.tenSP || "Product"}
                                            />
                                            <div>

                                                <p className='order-name'>{item.sanPham?.tenSP}</p>
                                                <p className='order-price'>{currency}{item.donGia}</p>
                                                <p>{t('order.quantity')}: {item.soLuong}</p>
                                                <p>{t('order.size')}: {item.kichThuoc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {orders.length > ordersPerPage && (
                <div className="pagination">
                    <button
                        className="pagination-button"
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`pagination-button ${i + 1 === currentPage ? 'active-page' : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="pagination-button"
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default Orders;