import React, { useState, useContext } from "react";
import Layout from "../../Layout/Layout";
import classes from "./payment.module.css";
import { DataContext } from "../../DataProvider/DataProvider";
import ProductCard from "../../Product/ProductCard";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../../API/axios";
import { PulseLoader } from "react-spinners";
import { db } from "../../../Utility/fireBase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate} from "react-router-dom";
import { Type } from "../../../Utility/action.type";

function Payment() {
  const { state: { user, basket }, dispatch } = useContext(DataContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate()

  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  // Calculate totals
  const totalItem = basket?.reduce((amount, item) => amount + item.amount, 0);
  const totalAmount = basket?.reduce((sum, item) => sum + item.price * item.amount, 0);

  // Handle card errors
  const handleChange = (e) => {
    setCardError(e?.error?.message || "");
  };

  // Payment handler
  const handelPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setCardError(null);

    try {
      // 1️⃣ Get client secret from backend
      const response = await axiosInstance.post("/payment/create", { total: totalAmount });
      const clientSecret = response.data.clientSecret;

      // 2️⃣ Confirm payment with Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status !== "succeeded") {
        setCardError("Payment failed. Please try again.");
        setProcessing(false);
        return;
      }

      // 3️⃣ Save order in Firestore
      const orderRef = doc(db, "users", user.uid, "orders", paymentIntent.id);
      await setDoc(orderRef, {
        basket,
        amount: paymentIntent.amount,
        created: paymentIntent.created,
      });

      // 4️⃣ Clear basket
      dispatch({type: Type.EMPTY_BASKET})

      setProcessing(false);
      navigate("/orders", {state: {msg: "You have placed new order"}})
      
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      setProcessing(false);
      setCardError("Payment failed. Please try again.");
    }
  };

  return (
    <Layout>
      <div className={classes.payment_header}>
        Checkout ({totalItem}) items
      </div>

      <section className={classes.payment}>
        {/* Delivery Address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>Street: 123 Main Street</div>
            <div>Apartment: Apt 4B</div>
          </div>
        </div>
        <hr />

        {/* Products */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard key={item.id} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment Form */}
        <div className={classes.flex}>
          <h3>Payment methods</h3>
          <div className={classes.payment_card_container}>
            <div className={classes.payment__details}>
              <form onSubmit={handelPayment}>
                {cardError && <small style={{ color: "red" }}>{cardError}</small>}
                <CardElement onChange={handleChange} />

                <div className={classes.payment__price}>
                  <div>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <p>Total order</p> | <CurrencyFormat amount={totalAmount} />
                    </span>
                  </div>

                  <button type="submit" disabled={processing || !stripe}>
                    {processing ? (
                      <div className={classes.loading}>
                        <PulseLoader />
                        <p>Please wait...</p>
                      </div>
                    ) : (
                      "Pay now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Payment;








// import React, { useState,useContext } from 'react';
// import Layout from '../../Layout/Layout';
// import classes from './payment.module.css';
// import { DataContext } from '../../DataProvider/DataProvider';
// import ProductCard from '../../Product/ProductCard';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import CurrencyFormat from '../../CurrencyFormat/CurrencyFormat';
// import {axiosInstance} from '../../../API/axios'
// import {PulseLoader} from 'react-spinners'
// import { db } from '../../../Utility/fireBase';
// import { collection, doc, setDoc } from "firebase/firestore";

// function Payment() {

//   const [cardError, setCardError] = useState(null)
//   const { state: { user, basket } } = useContext(DataContext);

//   const [processing, setProcessing] = useState(false)
//   const stripe = useStripe();
//   const elements = useElements();

//   const totalItem = basket?.reduce((amount, item) => {
//     return amount + item.amount;
//   }, 0);

// const totalAmount = basket?.reduce(
//   (sum, item) => sum + item.price * item.amount,
//   0
// );


  
//   const handleChange = (e) =>{
//           console.log(e)
//           e?.error?.message? setCardError( e?.error?.message) : setCardError("")
//   }




//   const handelPayment = async (e) => {
//   e.preventDefault();

//   try {

//     setProcessing(true)
//     //1  backend || function ----> contact to get the client secret
//     const response = await axiosInstance.post(
//       "/payment/create",
//       { total: totalAmount }   // ✅ BODY
//     );

//     // console.log("Client Secret:", response.data.clientSecret);
//     const clientSecret = response.data?.clientSecret;

    
// //  2 // client side (react side) confirmation through stripe

// const {paymentIntent} = await stripe.confirmCardPayment(
//   clientSecret,
//   {
//      payment_method : {
//     card: elements.getElement(CardElement)
//   }
//   })

//   // console.log(paymentIntent)
//   // 3 // after confirmation ---> order firestore  database save,then clear the basket
// const orderRef = doc(db, "users", user.uid, "orders", paymentIntent.id);

// await setDoc(orderRef, {
//   basket: basket,
//   amount: paymentIntent.amount,
//   created: paymentIntent.created





//   // await db.collection("users")
//   // .doc(user.uid)
//   // .collection("orders")
//   // .doc(paymentIntent.id)
//   // .set({
//   //   basket: basket, 
//   //   amount: paymentIntent.amount,
//   //   created: paymentIntent.created 
//   })



//   setProcessing(false);

//   } catch (error) {
//     console.error("Payment error:", error.response?.data || error.message);
//     setProcessing(false);
//   }
    
// };
  

//   return (
//     <Layout>
//       {/* header */}
//       <div className={classes.payment_header}>
//         Checkout ({totalItem}) items
//       </div>

//       <section className={classes.payment}>

        
//         <div className={classes.flex}>
//           <h3>Delivery Address</h3>

//           <div>
//             <div>{user?.email}</div>
//             <div>Street: 123 Main Street</div>
//             <div>Apartment: Apt 4B</div>
//           </div>
//         </div>

//         <hr />

//         {/* products */}
//         <div className={classes.flex}>
//           <h3>Review items and delivery</h3>
//           <div>
//             {basket?.map((item) => (
//               <ProductCard
//                 key={item.id}
//                 product={item}
//                 flex={true}
//               />
//             ))}
//           </div>
//         </div>

//         <hr />

//         {/* card form */}
//         <div className={classes.flex}>
//             <h3>Payment methods</h3>
//                <div className={classes.payment_card_container}>
//                 <div className={classes.payment__details}>

//                   <form onSubmit={handelPayment}>
//                     {cardError && <small style={{color: "red"}}>{cardError}</small> }
//                     <CardElement onChange={handleChange}/>
//                     <div className={classes.payment__price}>  
//                       <div>
//                         <span style={{display: "flex",gap:"10px"}}>
//                          <p> total order</p>  | <CurrencyFormat amount={totalAmount}/>
//                         </span>
//                       </div>
//                       <button type='submit'>
//                         {
//                           processing? (
//                             <div className={classes.loading}>

//                               <PulseLoader/>
//                               <p>Please wait...</p>

//                             </div>
//                             ): "Pay now"
//                         }
//                       </button>
//                     </div>
//                   </form>
//                 </div>

//                </div>
//         </div>

//       </section>
//     </Layout>
//   );
// }

// export default Payment;
