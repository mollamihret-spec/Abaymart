import { Routes, Route } from "react-router-dom";
import Landing from './Components/Pages/Landing/Landing';
import Auth from './Components/Pages/Auth/Auth';
import Payment from './Components/Pages/Payment/Payment';
import Orders from './Components/Pages/Orders/Orders';
import Cart from './Components/Pages/Cart/Cart';
import Results from './Components/Pages/Results/Results';
import ProductDetail from './Components/Pages/ProductDetail/ProductDetail'
import { Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import ProtectedRoute from "./Components/ProtectedRoute";
const stripePromise = loadStripe('pk_test_51Sjkoe0jS50L3de9WLD4ZZzq2XhwTebAoEUsUo9JwuBNawU9wT9zFJSssHt565wTcWoDWGS0foL20AHsq2pxFDwy00efRGD5fw');

function RouterFile() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/payment" element={
       
        <ProtectedRoute msg={"You must log in to pay"} 
        redirect={"/payment"}>
            <Elements stripe={stripePromise}>
            <Payment />
            </Elements>
        </ProtectedRoute>
     
          } />
      <Route path="/orders" element={
        
        <ProtectedRoute msg={"You must log in to access your orders "} 
        redirect={"/Orders"}>
            <Elements stripe={stripePromise}>
              <Orders />
            </Elements>
        </ProtectedRoute>
      } />
      <Route path="/cart" element={<Cart />} />
      <Route path="/category/:categoryName" element={<Results/>} />
      <Route path="/products/:productId" element={<ProductDetail/>} />

    </Routes>
  );
}

export default RouterFile;
