import { createStore as reduxCreateStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger/src";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { ProductsReducer } from "../products/reducers";
import { UsersReducer } from "../users/reducers";

const createStore = (history) => {
    const logger = createLogger({
        collapsed: true,
        diff: true,
    });

    return reduxCreateStore(
        combineReducers({
            products: ProductsReducer,
            router: connectRouter(history),
            users: UsersReducer,
        }),
        applyMiddleware(logger, routerMiddleware(history), thunk)
    );
};

export default createStore;
