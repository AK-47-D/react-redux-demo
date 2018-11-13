import React from 'react'
import ProductList from '../components/ProductList'
import {connect} from 'dva';
import styles from './Products.css';


const Products = ({dispatch, products}) => {

  function handleDelFn(id) {
    dispatch({
      type: 'products/delete',
      payload: id,
    })
  }

  return (
    <div className={styles.container}>
      <h2>List of Products</h2>
      <ProductList products={products} onDelFn={handleDelFn}/>
    </div>
  )
}

export default connect(
  ({products}) => {
    return {
      products,
    }
  })(Products);
