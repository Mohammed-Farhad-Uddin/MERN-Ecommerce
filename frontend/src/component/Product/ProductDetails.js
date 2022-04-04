import React, { useEffect, useState } from 'react';
import './ProductDetails.css';
import Carousel from 'react-material-ui-carousel';
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import ReactStars from 'react-rating-stars-component';
import ReviewCard from './ReviewCard.js';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { addItemsToCart } from '../../actions/cartAction';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Rating } from '@mui/material';



const ProductDetails = ({ match }) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, product, error } = useSelector((state) => state.productDetails);

    const { success, error: reviewError } = useSelector((state) => state.newReview);//uporer error er sathe mix na howar jnno error:reviewError newa hoice..error k reviewError hisabe newa hocce


    const [quantity, setQuantity] = useState(1);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0)
    const [open, setOpen] = useState(false);

    const increaseQuantity = () => {
        if (product.stock <= quantity) return//ek line e likle 2nd braket use na korleo hoi..condition true hole return kore dibe function tekhe
        setQuantity(quantity + 1);
    };
    const decreaseQuantity = () => {
        if (1 >= quantity) return//ek line e likle 2nd braket use na korleo hoi..condition true hole return kore dibe function tekhe
        setQuantity(quantity - 1);
    };

    const addToCartHandler = () => {
        dispatch(addItemsToCart(match.params.id, quantity));

        alert.success("Item Added To Cart");
    };

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true); //ei ta swap korbe true takle false korbe false takle true korbe
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", match.params.id);

        dispatch(newReview(myForm));

        setOpen(false); //submit howar sathe sathe dialog o close hoye jabe
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors()) kora hoice...na hoi oi error pop up hobe but r jabe na
        }
        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors()) kora hoice...na hoi oi error pop up hobe but r jabe na
        }
        if (success) {
            alert.success("Review submitted Successfully");
            dispatch({ type: "NEW_REVIEW_RESET" })
        }
        dispatch(getProductDetails(match.params.id))

    }, [dispatch, match.params.id, error, alert, reviewError, success]);

    // const options = {
    //     edit: false,//edit false takle start gular set ba mark kora jabe na...hover korle kicu hobe na
    //     color: "rgba(20,20,20,0.1)",
    //     activeColor: "tomato",
    //     size: window.innerWidth < 600 ? 15 : 20,
    //     value: product.ratings,
    //     isHalf: true,//ei ta dewar karone value 2.5 ba 0.5 ta show hobe
    // }
    const options = {
        value: product.ratings,
        readOnly: true,
        precision: 0.5,//half start jate show hoi
    }

    return (
        <>{
            loading ? <Loader /> : (
                <>
                    <MetaData title={`${product.name} of Ecommerce Site`} />
                    <div className="productDetails">
                        <div>
                            <Carousel>
                                {product.images && product.images.map((item, i) => (
                                    <img
                                        className="carouselImage"
                                        key={item.url}
                                        src={item.url}
                                        alt={`${i} Slide`}
                                    />
                                ))}
                            </Carousel>
                        </div>
                        <div>
                            <div className="detailsBlock-1">
                                <h2>{product.name}</h2>
                                <p>Product #{product._id} </p>
                            </div>
                            <div className="detailsBlock-2">
                                {/* <ReactStars {...options} /> */}
                                <Rating {...options} />
                                <span>({product.numOfReviews} Reviews)</span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`$${product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQuantity} >-</button>
                                        {/* readOnly dile input e click korle keyponter ta asbe na  */}
                                        <input value={quantity} type="number" readOnly />
                                        <button onClick={increaseQuantity} >+</button>
                                    </div>
                                    <button disabled={product.stock < 1 ? true : false} onClick={addToCartHandler}>Add To Cart</button>
                                </div>
                                <p>
                                    Status:<b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                        {product.stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>
                            </div>
                            <div className="detailsBlock-4">
                                <p>Description:{product.description}</p>
                            </div>
                            <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
                        </div>
                    </div>
                    <h3 className="reviewsHeading">REVIEWS</h3>
                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />
                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            >
                            </textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={submitReviewToggle} color="secondary">Cancel</Button>
                            <Button onClick={reviewSubmitHandler} >Submit</Button>
                        </DialogActions>
                    </Dialog>
                    {
                        product.reviews && product.reviews[0] ?
                            (<div className="reviews">
                                {product.reviews && product.reviews.map((review, i) => <ReviewCard review={review} key={i}></ReviewCard>)}
                            </div>)
                            : (<p className="noReviews">No Reviews Yet</p>)
                    }
                </>
            )
        }
        </>
    );
};

export default ProductDetails;