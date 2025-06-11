import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from "./Title.jsx";
import '../style/CartTotal.css';

const CartTotal = ({ cartData, currency = "$", delivery_fee = 2 }) => {
    const { t } = useTranslation();

    const subtotal = cartData.reduce(
        (sum, item) => sum + item.gia * item.soLuong, 0
    );
    const total = cartData.length === 0 ? 0 : subtotal + delivery_fee;

    return (
        <div className='cart-total-container'>
            <div className='cart-total-title'>
                <Title text1={t('cart.title1')} text2={t('cart.title2')} />
            </div>
            <div className='cart-total-details'>
                <div className='cart-total-row'>
                    <p>{t('cart.subtotal')}</p>
                    <p>{currency}{subtotal.toFixed(2)}</p>
                </div>
                <hr className='cart-total-divider-subtotal' />
                <div className='cart-total-row'>
                    <p>{t('cart.shipping')}</p>
                    <p>{currency}{delivery_fee.toFixed(2)}</p>
                </div>
                <hr className='cart-total-divider-shipping' />
                <div className='cart-total-row cart-total-row-total'>
                    <p>{t('cart.total')}</p>
                    <p>{currency}{total.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;
