import { configureStore } from '@reduxjs/toolkit'
import rateLimitReducer from './rateLimit'
import consistentHashingReducer from './consistentHashing'

const store = configureStore({
    reducer: {
        rateLimit: rateLimitReducer,
        consistentHashing: consistentHashingReducer
    }
})

export default store;