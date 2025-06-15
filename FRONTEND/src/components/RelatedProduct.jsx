import React, { useEffect, useState } from 'react';
import Title from "./Title.jsx";
import ProductItem from "./ProductItem.jsx";
import { useTranslation } from 'react-i18next';

const RelatedProduct = ({ categoryId, typeId, productId }) => {
    const [related, setRelated] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/sanpham/related?danhmuc=${categoryId}&type=${typeId}&excludeId=${productId}`);
                if (!response.ok) throw new Error("Failed to fetch related products");
                const data = await response.json();
                setRelated(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRelatedProducts();
    }, [categoryId, typeId, productId]);

    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'>
                <Title text1={t('related')} text2={` ${t('products')}`} />
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {related.map((item, index) => (
                    <ProductItem
                        key={index}
                        id={item.maSP}
                        name={item.tenSP}
                        price={item.chiTietList[0]?.gia || 0}
                        image={item.hinhAnh}
                    />
                ))}
            </div>
        </div>
    );
};

export default RelatedProduct;
