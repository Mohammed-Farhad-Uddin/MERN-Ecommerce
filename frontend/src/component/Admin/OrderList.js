import React, { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import './ProductList.css';
import { deleteOrder, getAllOrders, clearErrors } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';


const OrderList = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { error: deleteError, isDeleted } = useSelector(state => state.deleteUpdateOrder)

    const { error, orders } = useSelector(state => state.allOrders);
    
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
            alert.success("Order has been deleted successfully");
            history.push("/admin/orders");
            dispatch({ type: DELETE_ORDER_RESET });
        }
        dispatch(getAllOrders());
    }, [alert, error, dispatch, deleteError, isDeleted, history]);


    const columns = [
        { field: 'id', headerName: 'Order ID', minWidth: 300, flex: 1 },//field mane input tag er name er mota headerName value er moto , name k dore jei vabe value change oi rkm field k dore chnage kora lage
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered" ? "greenColor" : "redColor";//greenColor ba redColor app.css e set kora hoice
            }
        },
        { field: 'itemsQty', headerName: 'Items Qty', type: "number", minWidth: 150, flex: 0.3 },
        { field: 'amount', headerName: 'Amount', type: "number", minWidth: 270, flex: 0.5 },
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
                        <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>
                        <Button onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))}>
                            <DeleteIcon />
                        </Button>
                    </>
                );
            },
        },
    ];

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id))
    };


    const rows = [];
    orders && orders.forEach((item) => rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
    }));




    return (
        <>
            <MetaData title="All Orders - Admin" />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 className="productListHeading">All Orders</h1>
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

export default OrderList;