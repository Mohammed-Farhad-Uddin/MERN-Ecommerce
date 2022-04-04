import React from 'react';
import { Link } from "react-router-dom";
import ReactStars from 'react-rating-stars-component';
import './Home.css';
import { Rating } from '@mui/material';




const ProductCard = ({ product }) => {//props.product

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
        <Link to={`/product/${product._id}`} className="productCard">
            {/* images array er first image/index[0] er url */}
            <img src={product.images[0].url} alt={product.name} />
            <p>{product.name}</p>
            <div>
                <Rating {...options} /> <span className="productCardSpan" >({product.numOfReviews} Reviews)</span>
            </div>
            <span>{`$${product.price}`}</span>
        </Link>
    );
};

export default ProductCard;