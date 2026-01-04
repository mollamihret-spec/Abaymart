const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); 
console.log("Stripe key:", process.env.STRIPE_KEY);

const stripe = require("stripe")(process.env.STRIPE_KEY);


const app = express();
app.use(cors());
app.use(express.json());

app.post("/payment/create", async (req, res) => {
  const total = Number(req.query.total);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Stripe server running on http://localhost:5000");
});
