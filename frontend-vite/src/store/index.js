import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./modules/user";
import articleReducer from "./modules/article";

const store = configureStore({
    reducer: {
        user: userReducer,
        article: articleReducer
    }
})

export default store