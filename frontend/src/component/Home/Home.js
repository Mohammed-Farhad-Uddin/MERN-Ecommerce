import React, { useEffect} from 'react';
import { CgMouse } from 'react-icons/cg';
import './Home.css';
import ProductCard from './ProductCard.js';
import MetaData from '../layout/MetaData';
import { clearErrors, getProduct } from '../../actions/productAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';



const Home = () => {
    const alert=useAlert();
    const dispatch = useDispatch();
    const { loading, error, products} = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors()) kora hoice...na hoi oi error pop up hobe but r jabe na
        }
        dispatch(getProduct());
    }, [dispatch,error,alert]);



    return (
        <>
            {loading ? (<Loader/>) : (<>
                <MetaData title="Ecommerce" />
                <div className="banner">
                    <p>Welcome to Ecommerce</p>
                    <h1>Find Amazing Product Below</h1>

                    <a href="#container" >
                        <button>Scroll <CgMouse /> </button>
                    </a>
                </div>
                <h2 className="homeHeading">Featured Products</h2>

                <div className="container" id="container">
                    {products && products.map((product,i) => (
                        <ProductCard product={product} key={i} />
                    ))}
                </div>
            </>)}
        </>
    );
};

export default Home;