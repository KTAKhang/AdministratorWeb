// store/index.js
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import authReducer from "./reducers/authReducer";
import categoryReducer from "./reducers/categoryReducer";
import orderReducer from "./reducers/orderReducer";
import productReducer from "./reducers/productReducer";
import reviewReducer from "./reducers/reviewReducer";
import userReducer from "./reducers/userReducer";
import profileReducer from "./reducers/profileReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import rootSaga from "./sagas/rootSaga";
const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  order: orderReducer,
  profile: profileReducer,
  product: productReducer,
  review: reviewReducer,
  user: userReducer,
  dashboard: dashboardReducer,
});

const sagaMiddleware = createSagaMiddleware();

// Enable Redux DevTools in development if available
const composeEnhancers =
  (process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  ((f) => f);

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export default store;