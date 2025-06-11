import React, { useEffect, useState } from 'react';
import Title from "./Title.jsx";
import '../style/Lastest.css';
import ProductItem from "./ProductItem.jsx";
import { useTranslation } from 'react-i18next';

const LatestCollection = () => {
    const [latestProducts, setLatestProducts] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        fetch("http://localhost:8080/api/sanpham/oldest")
            .then(res => res.json())
            .then(data => {
                setLatestProducts(data);
            })
            .catch(error => {
                console.error("Error fetching oldest products:", error);
            });
    }, []);

    return (
        <div className="latest-collection">
            <div className="title-wrapper">
                <Title text1={t('latest') } />
            </div>

            <div className='grid'>
                {
                    latestProducts.map((item, index) => (
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

export default LatestCollection;
