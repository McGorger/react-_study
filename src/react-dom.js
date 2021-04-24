import { addEvent } from "./event"

/**
 * @param {*} vdom 要渲染的vdom
 * @param container  要把虚拟dom转换成真实的dom并插入到容器中
 * 
 * */
function render(vdom,container) {
    const dom = createDom(vdom)
    container.appendChild(dom)
    dom.componentDidMount && dom.componentDidMount()
}
/**
 * @param vdom 虚拟dom
 * @param {*} vdom 虚拟dom
 * 
 * 
*/
export function createDom(vdom) {
    //TODO 处理vdom是数字 或者字符串的情况
    if(typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom)
    }
    // 否则 他就是一个虚拟dom对象了，也就说react元素
    let {type,props} = vdom
    let dom
    if(typeof type === 'function') { // 函数组件
        if(type.isReactComponent) {
            return mountClassComponent(vdom)
        }else {
            return mountFunctionComponent(vdom)
        }
     
    }else { //原生组件
        dom  = document.createElement(type)
    }
    // 使用虚拟dom的属性更新刚创建出来的真实DOM属性
    updateProps(dom,props)
    // 在这里处理props.children
    if(typeof props.children === 'string' || typeof props.children === 'number') {
        dom.textContent = props.children;
     // 如果只有一个儿子，并且这个儿子是一个虚拟dom元素
    }else if(typeof props.children === 'object' && props.children.type) {
        // 把儿子变成真实dom插到自己身上
        render(props.children,dom)
    }else if(Array.isArray(props.children)) {
        // 如果儿子是一个数组
        reconcileChildren(props.children,dom)
    }else {
        document.textContent = props.children ? props.children.toString() : ""
    }
    // 把真实dom作为一个dom的属性放在虚拟dom上 ，为以后更新做准备
    // vdom.dom = dom
    return dom
}
/**
 * 把一个类型为自定义函数组件的虚拟dom转换为真实dom并且返回
 * @param {*} vdom 
 */
function mountFunctionComponent(vdom){
    let {type,props} = vdom
    let oldRenderVdom = type(props)
    vdom.oldRenderVdom = oldRenderVdom
    return createDom(oldRenderVdom)

}
function  mountClassComponent(vdom) {
    console.log(vdom)
    //解构类的定义和类的属性对象
    let {type,props} = vdom
    // 创建类的实例
    let classIntance = new type(props)
    vdom.classIntance = classIntance
    if(classIntance.componentWillMount) {
       classIntance.componentWillMount()
    }
    // 调用实例的render方法返回要渲染的虚拟dom对象
    let oldRenderVdom = classIntance.render()
    classIntance.oldRenderVdom = oldRenderVdom
    //把这个将要渲染的虚拟dom添加到类的实例上
    vdom.oldRenderVdom = oldRenderVdom
    //根据虚拟dom对象创建真实dom对象
    let dom = createDom(oldRenderVdom)
    if(classIntance.componentDidMount) {
        dom.componentDidMount = classIntance.componentDidMount.bind(classIntance)
    }
    // 为以后类组件的更新，把真实dom挂载到类的实例上
    // 当根据一个vdom创建出来一个真实dom之后,真实dom挂载到vdom,dom属性上
    // vdom.dom = dom
    return dom
}
/**
 * 使用虚拟dom的属性更新刚创建出来的真实DOM属性
 * @param dom 真实dom
 * @param newProps 新属性对象
 */
function updateProps(dom, newProps) {
    for(let key in newProps) {
        if(key === 'children')  continue  // 单独处理不再这里处理
        if(key === 'style') {
            let styleObj = newProps.style
            for(let attr in styleObj) {
                dom.style[attr] = styleObj[attr]
            }
        }else if(key.startsWith('on')) {
            // 给真实dom加属性
            addEvent(dom, key.toLocaleLowerCase(), newProps[key])
        }else { // 在js中 dom.className= 'title'
            
            dom[key] = newProps[key]
        }
    }
}
/**
 * 
 * @param {*} childrenVdom 儿子们的虚拟dom
 * @param {*} parentDom 父亲的真实dom
 */
function reconcileChildren(childrenVdom,parentDom) {
    for(let i = 0;i< childrenVdom.length;i++) {
        let childVdom = childrenVdom[i]
        render(childVdom,parentDom)
    }
}
/**
 * 对当前组件进行dom-diff
 * @param {*} parentDom 当前组件挂载父真实dom节点
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
export function compareTwoVdom(parentDom,oldVdom,newVdom,nextDom){
    if(!oldVdom && !newVdom) {
        return null
    }else if(oldVdom && !newVdom) {
        let currentDom = findDom(oldVdom) //先找到此虚拟dom对应的真实dom
        if(currentDom)
            parentDom.removeChild(currentDom)
        if(oldVdom.classIntance && oldVdom.classIntance.componentWillUnMount){
            oldVdom.classIntance.componentWillUnMount()
        } 
        return null
    }else if(!oldVdom && newVdom) {
        let newDom = createDom(newVdom)
        if(nextDom)
            parentDom.insertBefore(newDom,nextDom)
        else  
            parentDom.appendChild(newVdom)
        return newVdom
    }else if(oldVdom && newVdom && (oldVdom.type !== newVdom.type)) {
        let oldDom = findDom(oldVdom.dom)
        let newDom = createDom(newVdom)
        parentDom.replaceChild(newDom,oldDom)
        if(oldVdom.classIntance && oldVdom.classIntance.componentWillUnMount){
            oldVdom.classIntance.componentWillUnMount()
        }
    }else {
        updateElement(oldVdom,newVdom)
        return newVdom
    }
}
/**
 * 
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateElement(oldVdom,newVdom) {
    if(typeof oldVdom.type === 'string'){
        let currentDom = newVdom.dom = oldVdom.dom
        updateProps(currentDom,oldVdom.props,newVdom.props) 
    }
}
/**
 * 
 * @param {*} vdom 
 */
function findDom(vdom) {
    let {type} = vdom
    let dom
    if(typeof type === 'function'){
        if(type.isReactComponent) {
            dom = findDom(vdom.oldRenderVdom)
        }else {
            dom = findDom(vdom.oldRenderVdom)
        }
    }else {
        dom = vdom.dom
    }
    return dom
}
const ReactDOM = {render}
export default ReactDOM