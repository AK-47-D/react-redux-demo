/**
 完成 UI 后，现在开始处理数据和逻辑。
 dva 通过 model 的概念把一个领域的模型管理起来，包含同步更新 state 的 reducers，处理异步逻辑的 effects，订阅数据源的 subscriptions 。
 */

const products = {
  namespace: 'products', // 表示在全局 state 上的 key
  state: [],  // 初始值，在这里是空数组
  reducers: { // redux 里的 reducer，接收 action，同步更新 state
    // reducer 是一个函数，接受 state 和 action，返回老的或新的 state 。
    // 即：(state, action) => state


    'delete'(state, {payload: id}) {
      return state.filter(item => item.id !== id)
    }

  }
}
// 记得导出哦！
export default products
