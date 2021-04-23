import React from './react';
import ReactDOM from './react-dom';
/**
 * 类组件和类组件的更新
 * 可以在构造函数里，并且只能在构造函数中给this.state 赋值
 * 定义状态对象
 * 属性对象 、 父组件给的不能改变，是只读的
 */
class Counter extends React.Component {
   static defaultProps = {
      name: '计数器'
   }
   constructor(props) {
      super(props)
      this.state = {number: 0}
      console.log('Conuter 1.constructor 初始化组件')
   }
   componentWillMount() {
    console.log('Conuter 2.componentWillMount 组件将要挂载')
   }
   componentDidMount() {
    console.log('Conuter 4.componentDidMount 组件挂载完成')
   }
   shouldComponentUpdate(nextProps,nextState) {
     console.log('Conuter 5.shouldComponent 决定组件是否需要更新 ')
     return nextState.number % 3 === 0
   }
   componentWillUpdate() {
    console.log('Conuter 6.componentDidUpdate 组件将要更新')
   }
   componentDidUpdate() {
    console.log('Conuter 7.componentDidUpdate 组件更新完成')
   }
   handleClick = (event)=>{
    this.setState({number:this.state.number+1})
   }
   render() {
     console.log('Conunter 3.render 挂载')
     return (
       <div>
         <p>{this.state.number}</p>
         {this.state.number === 4 ? null : <ChildCounter count={this.state.number}/>}
         <button onClick={this.handleClick}>+</button>
       </div>
     )
   }
}
class ChildCounter extends React.Component {
  componentDidMount() {
    console.log('ChildCounter 3.componentDidMount 组件挂载完成')
   }
   componentWillUpdate() {
    console.log('ChildCounter 1.componentDidUpdate 组件将要更新')
   }
   componentWillReceiveProp(newProps){
    console.log('ChildCounter 4.componentWillReceivePrope 组件将要接受到新的属性')
   }
  render() {
    console.log('ChildCounter 2.render')
    return (
      <div>{this.props.count}</div>
    )
  }
}
ReactDOM.render(<Counter/>,document.getElementById('root'))