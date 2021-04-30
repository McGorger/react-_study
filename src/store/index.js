import {createStore} from '../redux';
import rootReducer from "./reducers";
// 以后在创建仓库时不需要创建状态了

/**
 * 实现一个真正的日志中间间
 */
function applyMiddleware(...middleware) {
     return function(createStore) {
        return function (reducer) {
            let store = createStore(reducer)
            let dispatch
            let middlewareAPI = {
                getState: store.getState,
                dispatch: (action) => dispatch(action)
            }
            let chain = middleware.map(middleware => middleware(middlewareAPI))
            dispatch = compose(...chain)(store.dispatch)
            console.log(dispatch)
            return {
                ...store,
                dispatch
            }
        }
     }
}
function compose(...fns) {
    return function(args) {
        return fns.reduceRight((args,fn)=>{
            return fn(args)
        },args)
    }
}
// 这是日志中间间的真正实现
function logger({getState,dispatch}) {
        return function loggerNext(next) {
            return function loggerDispatch(action) {
                next(action);
            }
        }
}
//只要是中间件，格式定死
function thunk(store){
    return function thunkNext(next) {
        return function thunkDispatch(action) {
            if(typeof action === 'function') { //如果派发的是函数就是让他执行
               return action(store.dispatch,store.getState)
            }//如果不是函数自己不处理，直接调用下一个store.dispatch
            return next(action)
        }
    }
}
function promise(store){
    return function promiseNext(next) {
        return function promiseDispatch(action) {
            if(typeof action.then === 'function') { //如果派发的是函数就是让他执行
               return action.then(newAction => store.dispatch(newAction))
            }//如果不是函数自己不处理，直接调用下一个store.dispatch
            return next(action)
        }
    }
}
//在真正的项目中，中间件每个逻辑都是单独编写的
let store = applyMiddleware(promise,thunk,logger)(createStore)(rootReducer)

export default store