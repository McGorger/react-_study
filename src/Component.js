import { createDom } from "./react-dom";
class Component{
    static isReactComponent = true
    constructor(props) {
        this.props = props
        this.state = {}
    }
    setState(partialState) {
        let state = this.state
        this.state = {...state,...partialState}
        let newVdom = this.render()
        updateClassComponent(this,newVdom)
    }
    render() {
        throw new Error('此方法为抽象方法，需要子类继承')
    }
}
function  updateClassComponent(classIntance,newVdom) {
    let oldDom = classIntance.dom // 取出这个类组件上次渲染出来的真实dom
    let newDom = createDom(newVdom)
    oldDom.parentNode.replaceChild(newDom,oldDom)
    classIntance.dom = newDom
}
export default Component