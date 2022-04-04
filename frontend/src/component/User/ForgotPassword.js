import React, { useEffect, useState } from 'react';
import './ForgotPassword.css';
import { useHistory } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, forgotPassword } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';

const ForgotPassword = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { error, message, loading } = useSelector(state => state.forgotPassword);

    const [email, setEmail] = useState("");

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('email', email);
        dispatch(forgotPassword(myForm));
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors()) kora
        }
        if (message) {
            alert.success(message);
        }
    }, [dispatch, alert, error, message]);

    return (
        <>
            {
                loading ? <Loader /> :
                    <>
                        <MetaData title="Forgot Password" />
                        <div className="forgotPasswordContainer">
                            <div className="forgotPasswordBox">
                                <h2 className="forgotPasswordHeading" >Forgot Password</h2>
                                <form className="forgotPasswordForm"
                                    onSubmit={forgotPasswordSubmit}>
                                    <div className="forgotPasswordEmail">
                                        <MailOutlineIcon />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required />
                                    </div>
                                    <input type="submit" value="Send" className='forgotPasswordBtn' />
                                </form>
                            </div>
                        </div>
                    </>
            }
        </>
    );
};

export default ForgotPassword;