import {createStore,bindActionCreators} from '../redux';
import React from 'react'
const ADD = 'ADD'
const MINUS = 'MINUS'
const reducer =  (oldState = { number: 5 }, action) => {
    switch (action.type) {
        case ADD:
            return {number: oldState.number + 1};
        case MINUS:
            return {number: oldState.number - 1};
        default:
            return oldState
    }
}
let store = createStore(reducer,{ number: 10 })
function add() { 
    return {type:ADD}
}
function minus() {
    return {type:MINUS}
} //创建一个actionCreator的对象
const actions = {add,minus}
// 绑定actionCreator
const boundActions = bindActionCreators(actions,store.dispatch)
class Counter1 extends React.Component {
    state = {number:0}
    componentDidMount() {
        // 进行订阅
        this.unsubscribe = store.subscribe(()=>{
            this.setState({number:store.getState().number})
        })
    }
    componentWillUnmount() {
        this.unsubscribe()
    }
    render() {
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={boundActions.add}>+</button>
                <button onClick={boundActions.minus}>-</button>
            </div>
        )
    }
}
export default Counter1