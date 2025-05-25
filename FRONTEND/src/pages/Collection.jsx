import React, { useEffect, useState } from 'react';
import { assets } from "../assets/assets.js";
import '../style/Collec.css';
import Title from "../components/Title.jsx";
import ProductItem from "../components/ProductItem.jsx";

const Collection = () => {
    const [showFilter, setShowFilter] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [filterProducts, setFilterProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(18);

    const [danhMucs, setDanhMucs] = useState([]); // ✅ NEW

    // Fetch loại sản phẩm (TYPE)
    useEffect(() => {
        const fetchDanhMucs = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/danhmuc');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setDanhMucs(data);
            } catch (err) {
                console.error("Failed to fetch danh mục", err);
            }
        };
        fetchDanhMucs();
    }, []);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/type');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let url = 'http://localhost:8080/api/sanpham';
                if (selectedCategoryId) {
                    url = `http://localhost:8080/api/sanpham/danhmuc/${selectedCategoryId}`;
                }
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setFilterProducts(data);
                setCurrentPage(1);
            } catch (err) {
                setError(err.message);
                setFilterProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategoryId]);

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filterProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

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

                {/* Filter Categories - radio */}
                <div className={`filter-box ${showFilter ? '' : 'hidden-mobile'}`}>
                    <p className="filter-title">CATEGORIES</p>
                    <div className="filter-options">
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value=""
                                checked={selectedCategoryId === null}
                                onChange={() => setSelectedCategoryId(null)}
                            />
                            All
                        </label>
                        {categories.map(cat => (
                            <label key={cat.maType}>
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat.maType}
                                    checked={selectedCategoryId === cat.maType}
                                    onChange={() => setSelectedCategoryId(cat.maType)}
                                />
                                {cat.tenType}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Filter TYPE - danh mục động từ API */}
                <div className={`filter-box ${showFilter ? '' : 'hidden-mobile'} margin-top`}>
                    <p className="filter-title">TYPE</p>
                    <div className="filter-options">
                        {danhMucs.map((dm) => (
                            <label key={dm.maDanhMuc}>
                                <input type="checkbox" value={dm.maDanhMuc} />
                                {dm.tenDanhMuc}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'ALL'} text2={' COLLECTIONS'} />
                    <select className='border-2 border-gray-300 text-sm px-2'>
                        <option value="relavent">Sort by: Relevant</option>
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
                                currentProducts.map((item) => (
                                    <ProductItem
                                        key={item.maSP}
                                        id={item.maSP}
                                        image={item.hinhAnh}
                                        name={item.tenSP}
                                        price={item.gia}
                                    />
                                ))
                            ) : (
                                <p>No products found for this page.</p>
                            )}
                        </div>

                        <div className="pagination">
                            <button onClick={handlePrevious} disabled={currentPage === 1}>
                                &lt;
                            </button>
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={currentPage === number ? 'active' : ''}
                                >
                                    {number}
                                </button>
                            ))}
                            <button onClick={handleNext} disabled={currentPage === totalPages}>
                                &gt;
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Collection;
