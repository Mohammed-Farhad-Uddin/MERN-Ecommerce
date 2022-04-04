import React, { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearErrors, getAdminProduct, deleteProduct } from '../../actions/productAction';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import './ProductList.css';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';


const ProductList = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { error: deleteError, isDeleted } = useSelector(state => state.deleteUpdateProduct)

    const { error, products } = useSelector(state => state.products);
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors())
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors())
        }
        if (isDeleted) {
            alert.success("Product has been deleted successfully");
            history.push("/admin/dashboard");
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
        dispatch(getAdminProduct());
    }, [alert, error, dispatch, deleteError, isDeleted, history]);


    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 250, flex: 0.5 },
        { field: "name", headerName: "Name", minWidth: 250, flex: 1 },
        { field: "stock", headerName: "Stock", type: "number", minWidth: 150, flex: 0.3 },
        { field: "price", headerName: "Price", type: "number", minWidth: 270, flex: 0.5 },
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
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>
                        <Button onClick={() => deleteProductHandler(params.getValue(params.id, "id"))}>
                            <DeleteIcon />
                        </Button>
                    </>
                );
            },
        },
    ];

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id))
    };


    const rows = [];
    products && products.forEach((item) => rows.push({
        id: item._id,
        stock: item.stock,
        item: item.price,
        name: item.name,
    }));




    return (
        <>
            <MetaData title="All Products - Admin" />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 className="productListHeading">All Products</h1>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        disableSelectionOnClick
                        autoHeight
                        className="productListTable"
                    />
                </div>
            </div>
        </>
    );
};

export default ProductList;