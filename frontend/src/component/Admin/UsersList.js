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
import { getAllUsers, clearErrors, deleteUser } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';


const UsersList = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { error: deleteError, isDeleted, message } = useSelector(state => state.profile)

    const { error, users } = useSelector(state => state.allUsers);

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
            alert.success(message);
            history.push("/admin/users");
            dispatch({ type: DELETE_USER_RESET });
        }
        dispatch(getAllUsers());
    }, [alert, error, dispatch, deleteError, isDeleted, history, message]);


    const columns = [
        { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },
        { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
        { field: "name", headerName: "Name", minWidth: 150, flex: 0.5 },
        {
            field: "role",
            headerName: "Role",
            type: "number",
            minWidth: 150,
            flex: 0.3,
            cellClassName: (params) => {
                return params.getValue(params.id, "role") === "admin" ? "greenColor" : "redColor";//greenColor ba redColor app.css e set kora hoice
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
                        <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>
                        <Button onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}>
                            <DeleteIcon />
                        </Button>
                    </>
                );
            },
        },
    ];

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id))
    };


    const rows = [];
    users && users.forEach((user) => rows.push({
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
    }));




    return (
        <>
            <MetaData title="All Users - Admin" />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 className="productListHeading">All Users</h1>
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

export default UsersList;