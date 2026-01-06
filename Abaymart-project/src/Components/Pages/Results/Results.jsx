import Layout from '../../Layout/Layout'
import {useParams} from 'react-router-dom'  
import axios from 'axios'
import {productUrl} from '../../../API/EndPoints'
import React,{useState,useEffect} from 'react'
import classes from './results.module.css'
import ProductCard from '../../../Components/Product/ProductCard'
import Loader from '../../Loader/Loader'

function Results() {
  const [results,setResults] = useState([])
  const {categoryName} = useParams()
  const[isLoading,setisLoading]= useState(true)
  
  useEffect(()=>{
   axios.get(`${productUrl}/products/category/${categoryName}`)
  .then((res)=>{
    setResults(res.data)
    setisLoading(false)
  }).catch((err)=>{
    console.log(err)
    setisLoading(false)
  })
  },[])
  
  return (
    <Layout>

        <section>
          <h2 style={{padding:"30px"}}>Results</h2>
          <p style={{padding:"30px"}}>Category / {categoryName}</p>
          <hr />
      {isLoading ? (<Loader/>) : (
          <div className={classes.product_container}>
            {results?.map((product)=>(
                    <ProductCard    
                        key={product.id}
                        product={product}
                        renderAdd={true}/>
            ))}

          </div>

        )}
       </section>
    </Layout>
    
  )
}

export default Results