import React, { useEffect, useRef } from 'react';
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import './Payment.css';
import MetaData from '../layout/MetaData';
import CheckOutSteps from '../Cart/CheckOutSteps.js';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import axios from 'axios';
import { clearErrors, createOrder } from '../../actions/orderAction';



const Payment = ({ history }) => {

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

    const payBtn = useRef(null);
    const dispatch = useDispatch();
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const { shippingInfo, cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);
    const { error } = useSelector(state => state.newOrder);



    const order = {//backend e req.body te ei gula patate hobe
        shippingInfo,
        orderItems: cartItems,
        //paymentInfo ta niche bananu hobe order dispatch er aghe
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    };

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100)//jei amount pabe oi ta poisa te count korbe stripe tai 100 multiple kora hoice jate 200 dollar mane stripe bujbe 2 dollar 20000 dollar mane stripe bujbe 200 dollar
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;

        try {
            const config = {
                headers: { "Content-Type": "application/json", },
            };

            const { data } = await axios.post('/api/v1/payment/process', paymentData, config);

            const client_secret = data.client_secret;

            if (!stripe || !elements) return;//stripe otoba element na takle eikan tekhe return hou..

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        }
                    },
                },
            });

            if (result.error) {
                payBtn.current.disabled = false;
                alert.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    //order er paymentInfo property bananu hocce
                    order.paymentInfo = {//upore order e ei property ta create kora hocce //order model e id r status newa hocce
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };

                    dispatch(createOrder(order));

                    history.push('/success');
                } else {
                    alert.error("There's some issue while payment proccess");
                }
            }

        } catch (error) {
            payBtn.current.disabled = true;
            alert.error(error.response.data.message);
        }
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors()) kora
        }
    }, [alert, dispatch, error]);

    return (
        <>
            <MetaData title="Payment" />
            <CheckOutSteps activeStep={2} />
            <div className="paymentContainer">
                <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                    <Typography>Card Info</Typography>
                    <div>
                        <CreditCardIcon />
                        <CardNumberElement className="paymentInput" />
                    </div>
                    <div>
                        <EventIcon />
                        <CardExpiryElement className="paymentInput" />
                    </div>
                    <div>
                        <VpnKeyIcon />
                        <CardCvcElement className="paymentInput" />
                    </div>
                    <input type="submit" ref={payBtn} value={`Pay - $${orderInfo && orderInfo.totalPrice}`} className="paymentFormBtn" />
                </form>
            </div>
        </>
    );
};

export default Payment;