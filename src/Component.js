import { createDom } from "./react-dom";
export let updateQueue = {
    isBatchingUpdate: false, //当前是否处于批量更新模式
    updaters: new Set(),
    batchUpdate() { //批量更新
        for(let updater of this.updaters){
            updater.updateClassComponent()
        }
        this.isBatchingUpdate = false
    }
}
class Updater {
    constructor(classIntance) {
        this.classIntance = classIntance //类组件的实例
        this.pendingStates = [] //等待生效的状态，可以能是一个函数，也可能是一个对象
        this.callbacks = []
    }
    addState(partialState, callback) {
        this.pendingStates.push(partialState) //等待更新的或者等待生效的状态
        if(typeof this.callbacks === 'function') {
            this.callbacks.push(callback) //状态更新的回调
        }
        if(updateQueue.isBatchingUpdate) { //如果是批量更新，先缓存updater
            updateQueue.updaters.add(this) // 本次setState 调用结束 
        }else {
            this.updateClassComponent() // 直接更新组件
        }
    }
    updateClassComponent() {
        let {classIntance,pendingStates,callbacks} = this
        // 如果有等待更新的状态对象
        if(pendingStates.length > 0) {
            classIntance.state = this.getState() //先计算新状态
            classIntance.forceUpdate()
            callbacks.forEach(cb => cb())
            callbacks.length =0
        }
    }
    getState() { //如何计算最新的状态
        let {classIntance,pendingStates} = this
        let {state} = classIntance
        pendingStates.forEach((nextState) => {
            //如果pendingstate是一个函数的话，传入老状态，返回新的状态再进行合并
            if(typeof nextState === 'function') {
                nextState = nextState(state)
            }
            state = {...state,...nextState} // 状态合并
        })
        pendingStates.length = 0 // 清空数组
        return state
    }
}
class Component{
    static isReactComponent = true
    constructor(props) {
        this.props = props
        this.state = {}
        this.updater = new Updater(this)
    }
    setState(partialState,cb) {
        // let state = this.state
        // this.state = {...state,...partialState}
        // let newVdom = this.render()
        // updateClassComponent(this,newVdom)
        this.updater.addState(partialState)
    }
    forceUpdate() {
        let newVdom = this.render()
        updateClassComponent(this,newVdom)
    }
}
function  updateClassComponent(classIntance,newVdom) {
    let oldDom = classIntance.dom // 取出这个类组件上次渲染出来的真实dom
    let newDom = createDom(newVdom)
    oldDom.parentNode.replaceChild(newDom,oldDom)
    classIntance.dom = newDom
}
export default Component