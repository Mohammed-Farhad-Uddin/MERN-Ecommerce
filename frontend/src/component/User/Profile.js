import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import './Profile.css';

const Profile = () => {
    const { loading, isAuthenticated, user } = useSelector(state => state.user);
    const history = useHistory();

    useEffect(() => {
        if (isAuthenticated === false) {
            history.push('/login');
        }
    }, [history, isAuthenticated]);


    return (
        <>
            {loading ? <Loader /> : <>
                <MetaData title={`${user.name}'s Profile`} />
                <div className="profileContainer">
                    <div>
                        <h1>My Profile</h1>
                        {/* ei page ta k refresh korle user.avatar.url load hoi na  tai error ashe  user log in kora takleo. tai ei page ta k protected route e nile gele url load hoye then profile page e asbe */}
                        <img src={user.avatar.url} alt={user.name} />
                        <Link to='/me/update'>Edit Profile</Link>
                    </div>
                    <div>
                        <div>
                            <h4>Full Name</h4>
                            <p>{user.name}</p>
                        </div>
                        <div>
                            <h4>Email</h4>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <h4>Joined On</h4>
                            <p>{String(user.createdAt).substr(0, 10)}</p>
                        </div>
                        <div>
                            <Link to='/orders'>My Orders</Link>
                            <Link to='/password/update'>Change Password</Link>
                        </div>
                    </div>
                </div>

            </>
            }
        </>
    );
};

export default Profile;