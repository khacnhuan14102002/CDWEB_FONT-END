import React, { useEffect, useState } from 'react';
import { assets } from "../assets/assets.js";
import '../style/Collec.css';
import Title from "../components/Title.jsx";
import ProductItem from "../components/ProductItem.jsx";

const Collection = () => {
    const [showFilter, setShowFilter] = useState(false);
    const [danhMucs, setDanhMucs] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [filterProducts, setFilterProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(18);
    const [sortOption, setSortOption] = useState('relevant');

    // Fetch danh mục
    useEffect(() => {
        fetch('http://localhost:8080/api/danhmuc')
            .then(res => res.json())
            .then(data => setDanhMucs(data))
            .catch(err => console.error("Failed to fetch danh mục", err));
    }, []);

    // Fetch loại sản phẩm
    useEffect(() => {
        fetch('http://localhost:8080/api/type')
            .then(res => res.json())
            .then(data => setTypes(data))
            .catch(err => console.error("Failed to fetch types", err));
    }, []);

    // Fetch sản phẩm theo bộ lọc (danh mục & loại)
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let url = 'http://localhost:8080/api/sanpham';
                const params = new URLSearchParams();

                if (selectedCategoryId) params.append('danhmuc', selectedCategoryId);
                if (selectedTypes.length > 0) {
                    selectedTypes.forEach(typeId => params.append('types', typeId));
                }

                if (params.toString()) {
                    url = `http://localhost:8080/api/sanpham/filter?${params.toString()}`;
                }

                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setAllProducts(data);
            } catch (err) {
                setError(err.message);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategoryId, selectedTypes]);


    // Cập nhật filterProducts + reset phân trang
    useEffect(() => {
        setFilterProducts(allProducts);
        setCurrentPage(1);
    }, [allProducts]);
    // sort
    useEffect(() => {
        const sorted = [...allProducts];
        if (sortOption === 'low-high') {
            sorted.sort((a, b) => (a.chiTietList?.[0]?.gia || 0) - (b.chiTietList?.[0]?.gia || 0));
        } else if (sortOption === 'high-low') {
            sorted.sort((a, b) => (b.chiTietList?.[0]?.gia || 0) - (a.chiTietList?.[0]?.gia || 0));
        }
        setFilterProducts(sorted);
        setCurrentPage(1); // reset về trang đầu khi sort
    }, [sortOption, allProducts]);

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filterProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const handleTypeChange = (typeId) => {
        setSelectedTypes(prev =>
            prev.includes(typeId)
                ? prev.filter(id => id !== typeId)
                : [...prev, typeId]
        );
    };

    return (
        <div className="collection-container">
            <div className="filter-wrapper">
                <p onClick={() => setShowFilter(!showFilter)} className="filter-header">
                    FILTERS
                    <img
                        className={`filter-icon ${showFilter ? 'rotate' : ''}`}
                        src={assets.dropdown_icon}
                        alt="dropdown icon"
                    />
                </p>

                {/* Filter danh mục */}
                <div className={`filter-box ${showFilter ? '' : 'hidden-mobile'}`}>
                    <p className="filter-title">DANH MỤC</p>
                    <div className="filter-options">
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value=""
                                checked={selectedCategoryId === null}
                                onChange={() => setSelectedCategoryId(null)}
                            />
                            Tất cả
                        </label>
                        {danhMucs.map(dm => (
                            <label key={dm.maDanhMuc}>
                                <input
                                    type="radio"
                                    name="category"
                                    value={dm.maDanhMuc}
                                    checked={selectedCategoryId === dm.maDanhMuc}
                                    onChange={() => setSelectedCategoryId(dm.maDanhMuc)}
                                />
                                {dm.tenDanhMuc}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Filter loại sản phẩm */}
                <div className={`filter-box ${showFilter ? '' : 'hidden-mobile'} margin-top`}>
                    <p className="filter-title">LOẠI SẢN PHẨM</p>
                    <div className="filter-options">
                        {types.map((type) => (
                            <label key={type.maType}>
                                <input
                                    type="checkbox"
                                    value={type.maType}
                                    checked={selectedTypes.includes(type.maType)}
                                    onChange={() => handleTypeChange(type.maType)}
                                />
                                {type.tenType}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={'ALL'} text2={' COLLECTIONS'} />
                    <select
                        className='border-2 border-gray-300 text-sm px-2'
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="relevant">Sort by: Relevant</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>

                </div>

                {loading && <p>Loading products...</p>}
                {error && <p>Error: {error}</p>}
                {!loading && !error && (
                    <>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                            {currentProducts.length > 0 ? (
                                currentProducts.map(item => (
                                    <ProductItem
                                        key={item.maSP}
                                        id={item.maSP}
                                        image={item.hinhAnh}
                                        name={item.tenSP}
                                        price={item.chiTietList?.[0]?.gia || 0} // hiển thị giá đầu tiên
                                    />
                                ))
                            ) : (
                                <p>No products found for this page.</p>
                            )}
                        </div>

                        <div className="pagination">
                            <button onClick={handlePrevious} disabled={currentPage === 1}>&lt;</button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={currentPage === i + 1 ? 'active' : ''}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Collection;
