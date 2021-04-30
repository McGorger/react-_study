
/**
 * 
 * @param {*} reducer  处理器
 * @param {*} preloadedState  仓库的初始状态
 */
function createStore(reducer,preloadedState) {
    //定义状态变量
    let state = preloadedState
    let listeners = []
    function getState() {
        return state
    }
    function subscribe(listener) {
        listeners.push(listener) 
        return () => {
            let index = listeners.indexOf(listener)
            listeners.splice(index,1)
        }
    }
    /**
     * 派发action ,会返回一个取消订阅的函数
     * @param {*} action 动作 
     */
    function dispatch(action) {
        // 接收reducer，计算新的state
        state = reducer(state,action)
        listeners.forEach(l => l()) // 通知订阅函数执行
        return action
    }
    //
    dispatch({type:'@@REDUX/INIT'})
    const store = {
        getState,
        subscribe,
        dispatch
    }
    return store
}
export default createStore