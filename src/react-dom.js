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
function createDom(vdom) {
    //TODO 处理vdom是数字 或者字符串的情况
    if(typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom)
    }
    // 否则 他就是一个虚拟dom对象了，也就说react元素
    let {type,props} = vdom
    let dom  = document.createElement(type)
    // 使用虚拟dom的属性更新刚创建出来的真实DOM属性
    updateProps(dom,props)
    // 在这里处理props.childern
    return dom
}
/**
 * 使用虚拟dom的属性更新刚创建出来的真实DOM属性
 * @param dom 真实dom
 * @param newProps 新属性对象
 */
function updateProps(dom,newProps) {
    for(let key in newProps) {
        if(key === 'children')  continue  // 单独处理不再这里处理
        if(key === 'style') {
            let styleObj = newProps.style
            for(let attr in styleObj) {
                dom.style[attr] = styleObj[attr]
            }
        }else { // 在js中 dom.className= 'title'
            dom[key] = newProps[key]
        }
    }
}
const ReactDOM = {render}
export default ReactDOM