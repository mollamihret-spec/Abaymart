import React, { useEffect, useContext, useState } from "react";
import Layout from "../../Layout/Layout";
import { DataContext } from "../../DataProvider/DataProvider";
import ProductCard from "../../Product/ProductCard";
import axios from "axios";
import classes from "./orders.module.css";

function Orders() {
  
  
  const { state } = useContext(DataContext);
  const { user } = state;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    axios
.get(`http://localhost:4001/orders/user/${user.uid}`)
      .then(res => {
        setOrders(res.data);
        setLoading(false);
        
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);
  

  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.orders__container}>
        
        <h2>Your Orders</h2>

        {loading && <p>Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <p style={{padding: "20px"}}>You don't have orders yet.</p>
        )}

      <div>
        
        {orders.map(order => (
          <div key={order.id} style={{ marginBottom: "40px" }}>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total:</strong> ${order.total}</p>
            <p> <strong>Status:</strong> {order.status}</p>
          <div>
              
              {order.items.map(item => (
  <ProductCard
    key={item.product_id}
    product={{
      id: item.product_id,
      title: item.title,
      image: item.image,
      price: item.price,
      amount: item.quantity,
      rating: item.rating ? item.rating : null
    }}
    flex={true}
    
  />

))}

            </div>

            <hr />
          </div>
        ))}
      </div>


        </div>
         

      </section>
     
    </Layout>
  );
}

export default Orders;





























