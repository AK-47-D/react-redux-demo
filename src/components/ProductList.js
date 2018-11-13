import React from 'react'
import PropTypes from 'prop-types'
import {Button, Popconfirm, Table} from 'antd'

/**
 * React Component 有 3 种定义方式，分别是:
 * React.createClass, class 和 Stateless Functional Component。
 *
 * 推荐最后一种，保持简洁和无状态。
 * 这是函数，不是 Object，没有 this 作用域，是 pure function。
 * @param onDelFn
 * @param products
 * @returns {XML}
 * @constructor
 */
const ProductList = ({onDelFn, products}) => {
  const columns = [ // 表格的列
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Actions',
      render: (text, record) => {
        return (
          <Popconfirm title={'Delete?'} onConfirm={() => {
            onDelFn(record.id)
          }}>
            <Button>Delete</Button>
          </Popconfirm>
        )
      }

    }
  ]

  return (<Table dataSource={products} columns={columns}/>)
}


ProductList.propTypes = {
  onDelFn: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired
}

// 记得导出哦！
export default ProductList;
