import React, { useEffect, useState } from 'react';
import '../style/AdminOrderManage.css';

const AdminOrderManage = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const fetchOrders = async (term = '') => {
        try {
            const url = term
                ? `http://localhost:8080/api/admin/orders/search?term=${encodeURIComponent(term)}`
                : 'http://localhost:8080/api/admin/orders';

            const res = await fetch(url);
            if (!res.ok) throw new Error("Lỗi khi tải dữ liệu");
            const data = await res.json();

            setOrders(data);
            setError(data.length === 0 ? 'Không tìm thấy đơn hàng nào.' : null);
        } catch (err) {
            setError("Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => fetchOrders(term), 400));
    };

    const handleUpdateStatus = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/admin/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trangThai: newStatus })
            });
            if (!res.ok) throw new Error("Cập nhật thất bại");
            await fetchOrders(searchTerm);
            setEditingStatusId(null);
        } catch (e) {
            alert("Lỗi cập nhật trạng thái");
        }
    };

    return (
        <div className="container">
            <h2 className="title">Quản lý đơn hàng</h2>

            <div style={{ marginBottom: '12px' }}>
                <input
                    type="text"
                    placeholder="Tìm theo tên khách hàng..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>

            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <table className="table">
                    <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Ngày đặt</th>
                        <th>Trạng thái</th>
                        <th>Phương thức</th>
                        <th>Tổng tiền</th>
                        <th>Chi tiết</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.maDH}>
                            <td>{order.maDH}</td>
                            <td>{order.khachHang?.hoTen}</td>
                            <td>{new Date(order.ngayDat).toLocaleDateString()}</td>
                            <td>
                                {editingStatusId === order.maDH ? (
                                    <>
                                        <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                            <option value="Chờ xử lý">Chờ xử lý</option>
                                            <option value="Đã xác nhận">Đã xác nhận</option>
                                            <option value="Đã giao">Đã giao</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                        </select>
                                        <button onClick={() => handleUpdateStatus(order.maDH)}>Lưu</button>
                                    </>
                                ) : (
                                    <>
                                        {order.trangThai}
                                        <button
                                            className="edit-status"
                                            onClick={() => {
                                                setEditingStatusId(order.maDH);
                                                setNewStatus(order.trangThai);
                                            }}
                                        >
                                            🖉
                                        </button>
                                    </>
                                )}
                            </td>
                            <td>{order.phuongThucThanhToan}</td>
                            <td>{order.tongTien.toLocaleString()} đ</td>
                            <td>
                                <button className="viewBtn" onClick={() => setSelectedOrder(order)}>
                                    Xem
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {selectedOrder && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Chi tiết đơn #{selectedOrder.maDH}</h3>
                        <p>Khách hàng: <strong>{selectedOrder.khachHang?.hoTen}</strong></p>
                        <p>Trạng thái:<strong> {selectedOrder.trangThai}</strong></p>
                        <p>Phương thức thanh toán: <strong>{selectedOrder.phuongThucThanhToan}</strong></p>
                        <table className="detail-table">
                            <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedOrder.chiTietDonHang.map(ct => (
                                <tr key={ct.maCT}>
                                    <td>
                                        <img
                                            src={ct.sanPham?.hinhAnh}
                                            alt={ct.sanPham?.tenSP}
                                            style={{ width: 60, height: 60, objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{ct.sanPham?.tenSP}</td>
                                    <td>{ct.soLuong}</td>
                                    <td>{ct.donGia.toLocaleString()} đ</td>
                                    <td>{ct.thanhTien.toLocaleString()} đ</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <button onClick={() => setSelectedOrder(null)}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderManage;
