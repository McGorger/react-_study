/**
 *  
 * @param {*} reducers 
 */
function combineReducers(reducers) {
    //
    let rootReducer = (state = {},action) => {
        let nextState = {}
        for(let key in reducers) {
            const reducer = reducers[key]
            const prevStateForKey = state[key]
            const nextStateForKey = reducer(prevStateForKey,action)
            nextState[key] = nextStateForKey
        }
        return nextState
    }
    return rootReducer
}
export default combineReducers