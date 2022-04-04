import React, { useEffect, useState } from 'react';
import './NewProduct.css';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { UPDATE_USER_RESET } from '../../constants/userConstants';
import { getUserDetails, updateUser, clearErrors } from '../../actions/userAction';
import Loader from '../layout/Loader/Loader';



const UpdateUser = ({ history, match }) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, user } = useSelector((state) => state.userDetails);

    const { loading: updateLoading, error: updateError, isUpdated } = useSelector((state) => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");



    useEffect(() => {
        if (user && user._id !== match.params.id) {
            dispatch(getUserDetails(match.params.id));
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors);
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors);
        }

        if (isUpdated) {
            alert.success("User Updated Successfully");
            history.push("/admin/users");
            dispatch({ type: UPDATE_USER_RESET });
        }

    }, [dispatch, alert, error, history, isUpdated, updateError, user, match.params.id]);


    const updateUserSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);

        dispatch(updateUser(match.params.id, myForm));
    };


    return (
        <>
            <MetaData title="Update User---Admin" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    {
                        loading ? <Loader /> :
                            <form encType="multipart/form-data" onSubmit={updateUserSubmitHandler} className="createProductForm">
                                <h1>Update User</h1>
                                <div>
                                    <PersonIcon />
                                    <input
                                        type="text"
                                        Placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        Placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <VerifiedUserIcon />
                                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="">Choose Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>

                                <Button
                                    id="createProductBtn"
                                    type="submit"
                                    disabled={updateLoading ? true : false || role === "" ? true : false}
                                >Update</Button>
                            </form>
                    }
                </div>
            </div>
        </>
    );
};

export default UpdateUser;