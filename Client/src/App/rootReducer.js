import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../Features/authSlice"
import { authApi } from "@/Features/Api/authApi"
import { courseApi } from "@/Features/Api/courseApi"
import { purchaseApi } from "@/Features/Api/purchaseApi"
import { courseProgressApi } from "@/Features/Api/courseProgressApi"

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    [courseProgressApi.reducerPath]: courseProgressApi.reducer,
    auth: authReducer
})

export default rootReducer