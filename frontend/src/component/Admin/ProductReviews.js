import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getAllReviews, deleteReview } from '../../actions/productAction';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import './ProductReviews.css';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import StarIcon from '@mui/icons-material/Star';


const ProductReviews = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const [productId, setProductId] = useState("");

    const { error, reviews, loading } = useSelector(state => state.productReviews);

    const { error: deleteError, isDeleted } = useSelector(state => state.deleteReview)

    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReview(reviewId, productId))
    };

    const productReviewsSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(getAllReviews(productId));
    };

    useEffect(() => {
        if (productId.length === 24) {
            dispatch(getAllReviews(productId));//input product id number dewar sathe sathe info gula chole asbe update button e click kora lagbe na,,ei condition tar krne
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors())
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors())
        }
        if (isDeleted) {
            alert.success("Review deleted successfully");
            history.push("/admin/reviews");
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [alert, error, dispatch, deleteError, isDeleted, history, productId]);


    const columns = [
        { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
        { field: "user", headerName: "User", minWidth: 200, flex: 0.6 },
        { field: "comment", headerName: "Comment", minWidth: 350, flex: 1 },
        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minWidth: 270,
            flex: 0.4,
            cellClassName: (params) => {
                return params.getValue(params.id, "rating") >= 3 ? "greenColor" : "redColor";//greenColor ba redColor app.css e set kora hoice
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "number",
            minWidth: 150,
            flex: 0.3,
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={() => deleteReviewHandler(params.getValue(params.id, "id"))}>
                            <DeleteIcon />
                        </Button>
                    </>
                );
            },
        },
    ];




    const rows = [];
    reviews && reviews.forEach((item) => rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
    }));


    return (
        <>
            <MetaData title="All Reviews - Admin" />
            <div className="dashboard">
                <Sidebar />
                <div className="productReviewsContainer">


                    <form onSubmit={productReviewsSubmitHandler} className="productReviewsForm">
                        <h1 className="productReviewsFormHeading">All Reviews</h1>                                <div>
                            <StarIcon />
                            <input
                                type="text"
                                Placeholder="Product ID"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={loading ? true : false || productId === "" ? true : false}
                        >Search</Button>
                    </form>


                    {
                        reviews && reviews.length > 0 ?
                            (<DataGrid
                                columns={columns}
                                rows={rows}
                                pageSize={10}
                                disableSelectionOnClick
                                autoHeight
                                className="productListTable"
                            />)
                            : <h1 className="productReviewsForHeading">No Reviews Found</h1>
                    }
                </div>
            </div>
        </>
    );
};


export default ProductReviews;