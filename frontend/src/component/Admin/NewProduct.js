import React, { useEffect, useState } from 'react';
import './NewProduct.css';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { clearErrors, createProduct } from '../../actions/productAction';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import StorageIcon from '@mui/icons-material/Storage';




const NewProduct = ({ history }) => {
    const categories = ["Laptop", "Camera", "Footwear", "SmartPhones", "Attire", "Tops", "Bottom"];
    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error, success } = useSelector((state) => state.newProduct);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);


    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors);
        }

        if (success) {
            alert.success("Product created Successfully");
            history.push("/admin/dashboard");
            dispatch({ type: NEW_PRODUCT_RESET });
        }

    }, [dispatch, alert, error, history, success]);


    const createProductSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);

        images.forEach((image) => {
            myForm.append("images", image);
        });

        dispatch(createProduct(myForm));
    };

    //input wala image er onChnage
    const createProductImagesChange = (e) => {
        const files = Array.from(e.target.files)//Array.from creates a copy of an array

        //sob imagefile files er modde eshe jawar por ei gula empty kora hocce//ei gula te ek image add korle abr arek ta image kora hole agher image empty hoye jabe
        // setImages([]);
        // setImagesPreview([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    return (
        <>
            <MetaData title="Create Product" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form encType="multipart/form-data" onSubmit={createProductSubmitHandler} className="createProductForm">
                        <h1>Create Product</h1>
                        <div>
                            <SpellcheckIcon />
                            <input
                                type="text"
                                Placeholder="Product Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <AttachMoneyIcon />
                            <input
                                type="number"
                                Placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <DescriptionIcon />
                            <textarea
                                type="text"
                                Placeholder="Product Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                cols="30"
                                rows="1"
                            ></textarea>
                        </div>

                        <div>
                            <AccountTreeIcon />
                            <select onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Choose Category</option>
                                {categories.map((cate) => (<option key={cate} value={cate}>{cate}</option>))}
                            </select>
                        </div>

                        <div>
                            <StorageIcon />
                            <input
                                type="number"
                                Placeholder="Stock"
                                // value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                            />
                        </div>

                        <div id="createProductFormFile">
                            <StorageIcon />
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={createProductImagesChange}
                                multiple
                            />
                        </div>

                        <div id="createProductFormImage">
                            {imagesPreview.map((image, index) => (
                                <img src={image} alt="Product Preview" key={index} />//ei kane image ta frontend tekhe dekanu hocce tai image.url ta lage nai kintu UpdateProduct e oldImages e image.url dewa hoice krn oi ta backend tekhe astece ...oi kane public_id r url ace
                            ))}
                        </div>

                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={loading ? true : false}
                        >Create</Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default NewProduct;