# 一篇文章读懂  React and redux 前端开发 -DvaJS, a lightweight and elm-style framework.

DvaJS： React and redux based, lightweight and elm-style framework.

https://dvajs.com/

实例项目源码：https://github.com/AK-47-D/react-redux-demo

# 快速上手

## [#](https://dvajs.com/guide/getting-started.html#%E5%AE%89%E8%A3%85-dva-cli)安装 dva-cli

通过 npm 安装 dva-cli 并确保版本是 `0.9.1` 或以上。

```
$ npm install dva-cli -g
$ dva -v
dva-cli version 0.9.1

```

## [#](https://dvajs.com/guide/getting-started.html#%E5%88%9B%E5%BB%BA%E6%96%B0%E5%BA%94%E7%94%A8)创建新应用

安装完 dva-cli 之后，就可以在命令行里访问到 `dva` 命令（[不能访问？](http://stackoverflow.com/questions/15054388/global-node-modules-not-installing-correctly-command-not-found)）。现在，你可以通过 `dva new` 创建新应用。

```
$ dva new dva-quickstart

```

这会创建 `dva-quickstart` 目录，包含项目初始化目录和文件，并提供开发服务器、构建脚本、数据 mock 服务、代理服务器等功能。

然后我们 `cd` 进入 `dva-quickstart` 目录，并启动开发服务器：

```
$ cd dva-quickstart
$ npm start

```

几秒钟后，你会看到以下输出：

```
Compiled successfully!

The app is running at:

  http://localhost:8000/

Note that the development build is not optimized.
To create a production build, use npm run build.

```

在浏览器里打开 http://localhost:8000 ，你会看到 dva 的欢迎界面。

## [#](https://dvajs.com/guide/getting-started.html#%E4%BD%BF%E7%94%A8-antd)使用 antd

通过 npm 安装 `antd` 和 `babel-plugin-import` 。`babel-plugin-import` 是用来按需加载 antd 的脚本和样式的，详见 [repo](https://github.com/ant-design/babel-plugin-import) 。

```
$ npm install antd babel-plugin-import --save
（国内镜像：tnpm）

```

编辑 `.webpackrc`，使 `babel-plugin-import` 插件生效。

```
{
+  "extraBabelPlugins": [
+    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
+  ]
}

```

> 注：dva-cli 基于 roadhog 实现 build 和 dev，更多 `.webpackrc` 的配置详见 [roadhog#配置](https://github.com/sorrycc/roadhog#%E9%85%8D%E7%BD%AE)

## [#](https://dvajs.com/guide/getting-started.html#%E5%AE%9A%E4%B9%89%E8%B7%AF%E7%94%B1)定义路由

我们要写个应用来先显示产品列表。首先第一步是创建路由，路由可以想象成是组成应用的不同页面。

新建 route component `routes/Products.js`，内容如下：

```
import React from 'react';

const Products = (props) => (
  <h2>List of Products</h2>
);

export default Products;

```

添加路由信息到路由表，编辑 `router.js` :

```
+ import Products from './routes/Products';
...
+ <Route path="/products" exact component={Products} />

```

然后在浏览器里打开 http://localhost:8000/#/products ，你应该能看到前面定义的 `<h2>` 标签。

## [#](https://dvajs.com/guide/getting-started.html#%E7%BC%96%E5%86%99-ui-component)编写 UI Component

随着应用的发展，你会需要在多个页面分享 UI 元素 (或在一个页面使用多次)，在 dva 里你可以把这部分抽成 component 。

我们来编写一个 `ProductList` component，这样就能在不同的地方显示产品列表了。

新建 `components/ProductList.js` 文件：

```jsx
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


```

## [#](https://dvajs.com/guide/getting-started.html#%E5%AE%9A%E4%B9%89-model)定义 Model

完成 UI 后，现在开始处理数据和逻辑。

dva 通过 model 的概念把一个领域的模型管理起来，包含同步更新 state 的 reducers，处理异步逻辑的 effects，订阅数据源的 subscriptions 。

新建 model `models/products.js` ：

```
export default {
  namespace: 'products',
  state: [],
  reducers: {
    'delete'(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
  },
};

```

这个 model 里：

*   `namespace` 表示在全局 state 上的 key
*   `state` 是初始值，在这里是空数组
*   `reducers` 等同于 redux 里的 reducer，接收 action，同步更新 state

然后别忘记在 `index.js` 里载入他：

```
// 3\. Model
+ app.model(require('./models/products').default);

```

## [#](https://dvajs.com/guide/getting-started.html#connect-%E8%B5%B7%E6%9D%A5)connect 起来

到这里，我们已经单独完成了 model 和 component，那么他们如何串联起来呢?

dva 提供了 connect 方法。如果你熟悉 redux，这个 connect 就是 react-redux 的 connect 。

编辑 `routes/Products.js`，替换为以下内容：

```
import React from 'react';
import { connect } from 'dva';
import ProductList from '../components/ProductList';

const Products = ({ dispatch, products }) => {
  function handleDelete(id) {
    dispatch({
      type: 'products/delete',
      payload: id,
    });
  }
  return (
    <div>
      <h2>List of Products</h2>
      <ProductList onDelete={handleDelete} products={products} />
    </div>
  );
};

// export default Products;
export default connect(({ products }) => ({
  products,
}))(Products);

```

最后，我们还需要一些初始数据让这个应用 run 起来。编辑 `index.js`：

```
- const app = dva();
+ const app = dva({
+   initialState: {
+     products: [
+       { name: 'dva', id: 1 },
+       { name: 'antd', id: 2 },
+     ],
+   },
+ });

```

刷新浏览器，应该能看到以下效果：

![image](http://upload-images.jianshu.io/upload_images/1233356-9efdf5b86c2499b7.gif?imageMogr2/auto-orient/strip)

## [#](https://dvajs.com/guide/getting-started.html#%E6%9E%84%E5%BB%BA%E5%BA%94%E7%94%A8)构建应用

完成开发并且在开发环境验证之后，就需要部署给我们的用户了。先执行下面的命令：

```
$ npm run build

```

几秒后，输出应该如下：

```
> @ build /private/tmp/myapp
> roadhog build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  82.98 KB  dist/index.js
  270 B     dist/index.css

```

`build` 命令会打包所有的资源，包含 JavaScript, CSS, web fonts, images, html 等。然后你可以在 `dist/` 目录下找到这些文件。











# Dva 概念

## [#](https://dvajs.com/guide/concepts.html#%E6%95%B0%E6%8D%AE%E6%B5%81%E5%90%91)数据流向

数据的改变发生通常是通过用户交互行为或者浏览器行为（如路由跳转等）触发的，当此类行为会改变数据的时候可以通过 `dispatch` 发起一个 action，如果是同步行为会直接通过 `Reducers` 改变 `State`，如果是异步行为（副作用）会先触发 `Effects` 然后流向 `Reducers` 最终改变 `State`，所以在 dva 中，数据流向非常清晰简明，并且思路基本跟开源社区保持一致（也是来自于开源社区）。

![image](http://upload-images.jianshu.io/upload_images/1233356-9f8a60ea775239af.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## [#](https://dvajs.com/guide/concepts.html#models)Models

### [#](https://dvajs.com/guide/concepts.html#state)State

`type State = any`

State 表示 Model 的状态数据，通常表现为一个 javascript 对象（当然它可以是任何值）；操作的时候每次都要当作不可变数据（immutable data）来对待，保证每次都是全新对象，没有引用关系，这样才能保证 State 的独立性，便于测试和追踪变化。

在 dva 中你可以通过 dva 的实例属性 `_store` 看到顶部的 state 数据，但是通常你很少会用到:

```
const app = dva();
console.log(app._store); // 顶部的 state 数据

```

### [#](https://dvajs.com/guide/concepts.html#action)Action

`type AsyncAction = any`

Action 是一个普通 javascript 对象，它是改变 State 的唯一途径。无论是从 UI 事件、网络回调，还是 WebSocket 等数据源所获得的数据，最终都会通过 dispatch 函数调用一个 action，从而改变对应的数据。action 必须带有 `type` 属性指明具体的行为，其它字段可以自定义，如果要发起一个 action 需要使用 `dispatch` 函数；需要注意的是 `dispatch` 是在组件 connect Models以后，通过 props 传入的。

```
dispatch({
  type: 'add',
});

```

### [#](https://dvajs.com/guide/concepts.html#dispatch-%E5%87%BD%E6%95%B0)dispatch 函数

`type dispatch = (a: Action) => Action`

dispatching function 是一个用于触发 action 的函数，action 是改变 State 的唯一途径，但是它只描述了一个行为，而 dipatch 可以看作是触发这个行为的方式，而 Reducer 则是描述如何改变数据的。

在 dva 中，connect Model 的组件通过 props 可以访问到 dispatch，可以调用 Model 中的 Reducer 或者 Effects，常见的形式如：

```
dispatch({
  type: 'user/add', // 如果在 model 外调用，需要添加 namespace
  payload: {}, // 需要传递的信息
});

```

### [#](https://dvajs.com/guide/concepts.html#reducer)Reducer

`type Reducer<S, A> = (state: S, action: A) => S`

Reducer（也称为 reducing function）函数接受两个参数：之前已经累积运算的结果和当前要被累积的值，返回的是一个新的累积结果。该函数把一个集合归并成一个单值。

Reducer 的概念来自于是函数式编程，很多语言中都有 reduce API。如在 javascript 中：

```
[{x:1},{y:2},{z:3}].reduce(function(prev, next){
    return Object.assign(prev, next);
})
//return {x:1, y:2, z:3}

```

在 dva 中，reducers 聚合积累的结果是当前 model 的 state 对象。通过 actions 中传入的值，与当前 reducers 中的值进行运算获得新的值（也就是新的 state）。需要注意的是 Reducer 必须是[纯函数](https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch3.md)，所以同样的输入必然得到同样的输出，它们不应该产生任何副作用。并且，每一次的计算都应该使用[immutable data](https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch3.md#reasonable)，这种特性简单理解就是每次操作都是返回一个全新的数据（独立，纯净），所以热重载和时间旅行这些功能才能够使用。

### [#](https://dvajs.com/guide/concepts.html#effect)Effect

Effect 被称为副作用，在我们的应用中，最常见的就是异步操作。它来自于函数编程的概念，之所以叫副作用是因为它使得我们的函数变得不纯，同样的输入不一定获得同样的输出。

dva 为了控制副作用的操作，底层引入了[redux-sagas](http://superraytin.github.io/redux-saga-in-chinese)做异步流程控制，由于采用了[generator的相关概念](http://www.ruanyifeng.com/blog/2015/04/generator.html)，所以将异步转成同步写法，从而将effects转为纯函数。至于为什么我们这么纠结于 **纯函数**，如果你想了解更多可以阅读[Mostly adequate guide to FP](https://github.com/MostlyAdequate/mostly-adequate-guide)，或者它的中文译本[JS函数式编程指南](https://www.gitbook.com/book/llh911001/mostly-adequate-guide-chinese/details)。

### [#](https://dvajs.com/guide/concepts.html#subscription)Subscription

Subscriptions 是一种从 **源** 获取数据的方法，它来自于 elm。

Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。

```
import key from 'keymaster';
...
app.model({
  namespace: 'count',
  subscriptions: {
    keyEvent({dispatch}) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
    },
  }
});

```

## [#](https://dvajs.com/guide/concepts.html#router)Router

这里的路由通常指的是前端路由，由于我们的应用现在通常是单页应用，所以需要前端代码来控制路由逻辑，通过浏览器提供的 [History API](http://mdn.beonex.com/en/DOM/window.history.html) 可以监听浏览器url的变化，从而控制路由相关操作。

dva 实例提供了 router 方法来控制路由，使用的是[react-router](https://github.com/reactjs/react-router)。

```
import { Router, Route } from 'dva/router';
app.router(({history}) =>
  <Router history={history}>
    <Route path="/" component={HomePage} />
  </Router>
);

```

## [#](https://dvajs.com/guide/concepts.html#route-components)Route Components

在[组件设计方法](https://github.com/dvajs/dva-docs/blob/master/v1/zh-cn/tutorial/04-%E7%BB%84%E4%BB%B6%E8%AE%BE%E8%AE%A1%E6%96%B9%E6%B3%95.md)中，我们提到过 Container Components，在 dva 中我们通常将其约束为 Route Components，因为在 dva 中我们通常以页面维度来设计 Container Components。

所以在 dva 中，通常需要 connect Model的组件都是 Route Components，组织在`/routes/`目录下，而`/components/`目录下则是纯组件（Presentational Components）。

## [#](https://dvajs.com/guide/concepts.html#%E5%8F%82%E8%80%83)参考

*   [redux docs](http://redux.js.org/docs/Glossary.html)
*   [redux docs 中文](http://cn.redux.js.org/index.html)
*   [Mostly adequate guide to FP](https://github.com/MostlyAdequate/mostly-adequate-guide)
*   [JS函数式编程指南](https://www.gitbook.com/book/llh911001/mostly-adequate-guide-chinese/details)
*   [choo docs](https://github.com/yoshuawuyts/choo)
*   [elm](http://elm-lang.org/blog/farewell-to-frp)



# [#](https://dvajs.com/guide/examples-and-boilerplates.html#%E4%BE%8B%E5%AD%90%E5%92%8C%E8%84%9A%E6%89%8B%E6%9E%B6)例子和脚手架

## [#](https://dvajs.com/guide/examples-and-boilerplates.html#%E5%AE%98%E6%96%B9)官方

*   [Count](https://stackblitz.com/edit/dva-example-count): 简单计数器
*   [User Dashboard](https://github.com/dvajs/dva/tree/master/examples/user-dashboard): 用户管理
*   [AntDesign Pro](https://github.com/ant-design/ant-design-pro)：([Demo](https://preview.pro.ant.design/))，开箱即用的中台前端/设计解决方案
*   [HackerNews](https://github.com/dvajs/dva-hackernews): ([Demo](https://dvajs.github.io/dva-hackernews/))，HackerNews Clone
*   [antd-admin](https://github.com/zuiidea/antd-admin): ([Demo](http://antd-admin.zuiidea.com/))，基于 antd 和 dva 的后台管理应用
*   [github-stars](https://github.com/sorrycc/github-stars): ([Demo](http://sorrycc.github.io/github-stars/#/?_k=rmj86f))，Github Star 管理应用

## [#](https://dvajs.com/guide/examples-and-boilerplates.html#%E7%A4%BE%E5%8C%BA)社区

*   [Account System](https://github.com/yvanwangl/AccountSystem.git): 小型库存管理系统
*   [react-native-dva-starter](https://github.com/nihgwu/react-native-dva-starter): 集成了 dva 和 react-navigation 典型应用场景的 React Native 实例


# Dva 图解

> 作者：至正
> 原文链接：[https://yuque.com/flying.ni/the-tower/tvzasn](https://yuque.com/flying.ni/the-tower/tvzasn)

## [#](https://dvajs.com/guide/fig-show.html#%E7%A4%BA%E4%BE%8B%E8%83%8C%E6%99%AF)示例背景

最常见的 Web 类示例之一: TodoList = Todo list + Add todo button

## [#](https://dvajs.com/guide/fig-show.html#%E5%9B%BE%E8%A7%A3%E4%B8%80-react-%E8%A1%A8%E7%A4%BA%E6%B3%95)图解一: React 表示法

![图片.png | left | 747x518](http://upload-images.jianshu.io/upload_images/1233356-a7bf4768d5681e19.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

按照 React 官方指导意见, 如果多个 Component 之间要发生交互, 那么状态(即: 数据)就维护在这些 Component 的最小公约父节点上, 也即是 `<App/>`

`<TodoList/> <Todo/>` 以及`<AddTodoBtn/>` 本身不维持任何 state, 完全由父节点`<App/>` 传入 props 以决定其展现, 是一个纯函数的存在形式, 即: `Pure Component`

## [#](https://dvajs.com/guide/fig-show.html#%E5%9B%BE%E8%A7%A3%E4%BA%8C-redux-%E8%A1%A8%E7%A4%BA%E6%B3%95)图解二: Redux 表示法

React 只负责页面渲染, 而不负责页面逻辑, 页面逻辑可以从中单独抽取出来, 变成 store

![图片.png | left | 747x558](http://upload-images.jianshu.io/upload_images/1233356-f1be5464e6fd3599.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

与图一相比, 几个明显的改进点:

1.  状态及页面逻辑从 `<App/>`里面抽取出来, 成为独立的 store, 页面逻辑就是 reducer
2.  `<TodoList/>` 及`<AddTodoBtn/>`都是 Pure Component, 通过 connect 方法可以很方便地给它俩加一层 wrapper 从而建立起与 store 的联系: 可以通过 dispatch 向 store 注入 action, 促使 store 的状态进行变化, 同时又订阅了 store 的状态变化, 一旦状态有变, 被 connect 的组件也随之刷新
3.  使用 dispatch 往 store 发送 action 的这个过程是可以被拦截的, 自然而然地就可以在这里增加各种 Middleware, 实现各种自定义功能, eg: logging

这样一来, 各个部分各司其职, 耦合度更低, 复用度更高, 扩展性更好

## [#](https://dvajs.com/guide/fig-show.html#%E5%9B%BE%E8%A7%A3%E4%B8%89-%E5%8A%A0%E5%85%A5-saga)图解三: 加入 Saga

![图片.png | left | 747x504](http://upload-images.jianshu.io/upload_images/1233356-e79b4feac596d516.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

上面说了, 可以使用 Middleware 拦截 action, 这样一来异步的网络操作也就很方便了, 做成一个 Middleware 就行了, 这里使用 redux-saga 这个类库, 举个栗子:

1.  点击创建 Todo 的按钮, 发起一个 type == addTodo 的 action
2.  saga 拦截这个 action, 发起 http 请求, 如果请求成功, 则继续向 reducer 发一个 type == addTodoSucc 的 action, 提示创建成功, 反之则发送 type == addTodoFail 的 action 即可

## [#](https://dvajs.com/guide/fig-show.html#%E5%9B%BE%E8%A7%A3%E5%9B%9B-dva-%E8%A1%A8%E7%A4%BA%E6%B3%95)图解四: Dva 表示法

![图片.png | left | 747x490](http://upload-images.jianshu.io/upload_images/1233356-f76f99e515f45515.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

有了前面的三步铺垫, Dva 的出现也就水到渠成了, 正如 Dva 官网所言, Dva 是基于 React + Redux + Saga 的最佳实践沉淀, 做了 3 件很重要的事情, 大大提升了编码体验:

1.  把 store 及 saga 统一为一个 model 的概念, 写在一个 js 文件里面
2.  增加了一个 Subscriptions, 用于收集其他来源的 action, eg: 键盘操作
3.  model 写法很简约, 类似于 DSL 或者 RoR, coding 快得飞起✈️

`约定优于配置, 总是好的`😆

```
app.model({
  namespace: 'count',
  state: {
    record: 0,
    current: 0,
  },
  reducers: {
    add(state) {
      const newCurrent = state.current + 1;
      return { ...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent,
      };
    },
    minus(state) {
      return { ...state, current: state.current - 1};
    },
  },
  effects: {
    *add(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'minus' });
    },
  },
  subscriptions: {
    keyboardWatcher({ dispatch }) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
    },
  },
});
```
