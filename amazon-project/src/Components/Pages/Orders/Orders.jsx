import React, { useContext, useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import { db } from "../../../Utility/fireBase";
import { DataContext } from "../../DataProvider/DataProvider";
import classes from "./orders.module.css";
import ProductCard from '../../Product/ProductCard'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function Orders() {
  const { state } = useContext(DataContext);
  const { user } = state;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    const ordersRef = collection(db, "users", user.uid, "orders");

    
    const orderQuery = query(ordersRef, orderBy("created", "desc"));

    
    const unsubscribe = onSnapshot(orderQuery, (snapshot) => {
      setOrders(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

  
    return () => unsubscribe();
  }, [user]);

  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.orders__container}>
          <h2>Your Orders</h2>
           { orders?.length === 0 && <div style={{padding: "20px"}}> You don't have orders yet.</div>
           
             }
          
          <div>{
             orders?.map((eachOrder,i) => {
              return (
                <div>
                  <hr />
                  <p>Order ID: {eachOrder?.id} </p>
                  {
                    eachOrder?.data?.basket?.map(
                      order => {
                        return(
                           <ProductCard
                        flex={true}
                        product={order}
                        key={order.id || order.title}/>

                        )
                      
                       
                      }

                    )
                  }  </div>)
              
              
            } )} 
             
               
                </div>
            </div>
      </section>
    </Layout>
  );
}

export default Orders;









