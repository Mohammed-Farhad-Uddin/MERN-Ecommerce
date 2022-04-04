import React from 'react';
import playStore from '../../../images/playstore.png';
import appStore from '../../../images/Appstore.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer id="footer">
            <div className="leftFooter">
                <h4>Download Our App</h4>
                <p>Download app for Android and IOS for your mobile</p>
                <img src={playStore} alt="PlayStore" />
                <img src={appStore} alt="AppStore" />
            </div>
            <div className="midFooter">
                <h1>Ecommerce</h1>
                <p>Hight quality is our first piority</p>
                <p>Copyrights 2022 &copy; Mohammed Farhad Uddin </p>
            </div>
            <div className="rightFooter">
                <h4>Find me</h4>
                <a href="https://web.facebook.com/profile.php?id=100004190257300" target="_blank">Facebook</a>
                <a href="https://web.facebook.com/profile.php?id=100004190257300" target="_blank">Instagram</a>
                <a href="https://web.facebook.com/profile.php?id=100004190257300" target="_blank">Twitter</a>
            </div>

        </footer>
    );
};

export default Footer;