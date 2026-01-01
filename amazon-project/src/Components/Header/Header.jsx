import React, { useContext } from 'react'
import { CiLocationOn, CiSearch } from "react-icons/ci"
import { BsCart2 } from "react-icons/bs"
import classes from "./Header.module.css"
import LowerHeader from './LowerHeader'
import { Link } from 'react-router-dom'
import { DataContext } from '../DataProvider/DataProvider'
import {auth} from '../../Utility/fireBase'

function Header() {
  // const { state, dispatch } = useContext(DataContext)
  const { state} = useContext(DataContext)
  const { user,basket } = state;
  const totalItem = basket?.reduce((amount,item) => {
    return item.amount + amount
  },0)

  return (
    < section className={classes.fixed}>
      <section>
        <div className={classes.header_container}>

          {/* logo section */}
          <div className={classes.logo_container}>
            <Link to="/">
              <img
                src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                alt="amazon logo"
              />
            </Link>

            <div className={classes.delivery}>
              <span><CiLocationOn /></span>
              <div>
                <p>Deliver to</p>
                <span>Ethiopia</span>
              </div>
            </div>
          </div>

          {/* search */}
          <div className={classes.search}>
            <select>
              <option>All</option>
            </select>
            <input type="text" placeholder="Search product" />
            <CiSearch size={38} />
          </div>

          {/* other section */}
          <div className={classes.order_container}>
            <Link to="" className={classes.language}>
              <img
                src="https://pngimg.com/uploads/flags/flags_PNG14592.png"
                alt="language"
              />
              <select>
                <option>EN</option>
              </select>
            </Link>

        {!user ? (
  <Link to="/auth">
    <div>
      <p>Hello, Sign In</p>
      <span>Account & Lists</span>
    </div>
  </Link>
) : (
  <Link> 
  <div>
    <p>Hello, {user.email.split("@")[0]}</p>
    <span onClick={() => {auth.signOut()}}>Sign Out</span>
  </div>
  
  </Link>
  
)}


            <Link to="/orders">
              <p>Returns</p>
              <span>& Orders</span>
            </Link>

            <Link to="/cart" className={classes.cart}>
              <BsCart2 size={35} />
              <span>{totalItem}</span>
            </Link>
          </div>

        </div>
      </section>

      <LowerHeader />
    </section>
  )
}

export default Header
