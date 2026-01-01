import Rating from '@mui/material/Rating'
import CurrencyFormat from '../CurrencyFormat/CurrencyFormat'
import classes from './Product.module.css'
import { Link } from 'react-router-dom'
import React,{useContext} from 'react'
import { DataContext } from '../DataProvider/DataProvider'
import { Type } from '../../Utility/action.type'

function ProductCard({ product,flex,renderDesc,renderAdd }) {
  // const {state,dispatch} = useContext(DataContext)
  const {dispatch} = useContext(DataContext)
  if (!product) return null

  const { image, title, id, price, rating,description } = product

  const addToCart = () =>{
    dispatch({
         type :Type.ADD_TO_BASKET,
         item: {
         image, title, id, price, rating,description
      }
    }

    )
  }

  return (
    <div className={`${classes.card_container} ${flex ? classes.product_flexed : '' }`}>
      <Link to={`/products/${id}`}>
        <img src={image} alt={title} />
      </Link>

      <div>
        <h3>{title}</h3>
        {renderDesc && <div style={{maxWidth: "750px"}}>{description}</div> }
        <div className={classes.rating}>
          <Rating value={rating?.rate || 0} precision={0.5} readOnly />
          <small>{rating?.count || 0}</small>
        </div>
        <div>
              <CurrencyFormat amount={price} />
        </div>
        
        {
          renderAdd && 
               <button className={classes.button} onClick={addToCart}>
          Add to cart
        </button>

        }
        

          
      </div>
    </div>
  )
}

export default ProductCard
