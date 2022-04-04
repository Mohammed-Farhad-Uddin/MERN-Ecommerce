import React from 'react';
import ReactStars from 'react-rating-stars-component';
import ProfilePng from '../../images/Profile.png';
import { Rating } from '@mui/material';



const ReviewCard = ({review}) => {

    // const options = {
    //     edit: false,//edit false takle start gular set ba mark kora jabe na...hover korle kicu hobe na
    //     color: "rgba(20,20,20,0.1)",
    //     activeColor: "tomato",
    //     size: window.innerWidth < 600 ? 15 : 20,
    //     value: review.rating,
    //     isHalf: true,//ei ta dewar karone value 2.5 ba 0.5 ta show hobe
    // }
    const options = {
        value: review.rating,
        readOnly: true,
        precision: 0.5,//half start jate show hoi
    }

    return (
        <div className="reviewCard">
            <img src={ProfilePng} alt="User" />
            <p>{review.name}</p>
            {/* <ReactStars {...options} /> */}
            <Rating {...options} />
            <span>{review.comment}</span>
        </div>
    );
};

export default ReviewCard;