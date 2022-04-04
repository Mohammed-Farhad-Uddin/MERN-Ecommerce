import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './component/layout/Header/Header.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import WebFont from 'webfontloader';
import Footer from './component/layout/Footer/Footer.js';
import Home from './component/Home/Home.js';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Products/Products.js';
import Search from './component/Products/Search.js';
import LoginSignUp from './component/User/LoginSignUp';
import { loadUser } from './actions/userAction';
import store from './store';
import { useSelector } from 'react-redux';
import UserOptions from './component/layout/Header/UserOptions.js';
// import { useDispatch } from 'react-redux';
import Profile from './component/User/Profile.js';
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile.js';
import UpdatePassword from './component/User/UpdatePassword.js';
import ForgotPassword from './component/User/ForgotPassword.js';
import ResetPassword from './component/User/ResetPassword.js';
import Cart from './component/Cart/Cart.js';
import Shipping from './component/Cart/Shipping.js';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import Payment from './component/Cart/Payment.js';
import OrderSuccess from './component/Cart/OrderSuccess.js';
import MyOrders from './component/Order/MyOrders.js';
import OrderDetails from './component/Order/OrderDetails.js';
import Dashboard from './component/Admin/Dashboard.js';
import ProductList from './component/Admin/ProductList.js';
import UpdateProduct from './component/Admin/UpdateProduct.js';
import OrderList from './component/Admin/OrderList.js';
import ProccessOrder from './component/Admin/ProccessOrder.js';
import UsersList from './component/Admin/UsersList.js';
import UpdateUser from './component/Admin/UpdateUser.js';
import ProductReviews from './component/Admin/ProductReviews.js';
import Contact from './component/layout/Contact/Contact';
import NotFound from './component/layout/NotFound/NotFound.js';

import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import NewProduct from './component/Admin/NewProduct';



function App() {
  // const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.user);

  //backend tekeh stripeApiKey ta receive kora hocce ....ei ta ei kane direct o use kora jaito
  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
    const { data } = await axios.get('/api/v1/stripeApiKey');
    setStripeApiKey(data.stripeApiKey);
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    //sob page e user login show korar jnno app.js e dispatch kora hoice..website load eo state.user e store takle token takle
    store.dispatch(loadUser());//ei rkm vabeo dispatch kora jai
    // dispatch(loadUser());

    getStripeApiKey();
  }, []);

  // window.addEventListener("contextmenu", (e) => e.preventDefault());// ei tar karone amader website er page e right click kaj korbe na tkn inspect o kora jabe na

  return (
    <Router>

      <Header />
      {isAuthenticated && <UserOptions user={user} />}


      {/* stripe Element takhai ei ta switch er baire rakha hoice...Element er bitor component and path ace,,,switch er kaj hocce ek time e ek ta url run kora  */}
      {
        stripeApiKey && (<Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>)
      }

      <Switch>

        <Route exact path="/" component={Home} />

        <Route exact path="/product/:id" component={ProductDetails} />

        <Route exact path="/products" component={Products} />

        <Route path="/products/:keyword" component={Products} />

        <Route exact path="/Search" component={Search} />

        <Route exact path="/login" component={LoginSignUp} />

        <ProtectedRoute exact path="/account" component={Profile} />

        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />

        <ProtectedRoute exact path="/password/update" component={UpdatePassword} />

        <Route exact path="/password/forgot" component={ForgotPassword} />

        <Route exact path="/password/reset/:token" component={ResetPassword} />

        <Route exact path="/cart" component={Cart} />

        <ProtectedRoute exact path="/shipping" component={Shipping} />

        <ProtectedRoute exact path="/success" component={OrderSuccess} />

        <ProtectedRoute exact path="/orders" component={MyOrders} />


        {/* 2 ta link same howa te switch use hoice jate ek time ek ta link render hoi,,,order/confirm ei kane confirm k order/:id id hisabe dore nicilo tai ek sathe 2 ta link render hoccilo */}
        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />

        <ProtectedRoute exact path="/order/:id" component={OrderDetails} />

        <ProtectedRoute isAdmin={true} exact path="/admin/dashboard" component={Dashboard} />

        <ProtectedRoute isAdmin={true} exact path="/admin/products" component={ProductList} />

        <ProtectedRoute isAdmin={true} exact path="/admin/createProduct" component={NewProduct} />

        <ProtectedRoute isAdmin={true} exact path="/admin/product/:id" component={UpdateProduct} />

        <ProtectedRoute isAdmin={true} exact path="/admin/orders" component={OrderList} />

        <ProtectedRoute isAdmin={true} exact path="/admin/order/:id" component={ProccessOrder} /> {/* update order */}

        <ProtectedRoute isAdmin={true} exact path="/admin/users" component={UsersList} />

        <ProtectedRoute isAdmin={true} exact path="/admin/user/:id" component={UpdateUser} />

        <ProtectedRoute isAdmin={true} exact path="/admin/reviews" component={ProductReviews} />

        <Route exact path="/contact" component={Contact} />

        {/* bitore condition ta na dile switch er bitorer path gula baad e onno path dile NotFound page show korbe...kintu switch er baire path /process/payment jei ta ace oi ta likleo NotFound asbe kintu amader oi pathName e component ace tai keo jodi direct /process/payment likhe taile null asbe kintu product add kore buy korte gele tkn component ta load hobe  */}
        <Route component={window.location.pathname === "/process/payment" ? null : NotFound} />

      </Switch>



      <Footer />

    </Router>
  );
}

export default App;
