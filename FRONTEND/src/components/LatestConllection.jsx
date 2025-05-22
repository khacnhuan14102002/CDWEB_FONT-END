import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "./Title.jsx";
import '../style/Lastest.css';
import ProductItem from "./ProductItem.jsx";

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0, 10));
    }, [products]);

    return (
        <div className="latest-collection">
            <div className="title-wrapper">
                <Title text1={'LATEST'} text2={' COLLECTIONS'} />
                {/*<p className='description'>*/}
                {/*    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the...*/}
                {/*</p>*/}
            </div>

            <div className='grid'>
                {
                    latestProducts.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>
        </div>
    );
}

export default LatestCollection;