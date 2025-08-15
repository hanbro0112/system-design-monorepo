import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { rateLimiterListType } from '@/pages/distributed-rate-limiter/type';
import { getRateLimiterList, setRateLimiter, deleteRateLimiter } from '@/api/RateLimiterService'
import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';

export enum Limiter {
    SET_LIST = 'SET_LIST',
}

export enum Tester {

}

type action =
    | { type: Limiter, payload: rateLimiterListType }

const initialState = {
    rateLimiterList: [] as rateLimiterListType,

} 

const reducer = (state = initialState, action: action): typeof initialState => {
    switch (action.type) {
        case Limiter.SET_LIST:
            return {
                ...state,
                rateLimiterList: action.payload || []
            };

        default:
            return state;
    }
}
/**
 * 設定 Redux Thunk 的類型
 * 讓 dispatch 函式能處理 thunk 函式
 */
export type Thunk<ReturnType = void> = ThunkAction<
  ReturnType,
  typeof initialState,
  null,
  action
>;

export const rateLimitStore = createStore(reducer, applyMiddleware(thunk));

export function fetchData() {
    return async (dispatch: any, getState) => {
        const list: rateLimiterList = await getRateLimiterList();
        const new_list = Object.keys(list).map(key => ({
            key,
            ...list[key]
        }));
        new_list.sort((a, b) => - (a.createTime - b.createTime));
        dispatch({
            type: Limiter.SET_LIST,
            payload: new_list
        });
    };
}