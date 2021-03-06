import React from 'react'
import { useSelector, useDispatch } from "../react-redux";
function Counter1() {
    let dispatch = useDispatch() //store.dispatch
    let state = useSelector(state => state.counter1) // θ·εηΆζ
    return (
        <div>
            <p>{state.number}</p>
            <button onClick={() => dispatch({type:'ADD1'})}>+</button>
            <button onClick={() => dispatch({type:'MINUS1'})}>-</button>
            <button onClick={() => dispatch({type:'MINUS'})}>-</button>
        </div>
    )
}
export default Counter1