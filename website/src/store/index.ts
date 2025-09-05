import { configureStore } from '@reduxjs/toolkit'
import rateLimitReducer from './rateLimit'

const store = configureStore({
    reducer: {
        rateLimit: rateLimitReducer
    }
})

export default store;