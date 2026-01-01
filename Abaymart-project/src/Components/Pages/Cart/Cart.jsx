import React, { useContext } from 'react'
import Layout from '../../Layout/Layout'
import { DataContext } from '../../DataProvider/DataProvider'
import ProductCard from '../../Product/ProductCard'
import CurrencyFormat from '../../CurrencyFormat/CurrencyFormat'
import { Link } from 'react-router-dom'
import { Type } from '../../../Utility/action.type'
import classes from './cart.module.css'
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";


function Cart() {
  const { state, dispatch } = useContext(DataContext)
  const { basket, user } = state

  const increment = (item) => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item,
    })
  }

  const decrement = (id) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      id,
    })
  }

  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.cart_container}>
          <h2>Hello{user ? `, ${user.name}` : ''}</h2>
          <h3>Your shopping basket</h3>
          <hr />

          {basket?.length === 0 ? (
            <p>Oops! No item in your cart</p>
          ) : (
            basket?.map((item) => (
              <section key={item.id} className={classes.cart_product}>
                <ProductCard
                  product={item}
                  renderDesc={true}
                  flex={true}
                  renderAdd={false}
                />

                <div className={classes.btn_container}>
                  <button className={classes.btn} onClick={() => increment(item)}><IoIosArrowUp size={20}/></button>

                  <span>{item.amount}</span>

                  <button className={classes.btn} onClick={() => decrement(item.id)}><IoIosArrowDown size={20} /></button>
                </div>
              </section>
            ))
          )}
        </div>

        {basket.length !== 0 && (
          <div className={classes.subtotal}>
            <div>
              <p>Subtotal ({basket.length} items)</p>
              <CurrencyFormat
                amount={basket.reduce(
                  (sum, item) => sum + item.price * item.amount,
                  0
                )}
              />
            </div>

            <span>
              <input type="checkbox" />
              <small>This order contains a gift</small>
            </span>

            <Link  to="/payment">Continue to checkout</Link>
          </div>
        )}
      </section>
    </Layout>
  )
}

export default Cart
