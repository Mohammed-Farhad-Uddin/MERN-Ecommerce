import React from 'react';
import './Cart.css';
import CartItemCard from './CartItemCard.js';
import { useDispatch, useSelector } from 'react-redux';
import { addItemsToCart, removeCartItem } from '../../actions/cartAction';
import { Typography } from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Link } from 'react-router-dom';
import MetaData from '../layout/MetaData';

const Cart = ({ history }) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart);

    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (stock <= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    };
    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if (1 >= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    };

    const deleteCartItem = (id) => {
        dispatch(removeCartItem(id))
    };

    const checkOutHandler = () => {
        history.push('/login?redirect=shipping');
    };

    return (
        <>
            <MetaData title={`Cart of Ecommerce Site`} />

            {cartItems.length === 0 ? (
                <div className="emptyCart">
                    <RemoveShoppingCartIcon />
                    <Typography>No Product In Your Cart</Typography>
                    <Link to='/products'>View Products</Link>
                </div>
            ) :
                <>
                    <div className="cartPage">
                        <div className="cartHeader">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>
                        {
                            cartItems && cartItems.map((item, i) => (
                                <div key={i} className="cartContainer">
                                    <CartItemCard key={i} item={item} deleteCartItem={deleteCartItem} />
                                    <div className="cartInput">
                                        <button onClick={() => decreaseQuantity(item.product, item.quantity)}>-</button>
                                        <input type="number" value={item.quantity} readOnly />
                                        <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                                    </div>
                                    <p className="cartSubtotal">{`$${item.price * item.quantity}`}</p>
                                </div>
                            ))
                        }
                        <div className="cartGrossProfit">
                            <div>

                            </div>
                            <div className="cartGrossProfitBox">
                                <p>Gross Total</p>
                                <p>{`$${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}`}</p>
                            </div>
                            <div></div>
                            <div className="checkOutBtn">
                                <button onClick={checkOutHandler}>Check Out</button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default Cart;