import React, { useState } from 'react';
import './Shipping.css';
import PinDropIcon from '@mui/icons-material/PinDrop';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import PhoneIcon from '@mui/icons-material/Phone';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { Country, State } from 'country-state-city';
import MetaData from '../layout/MetaData';
import CheckOutSteps from '../Cart/CheckOutSteps.js';
import { saveShippinInfo } from '../../actions/cartAction';



const Shipping = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { shippinInfo } = useSelector(state => state.cart);


    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [phoneNo, setPhoneNo] = useState('');

    const shippingSubmit = (e) => {
        e.preventDefault();
        if (phoneNo.length > 10 || phoneNo.length < 10) {
            alert.error("Phone number should be 10 digit");
            return;
        }
        dispatch(saveShippinInfo({ address, city, state, country, pinCode, phoneNo }));
        history.push("/order/confirm");
    }

    return (
        <>
            <MetaData title="Shipping Info" />

            <CheckOutSteps activeStep={0} />

            <div className="shippingContainer">
                <div className="shippingBox">
                    <h2 className="shippingHeading"> Shipping Details </h2>

                    <form encType='multipart/form-data' onSubmit={shippingSubmit} className="shippingForm">
                        <div>
                            <HomeIcon />
                            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                        <div>
                            <LocationCityIcon />
                            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                        </div>
                        <div>
                            <PinDropIcon />
                            <input type="number" placeholder="Pin Code" value={pinCode} onChange={(e) => setPinCode(e.target.value)} required />
                        </div>
                        <div>
                            <PhoneIcon />
                            <input type="number" placeholder="Phone Number" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required />
                        </div>

                        <div>
                            <PublicIcon />
                            <select value={country} onChange={(e) => setCountry(e.target.value)} required>
                                <option value="">Country</option>
                                {Country && Country.getAllCountries().map((item) => (
                                    <option value={item.isoCode} key={item.isoCode}> {item.name} </option>
                                ))
                                }
                            </select>
                        </div>
                        {/* useState keo jkn country select korbe erpor state show hobe */}
                        {country && (<div>
                            <TransferWithinAStationIcon />
                            <select required value={state} onChange={(e) => setState(e.target.value)}>
                                <option value="">State</option>
                                {State && State.getStatesOfCountry(country).map((item) => (
                                    <option value={item.isoCode} key={item.isoCode}> {item.name} </option>
                                ))}
                            </select>
                        </div>)
                        }
                        <input type="submit" value="Continue" className="shippingBtn" disabled={state ? false : true} />

                    </form>
                </div>
            </div>
        </>
    );
};

export default Shipping;