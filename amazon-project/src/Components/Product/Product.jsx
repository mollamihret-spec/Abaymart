import ProductCard from './ProductCard'
import React,{useState, useEffect} from 'react';
import axios from 'axios'
import classes from './Product.module.css'
import Loader from '../../Components/Loader/Loader'
function Product() {
    const [products,setProducts] = useState([])
    const[isLoading,setisLoading]= useState(true)

    useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
    .then((res)=>{
     setProducts(res.data)
     setisLoading(false)
    }).catch((err)=>{
        console.log(err)
      setisLoading(false)
    })
    },[])
  return (
    <>
    {isLoading ? (<Loader/>) : (  <section className={classes.product_container}>
{products.map((singleProduct)=>(
    <ProductCard renderAdd={true} product={singleProduct} key={singleProduct.id}/>
))}
    </section>)}
    
    </>
   

  )
}

export default Product