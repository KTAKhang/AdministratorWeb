// store/index.js
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import authReducer from "./reducers/authReducer";
import rootSaga from "./sagas/rootSaga";
import categoryReducer from "./reducers/categoryReducer";
import orderReducer from "./reducers/orderReducer";
import profileReducer from "./reducers/profileReducer"; // Assuming you have a profileReducer
const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  order: orderReducer,
  profile: profileReducer,
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