import { addEvent } from "./event"

/**
 * @param {*} vdom 要渲染的vdom
 * @param container  要把虚拟dom转换成真实的dom并插入到容器中
 * 
 * */
function render(vdom,container) {
    const dom = createDom(vdom)
    container.appendChild(dom)
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
    let {type:FunctionComponent,props} = vdom
    let renderVdom = FunctionComponent(props)
    return createDom(renderVdom)

}
function  mountClassComponent(vdom) {
    //解构类的定义和类的属性对象
    let {type,props} = vdom
    // 创建类的实例
    let classIntance = new type(props)
    // 调用实例的render方法返回要渲染的虚拟dom对象
    let renderVdom = classIntance.render()
    //根据虚拟dom对象创建真实dom对象
    let dom = createDom(renderVdom)
    // 为以后类组件的更新，把真实dom挂载到类的实例上
    classIntance.dom = dom
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
const ReactDOM = {render}
export default ReactDOM