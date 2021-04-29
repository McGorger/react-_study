import { compareTwoVdom } from "./react-dom";
export let updateQueue = {
    isBatchingUpdate: false, //当前是否处于批量更新模式
    updaters: new Set(),
    batchUpdate() { //批量更新
        for(let updater of this.updaters){
            updater.updateComponent()
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
        this.emitUpdate()
    }
    // 一个组件不管属性变还是状态变，都会更新
    emitUpdate(newProps) {
        if(updateQueue.isBatchingUpdate) { //如果是批量更新，先缓存updater
            updateQueue.updaters.add(this) // 本次setState 调用结束 
        }else {
            this.updateComponent() // 直接更新组件
        }
    }
    updateComponent() {
        let {classIntance,pendingStates} = this
        // 如果有等待更新的状态对象
        if(pendingStates.length > 0) {
            shouldUpdate(classIntance,this.getState())
            // classIntance.state = this.getState() //先计算新状态
            // classIntance.forceUpdate()
            // callbacks.forEach(cb => cb())
            // callbacks.length =0
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
/**
 * 判断组件是否需要更新
 * @param {*} classIntance  组件实例 
 * @param {*} nextState    新的状态
 */
function shouldUpdate(classIntance, nextState) {
    classIntance.state = nextState // 不管组件要不要刷新，其实组件的state属性已将改变了
    // 如果有这个方法并且返回值为false 则不需要继续向下更新了，否则就更新
    if(classIntance.shouldComponentUpdate && !classIntance.shouldComponentUpdate(classIntance.props,classIntance.state)) return
    classIntance.forceUpdate()

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
        if(this.componentWillUpdate) {
            this.componentWillUpdate()
        }
        let newRenderVdom = this.render() //重新调用render方法,得到新的虚拟dom
        // updateClassComponent(this,newVdom)
        // 深度比较两个虚拟dom
        let oldRenderVdom = this.oldRenderVdom
        let oldDom =  oldRenderVdom.dom
        let currentRenderVdom = compareTwoVdom(oldDom.parentNode,oldRenderVdom,newRenderVdom)
        this.oldRenderVdom = currentRenderVdom
        if(this.componentDidUpdate) {
            this.componentDidUpdate()
        }
    }
}

// function  updateClassComponent(classIntance,newVdom) {
//     let oldDom = classIntance.dom // 取出这个类组件上次渲染出来的真实dom
//     let newDom = createDom(newVdom)
//     oldDom.parentNode.replaceChild(newDom,oldDom)
//     classIntance.dom = newDom
// }
export default Component