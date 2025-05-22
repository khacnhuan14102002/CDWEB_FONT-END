import React, {useContext, useEffect, useState} from 'react'


import '../style/Lastest.css';
import '../style/Title.css';
import {ShopContext} from "../context/ShopContext.jsx";
import Title from "./Title.jsx";
import ProductItem from "./ProductItem.jsx"; // Import the CSS file

const BestSeller = () => {
    const {products} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const  bestProducts = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProducts.slice(0,5))
    }, []);
    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={' SELLER'}/>
                {/*<p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>*/}
                {/*    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the...*/}
                {/*</p>*/}
            </div>
            <div className='grid'>
                {
                    bestSeller.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>
        </div>
    );
}

export default BestSeller