import Component from './Component' 
/**
 * 
 * @param {*} type 元素的类型
 * @param {*} config 配置的对象
 * @param {*} children 儿子或者儿子们
 * @returns 
 */
function createElement(type,config, children) {
    let props = {...config}
    if(arguments.length > 3) {
        children = Array.prototype.slice.call(arguments,2)
    }
    props.children = children
    return {
        type,
        props
    }
}
const React = { createElement, Component}
export default React