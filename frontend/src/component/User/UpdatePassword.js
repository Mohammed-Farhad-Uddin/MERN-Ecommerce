import React, { useEffect, useState } from 'react';
import './UpdatePassword.css';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, updatePassword } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockOpenIcon from '@mui/icons-material/LockOpen';


const UpdatePassword = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { error, isUpdated, loading } = useSelector(state => state.profile);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const updatePasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('oldPassword', oldPassword);
        myForm.set('newPassword', newPassword);
        myForm.set('confirmPassword', confirmPassword);
        dispatch(updatePassword(myForm));
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors()) kora
        }
        if (isUpdated) {
            alert.success("Password updated successfully");
            history.push("/account");

            dispatch({
                type: UPDATE_PASSWORD_RESET,
            });
        }
    }, [dispatch, alert, error, isUpdated, history]);
    return (
        <>
            {
                loading ? <Loader /> :
                    <>
                        <MetaData title="Update Password" />
                        <div className="updatePasswordContainer">
                            <div className="updatePasswordBox">
                                <h2 className="updatePasswordHeading" >Update Password</h2>
                                <form className="updatePasswordForm"
                                    encType="multipart/form-data"//image k string e nibe
                                    onSubmit={updatePasswordSubmit}>

                                    <div className="loginPassword">
                                        <VpnKeyIcon />
                                        <input
                                            type="password"
                                            placeholder="Old Password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required />
                                    </div>
                                    <div className="loginPassword">
                                        <LockOpenIcon />
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required />
                                    </div>
                                    <div className="loginPassword">
                                        <LockIcon />
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required />
                                    </div>
                                    <input type="submit" value="Change" className='updatePasswordBtn' />
                                </form>
                            </div>
                        </div>
                    </>
            }
        </>
    );
};

export default UpdatePassword;