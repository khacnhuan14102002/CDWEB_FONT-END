import {createContext, useEffect, useState} from "react";
import {products} from "../assets/assets";
import {toast} from "react-toastify";
import product from "../pages/Product.jsx";
import {useNavigate} from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const delivery_fee = 10;
    const [search,setSearch] =useState('');
    const [showSearch, setShowSearch] = useState(true)
    const [cartItem, setCartItems] = useState({})
    const navigate = useNavigate();

    const addToCart =async (itemId, size) => {
        if(!size){
            toast.error('Select Product Size');
            return;
        }
        let cartData = structuredClone(cartItem);
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] =1;
        }
        setCartItems(cartData);
    }
    const  getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItem){
            for(const item in cartItem[items]){
                try{
                    if(cartItem[items][item] > 0 ){
                        totalCount += cartItem[items][item];
                    }
                }catch (error){

                }
            }
        }
        return totalCount
    }

    const updateQuantity = async (itemId,size,quantity) =>{
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    }
    const  getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItem){
            let itemInfo = products.find((product)=> product._id  === items);
            for(const item in cartItem[items]){
                try{
                    if(cartItem[items][item] > 0){
                        totalAmount += itemInfo.price * cartItem[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }
    useEffect(() => {
        console.log(cartItem);
    }, [cartItem]);
    const value = {
        products,         // <-- Thêm dòng này
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItem,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
