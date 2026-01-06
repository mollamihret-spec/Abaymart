import React, { useState, useContext } from "react";
import Layout from "../../Layout/Layout";
import classes from "./payment.module.css";
import { DataContext } from "../../DataProvider/DataProvider";
import ProductCard from "../../Product/ProductCard";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../CurrencyFormat/CurrencyFormat";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { Type } from "../../../Utility/action.type";

function Payment() {
  const { state: { user, basket }, dispatch } = useContext(DataContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  // Total items and total price
  const totalItem = basket?.reduce((amount, item) => amount + item.amount, 0);
  const totalAmount = basket?.reduce((sum, item) => sum + item.price * item.amount, 0);

  const handleChange = (e) => {
    setCardError(e?.error?.message || "");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setCardError(null);

    try {
      // Create Stripe Payment Intent (in cents)
      const stripeResponse = await axios.post(
        `http://localhost:5000/payment/create?total=${Math.round(totalAmount * 100)}`
      );
      const clientSecret = stripeResponse.data.clientSecret;

      //  Confirm Payment
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

      // Store order in MySQL backend
      await axios.post("http://localhost:4001/orders", {
        user_id: user.uid,  
        total: totalAmount,
        status: "Succeeded",
        basket: basket.map(item => ({
          product_id: item.id,
          quantity: item.amount || 1,
          price: item.price,
        }))
      });

      //  Empty basket
      dispatch({ type: Type.EMPTY_BASKET });

      // Redirect to orders page
      setProcessing(false);
      navigate("/orders", { state: { msg: "You have placed a new order" } });

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

        {/* Review Items */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map(item => (
              <ProductCard key={item.id} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment */}
        <div className={classes.flex}>
          <h3>Payment methods</h3>
          <div className={classes.payment_card_container}>
            <div className={classes.payment__details}>
              <form onSubmit={handlePayment}>
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
                    ) : "Pay now"}
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



















