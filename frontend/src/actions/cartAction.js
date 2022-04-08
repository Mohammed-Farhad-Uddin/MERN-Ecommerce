import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from '../constants/cartConstants';
import axios from 'axios';


//ADD to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {

    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity
        },
    });

    sessionStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));

};

//Remove From Cart
export const removeCartItem = (id) => async (dispatch, getState) => {

    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id
    });

    sessionStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));

};

//Save Shipping Info
export const saveShippinInfo = (data) => async (dispatch) => {

    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    });

    sessionStorage.setItem("shippinInfo", JSON.stringify(data))
};