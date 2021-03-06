import React, { useEffect, useState } from 'react';
import './UpdateProfile.css';
import {useHistory } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FaceIcon from '@mui/icons-material/Face';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loadUser, updateProfile } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';

const UpdateProfile = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { user } = useSelector(state => state.user);
    const { error, isUpdated, loading } = useSelector(state => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState('/Profile.png');


    const updateProfileSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('email', email);
        myForm.set('avatar', avatar);
        dispatch(updateProfile(myForm));
    };

    const updateProfileDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {//total 3 ta state 0 mane initial 1 mane proccessing 2 mane done
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());//error ta show korbe alert er moto show howar ei ta permanent na takhar jnno dispatch(clearErrors()) kora
        }
        if (isUpdated) {
            alert.success("Profile updated successfully");
            dispatch(loadUser());
            history.push("/account");

            dispatch({
                type: UPDATE_PROFILE_RESET,
            });
        }
    }, [dispatch, alert, error, isUpdated, history, user]);

    return (
        <>
            {
                loading ? <Loader /> :
                    <>
                        <MetaData title="Update Profile" />
                        <div className="updateProfileContainer">
                            <div className="updateProfileBox">
                                <h2 className="updateProfileHeading" >Update Profile</h2>
                                <form className="updateProfileForm"
                                    encType="multipart/form-data"//image k string e nibe
                                    onSubmit={updateProfileSubmit}>
                                    <div className="updateProfileName">
                                        <FaceIcon />
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            name="name"
                                            value={name}
                                            onChange={(e)=>setName(e.target.value)}
                                            required />
                                    </div>
                                    <div className="updateProfileEmail">
                                        <MailOutlineIcon />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e)=>setEmail(e.target.value)}
                                            required />
                                    </div>
                                    <div id="updateProfileImage">
                                        <img src={avatarPreview} alt="Avatar Preview" />
                                        <input type="file" name="avatar" accept="image/*" onChange={updateProfileDataChange} />
                                    </div>
                                    <input type="submit" value="update" className='updateProfileBtn' />
                                </form>
                            </div>
                        </div>
                    </>
            }
        </>
    );
};

export default UpdateProfile;