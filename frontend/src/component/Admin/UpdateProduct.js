import React, { useEffect, useState } from 'react';
import './UpdateProduct.css';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { clearErrors, updateProduct, getProductDetails } from '../../actions/productAction';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import StorageIcon from '@mui/icons-material/Storage';




const UpdateProduct = ({ history, match }) => {
    const categories = ["Laptop", "Camera", "Footwear", "SmartPhones", "Attire", "Tops", "Bottom"];
    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error: updateError, isUpdated } = useSelector((state) => state.deleteUpdateProduct);
    const { error, product } = useSelector((state) => state.productDetails);


    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);


    useEffect(() => {
        if (product && product._id !== match.params.id) {
            dispatch(getProductDetails(match.params.id));
        } else {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setCategory(product.category);
            setStock(product.stock);
            setOldImages(product.images);
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors);
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors);
        }

        if (isUpdated) {
            alert.success("Product Updated Successfully");
            history.push("/admin/products");
            dispatch({ type: UPDATE_PRODUCT_RESET });
        }

    }, [dispatch, alert, error, updateError, history, isUpdated, product, match.params.id]);


    const updateProductSubmitHandler = (e) => {
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

        dispatch(updateProduct(match.params.id, myForm));
    };

    //input wala image er onChnage
    const updateProductImagesChange = (e) => {
        const files = Array.from(e.target.files)//Array.from creates a copy of an array

        //sob imagefile files er modde eshe jawar por ei gula empty kora hocce//ei gula te ek image add korle abr arek ta image kora hole agher image empty hoye jabe
        setImages([]);
        setImagesPreview([]);
        setOldImages([]);//update image input dile oldImages gula remove hoye jabe mane empty hobe

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
            <MetaData title="Update Product" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form encType="multipart/form-data" onSubmit={updateProductSubmitHandler} className="createProductForm">
                        <h1>Update Product</h1>
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
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Choose Category</option>
                                {categories.map((cate) => (<option key={cate} value={cate}>{cate}</option>))}
                            </select>
                        </div>

                        <div>
                            <StorageIcon />
                            <input
                                type="number"
                                Placeholder="Stock"
                                value={stock}
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
                                onChange={updateProductImagesChange}
                                multiple
                            />
                        </div>

                        <div id="createProductFormImage">
                            {oldImages && oldImages.map((image, index) => (
                                <img src={image.url} alt="Old Product Preview" key={index} />//ei kane image.url dewa hoice krn ei ta backend tekhe astece and backend image e public_id and url ace oi kan tekhe url show kora lagtece
                            ))}
                        </div>

                        <div id="createProductFormImage">
                            {imagesPreview.map((image, index) => (
                                <img src={image} alt="Product Preview" key={index} />
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

export default UpdateProduct;