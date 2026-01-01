import React from 'react'
import Category  from "../../Category/Category"
import Product from '../../Product/Product'
import Layout from '../../Layout/Layout'
import CarouselEffect from '../../Carousel/CarouselEffect'
function Landing() {
  return (
    <div>
        <Layout>
            <CarouselEffect></CarouselEffect>
            <Category></Category>
            <Product></Product>
        </Layout>
    </div>
  )
}

export default Landing

