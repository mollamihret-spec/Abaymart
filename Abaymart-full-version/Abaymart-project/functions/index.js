const {onRequest} =require("firebase-functions/https");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe");
const {setGlobalOptions} = require("firebase-functions/options");

dotenv.config();

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
setGlobalOptions({maxInstances: 10});


const stripeClient = stripe(process.env.STRIPE_KEY);


app.get("/", (req, res) => {
  res.status(200).json({message: "API is working!"});
});


app.post("/payment/create", async (req, res) => {
  try {
    const {total} = req.body; 

    if (!total || total <= 0) {
      return res.status(400).json({
        message: "Total must be greater than 0",
      });
    }
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(total * 100), 
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({
      message: "Payment failed",
      error: error.message,
    });
  }
});

exports.api = onRequest(app);
