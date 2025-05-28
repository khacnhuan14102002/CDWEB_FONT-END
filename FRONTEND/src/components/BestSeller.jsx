import React, { useEffect, useState } from 'react';

import '../style/Lastest.css';
import '../style/Title.css';
import Title from "./Title.jsx";
import ProductItem from "./ProductItem.jsx";

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/chitietdonhang/bestsellers")
            .then((res) => res.json())
            .then((data) => {
                setBestSeller(data);
            })
            .catch((err) => {
                console.error("Failed to fetch bestsellers", err);
            });
    }, []);

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={' SELLER'} />
            </div>
            <div className='grid'>
                {
                    bestSeller.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item.maSP}
                            image={item.hinhAnh}
                            name={item.tenSP}
                            price={
                                item.chiTietList && item.chiTietList.length > 0
                                    ? Math.min(...item.chiTietList.map(ct => ct.gia))
                                    : 0
                            }
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default BestSeller;
