import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import {ShopContext} from "../context/ShopContext.jsx";
import {assets} from "../assets/assets.js";
import RelatedProduct from "../components/RelatedProduct.jsx";
import "../style/Pro.css" // Corrected path and removed trailing slash

const Product = () =>  {
    const {productId} = useParams();
    const {products, currency, addToCart} = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState('');
    const [size,setSize] = useState('');

    const  fetchProductData = async () =>{
        products.map((item) =>{
            if(item._id === productId){
                setProductData(item);
                setImage(item.image[0]);
                console.log(item);
                return null;
            }
            return null;
        });
    };

    useEffect(() => {
        fetchProductData();
    }, [productId, products]); // Added products to dependency array

    return  productData ?(
        <div className='product-page-container'>
            {/*data*/}
            <div className='product-data-section'>
                {/*image*/}
                <div className='product-image-gallery'>
                    <div className='product-thumbnail-list'>
                        {
                            productData.image.map((item,index)=>(
                                <img onClick={() => setImage(item)} src={item} key={index} alt={`Product thumbnail ${index + 1}`}/>
                            ))
                        }
                    </div>
                    <div className='product-main-image'>
                        <img src={image} alt={productData.name}/>
                    </div>
                </div>
                {/* Info*/}
                <div className='product-info-section'>
                    <h1 >{productData.name}</h1>
                    <div className='product-rating'>
                        <img src={assets.star_icon} alt="Star rating"/>
                        <img src={assets.star_icon} alt="Star rating"/>
                        <img src={assets.star_icon} alt="Star rating"/>
                        <img src={assets.star_icon} alt="Star rating"/>
                        <img src={assets.star_icon} alt="Star rating"/>
                        <p>(122)</p>
                    </div>
                    <p className='product-price'>{currency}{productData.price}</p>
                    <p className='product-description'>{productData.description}</p>
                    <div className='product-size-selection'>
                        <p>Select Size</p>
                        <div className='product-size-buttons'>
                            {productData.sizes.map((item,index)=>
                                <button
                                    onClick={()=>setSize(item)}
                                    className={item === size ? 'selected' : ''}
                                    key={index}
                                >
                                    {item}
                                </button>
                            )}
                        </div>
                    </div>
                    <button  onClick={() => addToCart(productData._id,size)} className='add-to-cart-btn'>ADD TO CART</button>
                    <hr className='product-info-divider'/>
                    <div className='product-guarantee-info'>
                        <p>100% Original product</p>
                        <p>Cash on delivery is available on this product</p>
                        <p>Easy return and exchange policy within 7 days</p>
                    </div>
                </div>
            </div>
            {/* de and re */}
            <div className='description-reviews-section'>
                <div className='description-reviews-tabs'>
                    <b>
                        Description
                    </b>
                    <p>
                        Reviews(22)
                    </p>
                </div>
                <div className='description-content'>
                    <p>dsadassssss</p>
                    <p>ƯDaxasxas</p>
                </div>
            </div>
            {/* RELATED PRO*/}
            <RelatedProduct category={productData.category} subCategory={productData.subCategory}/>
        </div>
    ) : <div className='opacity-0'>
    </div>
}

export default Product