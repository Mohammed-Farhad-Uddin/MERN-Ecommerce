import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import './Products.css';
import Pagination from 'react-js-pagination';
import { Typography, Slider } from '@mui/material';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';



const categories = ["Laptop", "Camera", "Footwear", "SmartPhones", "Attire", "Tops", "Bottom"];

const Products = ({ match }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 2500]);//0 index e 0 1st index e 2500
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);


    const alert=useAlert();
    const dispatch = useDispatch();
    const { loading, error, products, productsCount, resultPerPage,} = useSelector((state) => state.products)//filteredProductsCount 

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    };

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    };

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors()) kora hoice...na hoi oi error pop up hobe but r jabe na
        }
        dispatch(getProduct(match.params.keyword, currentPage, price, category, ratings));
    }, [dispatch, match.params.keyword, currentPage, price, category, ratings, error, alert]);


    return (
        <>{
            loading ? <Loader /> : (
                <>
                <MetaData title="Products of Ecommerce Site"/>
                    <h2 className="productsHeading">Products</h2>
                    <div className="products">
                        {
                            products && products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        }
                    </div>

                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"//ei ta point ta k dag korabe na just jei kane click oi kane asbe line tar
                            min={0}
                            max={2500}
                        />
                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {
                                categories.map((category, i) => (
                                    <li
                                        className="category-link"
                                        key={i}
                                        onClick={() => setCategory(category)}
                                    >{category}</li>
                                ))
                            }
                        </ul>
                        <fieldset>
                            <Typography component="legend">Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => setRatings(newRating)}
                                aria-labelledby="continuous-slider"//ei ta point ta k dag korabe
                                valueLabelDisplay="auto"
                                min={0}
                                max={5}
                            />
                        </fieldset>
                    </div>

                    {//pagination
                        resultPerPage < productsCount
                        && //resultPerPage jodi productsCount tekhe kom hoi taile niche pagination show hobe....krn ek page e sob product mane resultperpage jodi countsproducts er soman ba besi hoi taile niche next prev 1 2 3 ei gula dekanur dorkar nai
                        <div className="paginationBox">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1st"
                                lastPageText="Last"
                                itemClass='page-item'
                                linkClass='page-link'
                                activeClass='pageItemActive'
                                activeLinkClass='pageLinkActive'
                            />
                        </div>
                    }
                </>
            )
        }
        </>
    );
};

export default Products;