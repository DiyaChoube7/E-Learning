import {configureStore} from "@reduxjs/toolkit"
import authReducer from "../Features/authSlice"
import rootReducer from "./rootReducer"
import { authApi } from "@/Features/Api/authApi"
import { courseApi } from "@/Features/Api/courseApi"
import { purchaseApi } from "@/Features/Api/purchaseApi"
import { courseProgressApi } from "@/Features/Api/courseProgressApi"

export const appStore = configureStore({
    reducer: rootReducer,
    middleware: (defaultMiddleware) => defaultMiddleware().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware)
})

const initializeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, {forceRefetch: true}))
}

initializeApp()