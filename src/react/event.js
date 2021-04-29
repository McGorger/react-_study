import { updateQueue } from '../Component';
/**
 * 给真实的DOM添加事件处理函数
 * 为什么要这么做？合成事件？为什么要做事件委托或者事件代理
 * 1.做兼容处理 兼容不同的浏览器 不同的浏览器event是不一样的，处理浏览器的兼容性
 * 2.可以在你写的事件处理函数之前和之后做一些事情，比如修改
 *      之前 updateQueue.isBatchingUpdate = true
 *      之后 updateQueue.batchUpdate()
 * @param {*} dom 
 * @param {*} eventType 
 * @param {*} listener 
 */
export function addEvent(dom,eventType,listener) {
    let store = dom.store || (dom.store = {})
    store[eventType] = listener //store.onclick = handleclick
    if(!document[eventType]) {
        // 事件委托，不管你给哪个dom元素绑定上事件，最后都统一代理到document上去了
        document[eventType] = dispatchEvent //document.onclick = dispatchEvent
    }
}
let syntheticEvent = {}
function dispatchEvent(event) {
     let {target, type} = event // 事件源 button那个元素，类型type =click
     let eventType = `on${type}`
     updateQueue.isBatchingUpdate = true //把队列设置为批量更新模式
     createSyntheticEvent(event)
     while(target) {  // 处理冒泡机制
        let {store} = target
        let listener = store && store[eventType]
        listener && listener.call(target, syntheticEvent)
        target = target.parentNode
     }
     for(let key in syntheticEvent) {
        syntheticEvent[key] = null
    }
     updateQueue.batchUpdate()
}
function createSyntheticEvent(nativeEvent) {
    for(let key in nativeEvent) {
        syntheticEvent[key] = nativeEvent[key]
    }
}