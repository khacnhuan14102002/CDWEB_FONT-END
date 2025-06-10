import { Users, Package, ShoppingCart, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/anh/logo_2.png';
import styles from '../style/Admin/Admin.module.css';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Admin = () => {
    const [selectedTab, setSelectedTab] = useState('products');
    const [editingProduct, setEditingProduct] = useState(null);
    const [productList, setProductList] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [errorProducts, setErrorProducts] = useState(null);

    const [danhMucList, setDanhMucList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);
    const [errorTypes, setErrorTypes] = useState(null);

    const navigate = useNavigate();
    const handleOut = () => {
        navigate('/');
    };
    const [users, setUsers] = useState([]); // State để lưu trữ danh sách người dùng
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu
    const [error, setError] = useState(null); // State để lưu trữ lỗi nếu có
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const [userList, setUserList] = useState([
        // ... dữ liệu người dùng tĩnh ...
    ]);


    // --- CẬP NHẬT: Function to fetch products and flatten chiTietList ---
    const fetchProducts = useCallback(async () => {
        setLoadingProducts(true);
        setErrorProducts(null);
        try {
            const response = await axios.get('http://localhost:8080/api/sanpham');
            const flattenedProducts = [];

            response.data.forEach(p => {
                if (p.chiTietList && p.chiTietList.length > 0) {
                    p.chiTietList.forEach((chiTiet, index) => {
                        flattenedProducts.push({
                            // Thông tin sản phẩm chung
                            maSP: p.maSP,
                            tenSP: p.tenSP,
                            moTa: p.moTa,
                            hinhAnh: p.hinhAnh,
                            danhMuc: p.danhMuc,
                            type: p.type,
                            TenDanhMuc: p.tenDanhMuc || 'Không xác định',
                            TenDoiTuong: p.tenType || 'Không xác định',

                            // Thông tin chi tiết sản phẩm
                            chiTietId: chiTiet.id, // ID của chi tiết
                            kichCo: chiTiet.kichCo,
                            gia: chiTiet.gia,
                            soLuong: chiTiet.soLuong,

                            // Các trường khác cho hiển thị trong bảng
                            GiaFormatted: chiTiet.gia.toLocaleString('vi-VN') + 'đ',
                            IsFirstDetail: index === 0
                        });
                    });
                } else {
                    // Xử lý trường hợp sản phẩm không có chi tiết nào
                    flattenedProducts.push({
                        maSP: p.maSP,
                        tenSP: p.tenSP,
                        moTa: p.moTa,
                        hinhAnh: p.hinhAnh,
                        danhMuc: p.danhMuc,
                        type: p.type,
                        TenDanhMuc: p.tenDanhMuc || 'Không xác định',
                        TenDoiTuong: p.tenType || 'Không xác định',

                        chiTietId: null, // Không có chi tiết
                        kichCo: 'N/A',
                        gia: 0,
                        soLuong: 0,
                        GiaFormatted: 'N/A',
                        IsFirstDetail: true // Coi như là chi tiết đầu tiên nếu không có chi tiết
                    });
                }
            });
            setProductList(flattenedProducts);
            setLoadingProducts(false);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
            setErrorProducts('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
            setLoadingProducts(false);
        }
    }, []);

    // --- Function to fetch categories ---
    const fetchCategories = useCallback(async () => {
        setLoadingCategories(true);
        setErrorCategories(null);
        try {
            const danhMucResponse = await axios.get('http://localhost:8080/api/danhmuc');
            setDanhMucList(danhMucResponse.data);
            setLoadingCategories(false);
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            setErrorCategories('Không thể tải danh sách danh mục.');
            setLoadingCategories(false);
        }
    }, []);

    // --- Function to fetch types ---
    const fetchTypes = useCallback(async () => {
        setLoadingTypes(true);
        setErrorTypes(null);
        try {
            const typeResponse = await axios.get('http://localhost:8080/api/type');
            setTypeList(typeResponse.data);
            setLoadingTypes(false);
        } catch (error) {
            console.error('Lỗi khi tải loại:', error);
            setErrorTypes('Không thể tải danh sách loại.');
            setLoadingTypes(false);
        }
    }, []);

    // --- EFFECT TO FETCH ALL DATA ---
    useEffect(() => {
        if (selectedTab === 'products') {
            fetchProducts();
            fetchCategories();
            fetchTypes();
        }
    }, [selectedTab, fetchProducts, fetchCategories, fetchTypes]);

    // --- CẬP NHẬT: handleEditProduct để chuẩn bị dữ liệu cho form chỉnh sửa ---
    const handleEditProduct = async (productToEdit) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/sanpham/${productToEdit.maSP}`);
            const fullProductData = response.data;

            setEditingProduct({
                ...fullProductData,
                chiTietList: fullProductData.chiTietList && fullProductData.chiTietList.length > 0
                    ? JSON.parse(JSON.stringify(fullProductData.chiTietList))
                    : [{ id: null, kichCo: '', gia: 0, soLuong: 0 }],
                // Explicitly set the ID for the dropdowns to pre-select
                danhMuc: fullProductData.danhMuc || null,
                // NEW: Use the ID for pre-selection in the dropdown
                selectedDanhMucId: fullProductData.danhMuc ? fullProductData.danhMuc.maDanhMuc : '',
                type: fullProductData.type || null,
                // NEW: Use the ID for pre-selection in the dropdown
                selectedTypeId: fullProductData.type ? fullProductData.type.maType : '',
                originalIndex: productList.findIndex(p => p.maSP === productToEdit.maSP && p.chiTietId === productToEdit.chiTietId)
            });
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm để chỉnh sửa:', error);
            alert('Không thể tải chi tiết sản phẩm. Vui lòng thử lại.');
        }
    };



    const handleDeleteProduct = async (productToDelete) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete.tenSP}"?`)) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8080/api/sanpham/${productToDelete.maSP}`);
            fetchProducts();
            alert('Xóa sản phẩm thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
        }
    };

    const handleChangeProduct = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseInt(value); // Parse value to number for ID comparison

        if (name === "danhMuc") {
            const selectedDanhMuc = danhMucList.find(dm => dm.maDanhMuc === parsedValue);
            setEditingProduct((prev) => ({
                ...prev,
                danhMuc: selectedDanhMuc,
                TenDanhMuc: selectedDanhMuc ? selectedDanhMuc.tenDanhMuc : 'Không xác định',
                selectedDanhMucId: parsedValue // Update the dedicated ID state
            }));
        } else if (name === "type") {
            const selectedType = typeList.find(t => t.maType === parsedValue);
            setEditingProduct((prev) => ({
                ...prev,
                type: selectedType,
                TenDoiTuong: selectedType ? selectedType.tenType : 'Không xác định',
                selectedTypeId: parsedValue // Update the dedicated ID state
            }));
        } else {
            setEditingProduct((prev) => ({ ...prev, [name]: value }));
        }
    };

    // --- MỚI: Xử lý thay đổi cho từng chi tiết sản phẩm ---
    const handleChangeChiTiet = (index, e) => {
        const { name, value, type } = e.target;
        const newChiTietList = [...editingProduct.chiTietList];

        if (type === 'number') {
            newChiTietList[index][name] = parseFloat(value) || 0;
        } else {
            newChiTietList[index][name] = value;
        }

        setEditingProduct((prev) => ({
            ...prev,
            chiTietList: newChiTietList,
        }));
    };

    // --- MỚI: Thêm chi tiết sản phẩm mới ---
    const handleAddChiTiet = () => {
        setEditingProduct((prev) => ({
            ...prev,
            chiTietList: [...prev.chiTietList, { id: null, kichCo: '', gia: 0, soLuong: 0 }],
        }));
    };

    // --- MỚI: Xóa một chi tiết sản phẩm ---
    const handleRemoveChiTiet = (indexToRemove) => {
        setEditingProduct((prev) => ({
            ...prev,
            chiTietList: prev.chiTietList.filter((_, index) => index !== indexToRemove),
        }));
    };


    const handleSaveProduct = async () => {
        if (!editingProduct.tenSP || !editingProduct.hinhAnh) {
            alert('Tên sản phẩm và hình ảnh không được để trống.');
            return;
        }
        if (!editingProduct.danhMuc || !editingProduct.danhMuc.maDanhMuc) {
            alert('Vui lòng chọn Danh Mục cho sản phẩm.');
            return;
        }
        if (!editingProduct.type || !editingProduct.type.maType) {
            alert('Vui lòng chọn Đối tượng (Type) cho sản phẩm.');
            return;
        }

        // Validate chiTietList
        if (!editingProduct.chiTietList || editingProduct.chiTietList.length === 0) {
            alert('Sản phẩm phải có ít nhất một chi tiết (kích cỡ, giá, số lượng).');
            return;
        }
        for (const chiTiet of editingProduct.chiTietList) {
            if (!chiTiet.kichCo || chiTiet.gia <= 0 || chiTiet.soLuong < 0) {
                alert('Tất cả chi tiết sản phẩm phải có kích cỡ, giá lớn hơn 0, và số lượng không âm.');
                return;
            }
        }


        const productPayload = {
            maSP: editingProduct.maSP || null,
            tenSP: editingProduct.tenSP,
            moTa: editingProduct.moTa || '',
            hinhAnh: editingProduct.hinhAnh,
            danhMuc: editingProduct.danhMuc,
            type: editingProduct.type,
            chiTietList: editingProduct.chiTietList.map(ct => ({
                id: ct.id, // Giữ ID nếu là chi tiết đã tồn tại
                kichCo: ct.kichCo,
                gia: ct.gia,
                soLuong: ct.soLuong
            })),
        };

        try {
            if (editingProduct.maSP) { // Kiểm tra maSP để xác định là cập nhật hay thêm mới
                await axios.put(`http://localhost:8080/api/sanpham/${editingProduct.maSP}`, productPayload);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await axios.post('http://localhost:8080/api/sanpham', productPayload);
                alert('Thêm sản phẩm thành công!');
            }
            setEditingProduct(null);
            fetchProducts(); // Tải lại danh sách sản phẩm sau khi lưu
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error.message);
            if (error.response && error.response.data) {
                alert(`Không thể lưu sản phẩm: ${error.response.data.message || error.response.statusText}`);
            } else {
                alert('Không thể lưu sản phẩm. Vui lòng kiểm tra lại thông tin.');
            }
        }
    };

    const handleCancelProduct = () => {
        setEditingProduct(null);
    };

    const [productSearchTerm, setProductSearchTerm] = useState('');

    const filteredProducts = productList.filter((product) => {
        const term = productSearchTerm.toLowerCase();
        return (
            (product.maSP && product.maSP.toString().toLowerCase().includes(term)) ||
            (product.tenSP && product.tenSP.toLowerCase().includes(term)) ||
            (product.kichCo && product.kichCo.toLowerCase().includes(term)) || // Thêm tìm kiếm theo kích cỡ
            (product.moTa && product.moTa.toLowerCase().includes(term)) ||
            (product.GiaFormatted && product.GiaFormatted.toLowerCase().includes(term)) || // Tìm theo giá đã định dạng
            (product.soLuong && product.soLuong.toString().toLowerCase().includes(term)) || // Tìm theo số lượng của chi tiết
            (product.hinhAnh && product.hinhAnh.toLowerCase().includes(term)) ||
            (product.TenDanhMuc && product.TenDanhMuc.toLowerCase().includes(term)) ||
            (product.TenDoiTuong && product.TenDoiTuong.toLowerCase().includes(term))
        );
    });

    // --- Phần quản lý người dùng giữ nguyên ---
    const handleEditUser = (index) => {
        setEditingUser({ ...userList[index], index });
    };
    const handleDeleteUser = async (index) => {
        // Get the actual user object to access its maKH (ID)
        const userToDelete = filteredUsers[index];
        if (!userToDelete || !userToDelete.maKH) {
            console.error("User or user ID not found for deletion.");
            return;
        }

        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${userToDelete.hoTen} không?`)) {
            try {
                const response = await fetch(`http://localhost:8080/api/khachhang/${userToDelete.maKH}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // If deletion is successful, update the UI by removing the deleted user
                setUsers(prevUsers => prevUsers.filter(user => user.maKH !== userToDelete.maKH));
                alert("Người dùng đã được xóa thành công!");
            } catch (error) {
                console.error("Could not delete user:", error);
                setError("Không thể xóa người dùng. Vui lòng thử lại sau.");
            }
        }
    };

    const handleChangeUser = (e) => {
        const { name, value } = e.target;
        setEditingUser(prev => ({ ...prev, [name]: value }));
    };



    const handleCancelUser = () => {
        setEditingUser(null);
    };

    const filteredUsers = users.filter(user => {
        const hoTen = user.HoTen ? user.HoTen.toLowerCase() : ''; // Nếu HoTen là null/undefined, coi như chuỗi rỗng
        const email = user.Email ? user.Email.toLowerCase() : ''; // Nếu Email là null/undefined, coi như chuỗi rỗng
        const soDienThoai = user.SoDienThoai ? user.SoDienThoai.toLowerCase() : ''; // Nếu SoDienThoai là null/undefined, coi như chuỗi rỗng

        const searchTermLower = userSearchTerm.toLowerCase();

        return (
            hoTen.includes(searchTermLower) ||
            email.includes(searchTermLower) ||
            soDienThoai.includes(searchTermLower)
        );
    });

    const handleLogout = () => {
        navigate('/');
    };
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/khachhang'); // Endpoint GET ALL
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data); // Cập nhật state với dữ liệu người dùng
            } catch (error) {
                console.error("Could not fetch users:", error);
                setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
            } finally {
                setLoading(false); // Đặt trạng thái tải thành false dù thành công hay thất bại
            }
        };

        fetchUsers();
    }, [])
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

                        {loading && <p>Đang tải danh sách người dùng...</p>}
                        {error && <p className={styles['error-message']}>{error}</p>}

                        {!loading && !error && (
                            <table className={styles['user-table']}>
                                <thead>
                                <tr>
                                    <th>Mã KH</th>
                                    <th>Họ Tên</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Ngày đăng ký</th>
                                    <th>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.map((u, i) => (
                                    <tr key={u.maKH || i}> {}
                                        <td>{u.maKH}</td> {}
                                        <td>{u.hoTen}</td> {}
                                        <td>{u.email}</td> {}
                                        <td>{u.soDienThoai}</td> {}
                                        <td>{u.ngayDangKy}</td>
                                        <td className={styles['action-buttons']}>
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
                        )}

                        {editingUser && (
                            <div className={styles['edit-user-form']}>
                                <h3 className={styles['form-title']}>{editingUser.index != null ? 'Sửa người dùng' : 'Thêm người dùng'}</h3>
                                <div className={styles['form-grid']}>
                                    {[
                                        'maKH',        // Thay đổi từ 'MaKH'
                                        'hoTen',       // Thay đổi từ 'HoTen'
                                        'email',       // Thay đổi từ 'Email'
                                        'soDienThoai', // Thay đổi từ 'SoDienThoai'
                                        'diaChi',      // Thay đổi từ 'DiaChi' (đảm bảo model KhachHang có diaChi)
                                        'matKhau',     // Thay đổi từ 'MatKhau'
                                        'ngayDangKy'   // Thay đổi từ 'NgayDangKy'
                                    ].map(field => (
                                        <input
                                            key={field}
                                            name={field}
                                            value={editingUser[field] || ''}
                                            onChange={handleChangeUser}
                                            placeholder={field === 'maKH' ? 'Mã Khách Hàng (Tự động)' : field}
                                            className={styles['form-input']}
                                            readOnly={field === 'maKH' && editingUser.index != null}
                                            type={field === 'matKhau' ? 'password' : 'text'}
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
                                onClick={() => setEditingProduct({
                                    maSP: null, tenSP: '', moTa: '', hinhAnh: '',
                                    danhMuc: null, type: null,
                                    selectedDanhMucId: '', // Initialize for new product
                                    selectedTypeId: '',     // Initialize for new product
                                    chiTietList: [{ id: null, kichCo: '', gia: 0, soLuong: 0 }],
                                    TenDanhMuc: 'Chưa chọn', TenDoiTuong: 'Chưa chọn'
                                })}
                                className={styles['add-product-button']}
                            >
                                + Thêm sản phẩm
                            </button>
                        </div>

                        {loadingProducts || loadingCategories || loadingTypes ? (
                            <p>Đang tải dữ liệu sản phẩm, danh mục và loại...</p>
                        ) : errorProducts || errorCategories || errorTypes ? (
                            <p className={styles['error-message']}>
                                {errorProducts} {errorCategories} {errorTypes}
                            </p>
                        ) : (
                            <table className={styles['product-table']}>
                                <thead>
                                <tr>
                                    <th>Mã SP</th>
                                    <th>Tên SP</th>
                                    <th>Mô tả</th>
                                    <th>Hình ảnh</th>
                                    <th>Danh Mục</th>
                                    <th>Đối tượng</th>
                                    <th>Kích cỡ</th> {/* Cột mới */}
                                    <th>Giá</th>      {/* Cột mới */}
                                    <th>Số lượng</th> {/* Cột mới */}
                                    <th>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="10">Không tìm thấy sản phẩm nào.</td>
                                    </tr>
                                ) : (
                                    // SỬ DỤNG productList đã được làm phẳng
                                    filteredProducts.map((p, index) => {
                                        // Đếm số dòng (rowspan) cho sản phẩm hiện tại
                                        const productDetailsCount = productList.filter(item => item.maSP === p.maSP).length;
                                        return (
                                            <tr key={`${p.maSP}-${p.chiTietId || index}`}> {/* Key duy nhất cho mỗi dòng */}
                                                {/* Chỉ render các ô rowspan nếu là chi tiết đầu tiên của sản phẩm */}
                                                {p.IsFirstDetail && (
                                                    <>
                                                        <td rowSpan={productDetailsCount}>{p.maSP}</td>
                                                        <td rowSpan={productDetailsCount}>{p.tenSP}</td>
                                                        <td rowSpan={productDetailsCount}>{p.moTa}</td>
                                                        <td rowSpan={productDetailsCount}>
                                                            <img src={p.hinhAnh || logo} alt={p.tenSP} className={styles['product-image']} />
                                                        </td>
                                                        <td rowSpan={productDetailsCount}>{p.TenDanhMuc}</td>
                                                        <td rowSpan={productDetailsCount}>{p.TenDoiTuong}</td>
                                                    </>
                                                )}
                                                {/* Các cột chi tiết sản phẩm */}
                                                <td>{p.kichCo}</td>
                                                <td>{p.GiaFormatted}</td>
                                                <td>{p.soLuong}</td>
                                                {p.IsFirstDetail && (
                                                    <td rowSpan={productDetailsCount} className={styles['action-buttons']}>
                                                        <button
                                                            className={styles['edit-button']}
                                                            onClick={() => handleEditProduct(p)} // Truyền product gốc để có đủ chiTietList
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            className={styles['delete-button']}
                                                            onClick={() => handleDeleteProduct(p)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                )}
                                </tbody>
                            </table>
                        )}

                        {editingProduct && (
                            <div className={styles['edit-product-form']}>
                                <h3 className={styles['form-title']}>{editingProduct.maSP ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h3>
                                <div className={styles['form-grid']}>
                                    {editingProduct.maSP && ( // Hiển thị Mã SP nếu đang chỉnh sửa
                                        <div className={styles['form-field']}>
                                            <label htmlFor="maSP">Mã SP:</label>
                                            <input
                                                id="maSP"
                                                name="maSP"
                                                value={editingProduct.maSP || ''}
                                                className={styles['form-input']}
                                                readOnly
                                            />
                                        </div>
                                    )}
                                    <div className={styles['form-field']}>
                                        <label htmlFor="tenSP">Tên SP:</label>
                                        <input
                                            id="tenSP"
                                            name="tenSP"
                                            value={editingProduct.tenSP || ''}
                                            onChange={handleChangeProduct}
                                            className={styles['form-input']}
                                        />
                                    </div>
                                    <div className={styles['form-field']}>
                                        <label htmlFor="moTa">Mô tả:</label>
                                        <textarea
                                            id="moTa"
                                            name="moTa"
                                            value={editingProduct.moTa || ''}
                                            onChange={handleChangeProduct}
                                            className={styles['form-input']}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className={styles['form-field']}>
                                        <label htmlFor="hinhAnh">URL Hình ảnh:</label>
                                        <input
                                            id="hinhAnh"
                                            name="hinhAnh"
                                            value={editingProduct.hinhAnh || ''}
                                            onChange={handleChangeProduct}
                                            className={styles['form-input']}
                                        />
                                    </div>

                                    {/* ... other form fields ... */}

                                    <div className={styles['form-field']}>
                                        <label htmlFor="danhMuc">Danh Mục:</label>
                                        <select
                                            id="danhMuc"
                                            name="danhMuc"
                                            // Use the new dedicated ID state for the value
                                            value={editingProduct.tenDanhMuc|| ''}
                                            onChange={handleChangeProduct}
                                            className={styles['form-input']}
                                            disabled={loadingCategories}
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {danhMucList.map((dm) => (
                                                <option key={dm.maDanhMuc} value={dm.maDanhMuc}>
                                                    {dm.tenDanhMuc}
                                                </option>
                                            ))}
                                        </select>
                                        {errorCategories && <p className={styles['error-text']}>{errorCategories}</p>}
                                    </div>

                                    <div className={styles['form-field']}>
                                        <label htmlFor="type">Đối tượng:</label>
                                        <select
                                            id="type"
                                            name="type"
                                            // Use the new dedicated ID state for the value
                                            value={editingProduct.selectedTypeId}
                                            onChange={handleChangeProduct}
                                            className={styles['form-input']}
                                            disabled={loadingTypes}
                                        >
                                            <option value="">Chọn đối tượng</option>
                                            {typeList.map((t) => (
                                                <option key={t.maType} value={t.maType}>
                                                    {t.tenType}
                                                </option>
                                            ))}
                                        </select>
                                        {errorTypes && <p className={styles['error-text']}>{errorTypes}</p>}
                                    </div>

                                    {/* ... rest of your form ... */}
                                </div> {/* End of form-grid for product main details */}

                                {/* --- Chi tiết sản phẩm section --- */}
                                <h4 className={styles['section-title']}>Chi tiết sản phẩm</h4>
                                {editingProduct.chiTietList.map((chiTiet, index) => (
                                    <div key={chiTiet.id || `new-${index}`} className={styles['product-detail-item']}>
                                        <div className={styles['form-grid']}>
                                            <div className={styles['form-field']}>
                                                <label htmlFor={`kichCo-${index}`}>Kích cỡ:</label>
                                                <input
                                                    id={`kichCo-${index}`}
                                                    name="kichCo"
                                                    value={chiTiet.kichCo}
                                                    onChange={(e) => handleChangeChiTiet(index, e)}
                                                    className={styles['form-input']}
                                                />
                                            </div>
                                            <div className={styles['form-field']}>
                                                <label htmlFor={`gia-${index}`}>Giá:</label>
                                                <input
                                                    id={`gia-${index}`}
                                                    name="gia"
                                                    type="text"
                                                    value={chiTiet.gia}
                                                    onChange={(e) => handleChangeChiTiet(index, e)}
                                                    className={styles['form-input']}
                                                    step="0.01"
                                                />
                                            </div>
                                            <div className={styles['form-field']}>
                                                <label htmlFor={`soLuong-${index}`}>Số lượng:</label>
                                                <input
                                                    id={`soLuong-${index}`}
                                                    name="soLuong"
                                                    type="number"
                                                    value={chiTiet.soLuong}
                                                    onChange={(e) => handleChangeChiTiet(index, e)}
                                                    className={styles['form-input']}
                                                />
                                            </div>
                                            <div className={styles['form-field']}>
                                                {editingProduct.chiTietList.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveChiTiet(index)}
                                                        className={styles['delete-detail-button']}
                                                    >
                                                        Xóa chi tiết
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddChiTiet}
                                    className={styles['add-detail-button']}
                                >
                                    + Thêm chi tiết
                                </button>

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
            default:
                return null;
        }
    };

    return (
        <div className={styles['admin-container']}>
            <div className={styles['admin-layout']}>
                <div className={styles['admin-sidebar']}>
                    <div className={styles['sidebar-logo']}>
                        <img src={logo} alt="Shop Logo" className={styles['logo-image']} />
                    </div>
                    <div
                        onClick={() => setSelectedTab('users')}
                        className={`${styles['sidebar-item']} ${selectedTab === 'users' ? styles['selected-users'] : ''}`}
                    >
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

                    <div onClick={handleOut} className={styles['sidebar-item']}>
                        <LogOut className={styles['sidebar-icon']} style={{ color: '#e74c3c' }} />
                        <span className={styles['sidebar-text']}>Thoát</span>
                    </div>
                </div>

                <div className={styles['admin-content']}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Admin;

