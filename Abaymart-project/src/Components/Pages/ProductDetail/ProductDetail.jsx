import React, {useEffect,useState } from 'react'
import Layout from '../../Layout/Layout'    
import {useParams} from 'react-router-dom'
import axios from 'axios'
import {productUrl} from '../../../API/EndPoints'
import ProductCard from '../../../Components/Product/ProductCard'
import Loader from '../../Loader/Loader'

function ProductDetail() {
const[isLoading,setisLoading]= useState(true)
const {productId} = useParams()
const [product,setProduct] = useState({})

useEffect(() => {
  axios.get(`${productUrl}/products/${productId}`)
  .then((res) => {
     setProduct(res.data)
     setisLoading(false)
  }).catch((err)=>{
    console.log(err)
    setisLoading(false)
  })
},[])
  return (
    <Layout>
      {isLoading ? (<Loader/>) : (<ProductCard
      product={product}
        flex={true}
        renderDesc={true}
        renderAdd={true}
        />)}
      
      
    </Layout>
  
  )
}

export default ProductDetail