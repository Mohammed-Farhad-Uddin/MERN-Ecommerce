import React, { useEffect } from 'react';
import Sidebar from './Sidebar.js';
import './Dashboard.css';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProduct } from '../../actions/productAction.js';
import { getAllOrders } from '../../actions/orderAction.js';
import { getAllUsers } from '../../actions/userAction.js';
import { Doughnut, Line } from 'react-chartjs-2';



const Dashboard = () => {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.products);
    const { orders } = useSelector(state => state.allOrders);
    const { users } = useSelector(state => state.allUsers);
    useEffect(() => {
        dispatch(getAdminProduct());
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    }, [dispatch]);

    let outOfStock = 0;
    products && products.forEach((item) => {
        if (item.stock === 0) {
            outOfStock += 1;
        }
    });

    let totalAmount = 0;
    orders && orders.forEach((ord) => (
        totalAmount += ord.totalPrice
    ));


    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: ["tomato"],
                hoverBackgroundColor: ["rgb(197, 72, 49)"],
                data: [0, totalAmount],
            },
        ],
    };
    const doughnutState = {
        labels: ["Out Of Stock", "In Stock"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: ["#00A684","#680084"],
                hoverBackgroundColor: ["rgb(197, 72, 49)"],
                data: [outOfStock, products.length - outOfStock],
            },
        ],
    };




    return (
        <div className="dashboard">
            <Sidebar />
            <div className="dashboardContainer">
                <Typography component="h1"> Dashboard </Typography>
                <div className="dashboardSummary">
                    <div>
                        <p>
                            Total Amount <br /> ${totalAmount}
                        </p>
                    </div>
                    <div className="dashboardSummaryBox2">
                        <Link to="/admin/products">
                            <p>Product</p>
                            <p>{products && products.length}</p>
                        </Link>
                        <Link to="/admin/orders">
                            <p>Orders</p>
                            <p>{orders && orders.length}</p>
                        </Link>
                        <Link to="/admin/users">
                            <p>Users</p>
                            <p>{users && users.length}</p>
                        </Link>
                    </div>
                </div>
                <div className="lineChart">
                    <Line data={lineState} />
                </div>
                <div className="doughnutChart">
                    <Doughnut data={doughnutState} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;