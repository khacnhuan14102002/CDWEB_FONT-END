import React, {useContext, useEffect, useState} from 'react';
import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";
import '../style/Collec.css';
import Title from "../components/Title.jsx";
import ProductItem from "../components/ProductItem.jsx"; // Import plain CSS

const Collection = () => {
    const { products } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts,setFilterProducts] = useState([]);
    useEffect(() => {
        setFilterProducts(products);
    }, []);

    return (
        <div className="collection-container">
            {/* Filter Section */}
            <div className="filter-wrapper">
                <p onClick={() => setShowFilter(!showFilter)} className="filter-header">
                    FILTERS
                    <img
                        className={`filter-icon ${showFilter ? 'rotate' : ''}`}
                        src={assets.dropdown_icon}
                        alt=""
                    />
                </p>

                {/* Categories */}
                <div className={`filter-box ${showFilter ? '' : 'hidden-mobile'}`}>
                    <p className="filter-title">CATEGORIES</p>
                    <div className="filter-options">
                        <label><input type="checkbox" value="Men" /> Men</label>
                        <label><input type="checkbox" value="Women" /> Women</label>
                        <label><input type="checkbox" value="Kids" /> Kids</label>
                    </div>
                </div>

                {/* Subcategories */}
                <div className={`filter-box ${showFilter ? '' : 'hidden-mobile'} margin-top`}>
                    <p className="filter-title">TYPE</p>
                    <div className="filter-options">
                        <label><input type="checkbox" value="Topwear" /> Topwear</label>
                        <label><input type="checkbox" value="Bottomwear" /> Bottomwear</label>
                        <label><input type="checkbox" value="Minterwear" /> Minterwear</label>
                    </div>
                </div>
            </div>
            {/*right silde*/}
            <div className='flex-1'>

                <div className='flex justify-between text-base sm:text-2x1 mb-4'>
                    <Title text1={'ALL'} text2={' COLLECTIONS'}/>
                    {/* Product*/}
                    <select className='border-2 border-gray-300 text-sm px-2'>
                        <option value="relavent">Sort by: Relavent</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

                {/* map Pro*/}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grod-cols-4 gap-4 gap-y-6'>
                    {
                    filterProducts.map((item, index) => (
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
                </div>
            </div>
        </div>
    );
}

export default Collection;
