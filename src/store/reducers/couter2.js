import * as types from "../action-types";
/**
 * 这是Counter1组件的对应的分reducer
 * 它有自己独立的状态
 * @param {*} oldState 
 * @param {*} action 
 * @returns 
 */
let initialState = {number:10}
const counter2 =  (oldState = initialState , action) => {
    switch (action.type) {
        case types.ADD2:
            return {number: oldState.number + 1};
        case types.MINUS2:
        case types.MINUS:
            return {number: oldState.number - 1};
        default:
            return oldState
    }
} 
export default counter2