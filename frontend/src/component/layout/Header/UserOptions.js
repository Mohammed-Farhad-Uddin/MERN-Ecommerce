import React, { useState } from 'react';
import './UserOptions.css';
import { SpeedDial } from '@mui/material';
import { SpeedDialAction } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useHistory } from 'react-router-dom';
import { useDispatch ,useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userAction';
import { Backdrop } from '@mui/material';



const UserOptions = ({ user }) => {
    const [open, setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const {cartItems}=useSelector(state => state.cart);
    const alert = useAlert();

    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: (<ShoppingCartIcon style={{ color: cartItems.length > 0 ? "tomato" : "unset" }} />), name: `Cart(${cartItems.length})`, func: cart,}, 
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
       
    ];

    if (user.role === "admin") {
        options.unshift({ icon: <DashboardIcon />, name: "Dashboard", func: dashboard });//options array te unshift korle ei ta first index e add hobe.options er modde object akare array
    }
    function dashboard() {
        history.push('/admin/dashboard');
    };
    function orders() {
        history.push('/orders');
    };
    function account() {
        history.push('/account');
    };
    function cart() {
        history.push('/cart');
    };
    function logoutUser() {
        dispatch(logout());
        alert.success("Logout Successfully")
    };


    return (
        <>
            {/* backdrop ei ta black shade anbe jkn speedDial e hover korle open true hobe tkn */}
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                icon={<img src={user.avatar.url ? user.avatar.url : "/Profile.png"} className="speedDialIcon" alt="Profile" />}
                direction="down"
                className="speedDial"
                style={{ zIndex: "11" }}//ei tar karone navbar e ei ta show hobe na baki page e show hobe
            >
                {options.map((item, i) => (<SpeedDialAction icon={item.icon} tooltipTitle={item.name}
                    onClick={item.func} key={i} tooltipOpen={window.innerWidth <= 600 ? true : false}/>))}

            </SpeedDial>


        </>
    );
};

export default UserOptions;