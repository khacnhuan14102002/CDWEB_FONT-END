import React, { useState } from 'react';
import { Users, Package, ShoppingCart, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/anh/logo_1.png';
import styles from '../style/Admin/Admin.module.css'; // <--- Import CSS Module

const Admin = () => {
    const [selectedTab, setSelectedTab] = useState('users');
    const [editingProduct, setEditingProduct] = useState(null);
    const [productList, setProductList] = useState([
        {
            MaSP: 'SP001',
            TenSP: 'Áo thun',
            Loai: 'Đỏ',
            MoTa: 'Áo thun cotton cao cấp',
            Gia: '200,000đ',
            SoLuong: 50,
            HinhAnh: logo,
            MaDanhMuc: 'DM01',
            DoiTuong: 'Nam',
        },
    ]);
    const navigate = useNavigate();
    const handleOut = () => {
        navigate('/');
    };
    const [editingUser, setEditingUser] = useState(null);
    const [userList, setUserList] = useState([
        {
            MaKH: 'KH001',
            HoTen: 'Nguyễn Văn A',
            Email: 'nguyenvana@example.com',
            SoDienThoai: '0912345678',
            DiaChi: '123 Đường ABC, Quận 1, TP.HCM',
            NgayDangKy: '2023-01-15',
        },
        {
            MaKH: 'KH002',
            HoTen: 'Trần Thị B',
            Email: 'tranthib@example.com',
            SoDienThoai: '0987654321',
            DiaChi: '456 Đường XYZ, Quận Bình Thạnh, TP.HCM',
            NgayDangKy: '2023-03-20',
        },
    ]);
    const [userSearchTerm, setUserSearchTerm] = useState('');

    const handleEditProduct = (index) => {
        setEditingProduct({ ...productList[index], index });
    };

    const handleDeleteProduct = (index) => {
        const updatedList = productList.filter((_, i) => i !== index);
        setProductList(updatedList);
    };

    const handleChangeProduct = (e) => {
        const { name, value } = e.target;
        setEditingProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProduct = () => {
        const newList = [...productList];
        if (editingProduct.index != null) {
            newList[editingProduct.index] = { ...editingProduct };
            delete newList[editingProduct.index].index;
        } else {
            newList.push({ ...editingProduct, MaSP: `SP00${newList.length + 1}` });
        }
        setProductList(newList);
        setEditingProduct(null);
    };

    const handleCancelProduct = () => {
        setEditingProduct(null);
    };

    const [productSearchTerm, setProductSearchTerm] = useState('');

    const filteredProducts = productList.filter((product) => {
        const term = productSearchTerm.toLowerCase();
        return (
            product.MaSP.toLowerCase().includes(term) ||
            product.TenSP.toLowerCase().includes(term) ||
            product.Loai.toLowerCase().includes(term) ||
            product.MoTa.toLowerCase().includes(term) ||
            product.Gia.toLowerCase().includes(term) ||
            product.SoLuong.toString().includes(term) ||
            product.HinhAnh.toLowerCase().includes(term) ||
            product.MaDanhMuc.toLowerCase().includes(term) ||
            product.DoiTuong.toLowerCase().includes(term)
        );
    });

    const handleEditUser = (index) => {
        setEditingUser({ ...userList[index], index });
    };

    const handleDeleteUser = (index) => {
        const updatedList = userList.filter((_, i) => i !== index);
        setUserList(updatedList);
    };

    const handleChangeUser = (e) => {
        const { name, value } = e.target;
        setEditingUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveUser = () => {
        const newList = [...userList];
        if (editingUser.index != null) {
            newList[editingUser.index] = { ...editingUser };
            delete newList[editingUser.index].index;
        } else {
            newList.push({ ...editingUser, MaKH: `KH00${newList.length + 1}` });
        }
        setUserList(newList);
        setEditingUser(null);
    };

    const handleCancelUser = () => {
        setEditingUser(null);
    };

    const filteredUsers = userList.filter((user) => {
        const term = userSearchTerm.toLowerCase();
        return (
            user.MaKH.toLowerCase().includes(term) ||
            user.HoTen.toLowerCase().includes(term) ||
            user.Email.toLowerCase().includes(term) ||
            user.SoDienThoai.toLowerCase().includes(term) ||
            user.DiaChi.toLowerCase().includes(term) ||
            user.NgayDangKy.toLowerCase().includes(term)
        );
    });

    const handleLogout = () => {
        // history.push('/'); // Dùng navigate('/') thay cho history.push()
        navigate('/');
    };

    const renderContent = () => {
        switch (selectedTab) {
            case 'users':
                return (
                    <div>
                        <h2 className={styles['user-list-title']}>Danh sách người dùng</h2>

                        <div className={styles['user-actions']}>
                            <input
                                type="text"
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm người dùng..."
                                className={styles['search-input']}
                            />
                            <button
                                onClick={() => setEditingUser({ NgayDangKy: new Date().toISOString().slice(0, 10) })}
                                className={styles['add-user-button']}
                            >
                                + Thêm người dùng
                            </button>
                        </div>

                        <table className={styles['user-table']}>
                            <thead>
                            <tr>
                                <th>Mã KH</th>
                                <th>Họ Tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Ngày đăng ký</th>
                                <th>Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((u, i) => (
                                <tr key={i}>
                                    <td>{u.MaKH}</td>
                                    <td>{u.HoTen}</td>
                                    <td>{u.Email}</td>
                                    <td>{u.SoDienThoai}</td>
                                    <td>{u.DiaChi}</td>
                                    <td>{u.NgayDangKy}</td>
                                    <td className={styles['action-buttons']}>
                                        <button
                                            className={styles['edit-button']}
                                            onClick={() => handleEditUser(i)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className={styles['delete-button']}
                                            onClick={() => handleDeleteUser(i)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {editingUser && (
                            <div className={styles['edit-user-form']}>
                                <h3 className={styles['form-title']}>{editingUser.index != null ? 'Sửa người dùng' : 'Thêm người dùng'}</h3>
                                <div className={styles['form-grid']}>
                                    {['MaKH', 'HoTen', 'Email', 'SoDienThoai', 'DiaChi', 'NgayDangKy'].map(field => (
                                        <input
                                            key={field}
                                            name={field}
                                            value={editingUser[field] || ''}
                                            onChange={handleChangeUser}
                                            placeholder={field}
                                            className={styles['form-input']}
                                            readOnly={field === 'MaKH' && editingUser.index != null}
                                        />
                                    ))}
                                </div>
                                <div className={styles['form-buttons']}>
                                    <button
                                        className={styles['save-button']}
                                        onClick={handleSaveUser}
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        className={styles['cancel-button']}
                                        onClick={handleCancelUser}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'products':
                return (
                    <div>
                        <h2 className={styles['product-list-title']}>Danh sách sản phẩm</h2>

                        <div className={styles['product-actions']}>
                            <input
                                type="text"
                                value={productSearchTerm}
                                onChange={(e) => setProductSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm sản phẩm..."
                                className={styles['search-input']}
                            />
                            <button
                                onClick={() => setEditingProduct({})}
                                className={styles['add-product-button']}
                            >
                                + Thêm sản phẩm
                            </button>
                        </div>

                        <table className={styles['product-table']}>
                            <thead>
                            <tr>
                                <th>Mã SP</th>
                                <th>Tên SP</th>
                                <th>Loại</th>
                                <th>Mô tả</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Hình ảnh</th>
                                <th>Mã Danh Mục</th>
                                <th>Đối tượng</th>
                                <th>Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredProducts.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.MaSP}</td>
                                    <td>{p.TenSP}</td>
                                    <td>{p.Loai}</td>
                                    <td>{p.MoTa}</td>
                                    <td>{p.Gia}</td>
                                    <td>{p.SoLuong}</td>
                                    <td>
                                        <img src={p.HinhAnh} alt="product" className={styles['product-image']} />
                                    </td>
                                    <td>{p.MaDanhMuc}</td>
                                    <td>{p.DoiTuong}</td>
                                    <td className={styles['action-buttons']}>
                                        <button
                                            className={styles['edit-button']}
                                            onClick={() => handleEditProduct(i)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className={styles['delete-button']}
                                            onClick={() => handleDeleteProduct(i)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {editingProduct && (
                            <div className={styles['edit-product-form']}>
                                <h3 className={styles['form-title']}>{editingProduct.index != null ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h3>
                                <div className={styles['form-grid']}>
                                    {['MaSP','TenSP','Loai','MoTa','Gia','SoLuong','HinhAnh','MaDanhMuc','DoiTuong'].map(field => (
                                        <input
                                            key={field}
                                            name={field}
                                            value={editingProduct[field] || ''}
                                            onChange={handleChangeProduct}
                                            placeholder={field}
                                            className={styles['form-input']}
                                            readOnly={field === 'MaSP' && editingProduct.index != null}
                                        />
                                    ))}
                                </div>
                                <div className={styles['form-buttons']}>
                                    <button
                                        className={styles['save-button']}
                                        onClick={handleSaveProduct}
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        className={styles['cancel-button']}
                                        onClick={handleCancelProduct}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'orders':
                return <div>Quản lý đơn hàng: (xem đơn hàng, xử lý, hủy...)</div>;
        }
    };

    return (
        <div className={styles['admin-container']}>

            <div className={styles['admin-layout']}>
                {/* Sidebar */}
                <div className={styles['admin-sidebar']}>
                    <div
                        onClick={() => setSelectedTab('users')}
                        className={`${styles['sidebar-item']} ${selectedTab === 'users' ? styles['selected-users'] : ''}`}
                    >
                        {/* Lucide icons không có các class màu trực tiếp. Bạn cần định nghĩa màu trong CSS Module nếu muốn, hoặc dùng inline style nếu chỉ là 1 thuộc tính */}
                        <Users className={styles['sidebar-icon']} style={{ color: '#3498db' }} />
                        <span className={styles['sidebar-text']}>Người dùng</span>
                    </div>

                    <div
                        onClick={() => setSelectedTab('products')}
                        className={`${styles['sidebar-item']} ${selectedTab === 'products' ? styles['selected-products'] : ''}`}
                    >
                        <Package className={styles['sidebar-icon']} style={{ color: '#27ae60' }} />
                        <span className={styles['sidebar-text']}>Sản phẩm</span>
                    </div>

                    <div
                        onClick={() => setSelectedTab('orders')}
                        className={`${styles['sidebar-item']} ${selectedTab === 'orders' ? styles['selected-orders'] : ''}`}
                    >
                        <ShoppingCart className={styles['sidebar-icon']} style={{ color: '#9b59b6' }} />
                        <span className={styles['sidebar-text']}>Đơn hàng</span>
                    </div>

                    {/* New Logout Item */}
                    <div onClick={handleOut} className={styles['sidebar-item']}>
                        <LogOut className={styles['sidebar-icon']} style={{ color: '#e74c3c' }} />
                        <span className={styles['sidebar-text']}>Thoát</span>
                    </div>
                </div>

                {/* Main content */}
                <div className={styles['admin-content']}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Admin;