import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { deleteReviewReducer, deleteUpdateProductReducer, newProductReducer, newReviewReducer, productDetailsReducer, productReviewReducer, productsReducer } from './reducers/productReducer';
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';
import { allOrdersReducer, deleteUpdateOrderReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer } from './reducers/orderReducer';

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    profile: profileReducer,//Update and Delete User soho ace profile Reducer e
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    deleteUpdateProduct: deleteUpdateProductReducer,
    allOrders: allOrdersReducer,
    deleteUpdateOrder: deleteUpdateOrderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewReducer,
    deleteReview: deleteReviewReducer,
});

let initialState = {
    cart: {
        cartItems: sessionStorage.getItem("cartItems") ? JSON.parse(sessionStorage.getItem("cartItems")) : [],
        shippingInfo: sessionStorage.getItem("shippingInfo") ? JSON.parse(sessionStorage.getItem("shippingInfo")) : {},
    },
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;


