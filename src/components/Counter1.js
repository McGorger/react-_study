import React from 'react'
import { connect } from "../react-redux";
// import actions from '../store/actions/counter1';
// 绑定actionCreator
// const boundActions = bindActionCreators(actions,store.dispatch)
class Counter1 extends React.Component {
    render() {
        return (
            <div>
                <p>{this.props.number}</p>
                <button onClick={this.props.add1}>+</button>
                <button onClick={this.props.minus1}>-</button>
                <button onClick={this.props.minus}>-</button>
            </div>
        )
    }
}
let mapStateToProps = state => state.counter1
const mapDispatchToProps = (dispatch) => {
    return {
        add1() {
            dispatch({type:'ADD1'})
        },
        minus1() {
            dispatch({type:'MINUS1'})
        }, 
        minus() {
            dispatch({type:'MINUS'})
        }
    }
}
export default  connect(mapStateToProps,mapDispatchToProps)(Counter1)