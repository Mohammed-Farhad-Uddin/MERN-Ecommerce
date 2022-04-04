import React, { useEffect, useRef, useState } from 'react';
import './LoginSignUp.css';
import { Link, useHistory, useLocation } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FaceIcon from '@mui/icons-material/Face';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors, register } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';

const LoginSignUp = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { error, loading, isAuthenticated, } = useSelector(state => state.user);

    const loginTab = useRef(null);//ei ta document.querySelector(".loginForm") er bodle use hoice react e. react e dom acces kora jabe na form k select korar jnno
    const registerTab = useRef(null);
    const switchTab = useRef(null);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });
    const { name, email, password } = user;//uporer state tekhe destruct kora hoice
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState('/Profile.png');


    const redirect = location.search ? location.search.split("=")[1] : "/account"; //location.search hocce checkout e and oita checkout e click korle true hobe //cart er checkOut e click korle history.push('/login?redirect=shipping') user login kora na takle login page e niye jabe jodi login kora takhe tahole ?redirect=shipping ei ta diye location search kora hocce tar mane location.search e = paile orthat /login?redirect=shipping e = k split kore split("=")[1] index[1]mane shipping k newa hocce.
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors()) kora
        }
        if (isAuthenticated) {
            history.push(redirect);
        }
    }, [dispatch, alert, error, isAuthenticated, history, redirect]);

    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switchTab.current.classList.add("shiftToNeutral");
            switchTab.current.classList.remove("shiftToRight");

            loginTab.current.classList.remove("shiftToLeft");
            registerTab.current.classList.remove("shiftToNeutralForm");
        }
        if (tab === "register") {
            switchTab.current.classList.remove("shiftToNeutral");
            switchTab.current.classList.add("shiftToRight");

            loginTab.current.classList.add("shiftToLeft");
            registerTab.current.classList.add("shiftToNeutralForm");
        }
    };

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
    };

    //register part
    const registerSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('email', email);
        myForm.set('password', password);
        myForm.set('avatar', avatar);
        dispatch(register(myForm));
    };

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {//total 3 ta state 0 mane initial 1 mane proccessing 2 mane done
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };


    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title="Login in Ecommerce Site" />
                    <div className="LoginSignUpContainer">
                        <div className="LoginSignUpBox">
                            <div>
                                <div className="login_signUp_toggle">
                                    <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                                    <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                                </div>
                                <button ref={switchTab}></button>
                            </div>
                            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                                <div className="loginEmail">
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required />
                                </div>
                                <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required />
                                </div>
                                <Link to="/password/forgot">Forgot Password?</Link>
                                <input type="submit" value="login" className='loginBtn' />
                            </form>
                            <form className="signUpForm"
                                ref={registerTab}
                                encType="multipart/form-data"//image k string e nibe
                                onSubmit={registerSubmit}>
                                <div className="signUpName">
                                    <FaceIcon />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        name="name"
                                        value={name}
                                        onChange={registerDataChange}
                                        required />
                                </div>
                                <div className="signUpEmail">
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={registerDataChange}
                                        required />
                                </div>
                                <div className="signUpPassword">
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={registerDataChange}
                                        required />
                                </div>
                                <div id="registerImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input type="file" name="avatar" accept="image/*" onChange={registerDataChange} />
                                </div>
                                <input type="submit" value="Register" className='signUpBtn' />
                            </form>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default LoginSignUp;