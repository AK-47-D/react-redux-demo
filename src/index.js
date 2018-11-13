import dva from 'dva';
import './index.css';

// 1. Initialize
const app = dva({
  initialState: {
    products: [
      {name: 'Java', id: 1},
      {name: 'Kotlin', id: 2},
      {name: 'Scala', id: 3},
      {name: 'Groovy', id: 4},
      {name: 'Clojure', id: 5},
    ],
  },
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/example').default)
app.model(require('./models/products').default)


// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
