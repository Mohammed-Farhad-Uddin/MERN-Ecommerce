import React, { useEffect, useState } from 'react';
import './ResetPassword.css';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, resetPassword } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const ResetPassword = ({match}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { error, success, loading } = useSelector(state => state.forgotPassword);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const resetPasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('password', password);
        myForm.set('confirmPassword', confirmPassword);
        dispatch(resetPassword(match.params.token, myForm));
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors()) kora
        }
        if (success) {
            alert.success("Password Reset successfully");
            history.push("/login");
        }

    }, [dispatch, alert, error, success, history]);
    return (
        <>
            {
                loading ? <Loader /> :
                    <>
                        <MetaData title="Reset Password" />
                        <div className="resetPasswordContainer">
                            <div className="resetPasswordBox">
                                <h2 className="resetPasswordHeading" >Reset Password</h2>
                                <form className="resetPasswordForm"
                                    encType="multipart/form-data"//image k string e nibe
                                    onSubmit={resetPasswordSubmit}>
                                    <div>
                                        <LockOpenIcon />
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                    <input type="submit" value="Update" className='resetPasswordBtn' />
                                </form>
                            </div>
                        </div>
                    </>
            }
        </>
    );
};

export default ResetPassword;