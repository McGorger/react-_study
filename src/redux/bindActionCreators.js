function bindActionCreator(actionCreator,dispatch) {
    return function(...args) {
        let action = actionCreator.apply(this,args)
        return dispatch(action)
    }
}
/**
 * 绑定action的创建者
 * @param {*} actionCreators 
 * @param {*} dispatch 
 */
function bindActionCreators(actionCreators,dispatch) {
    const boundActionCreators = {}
    for(const key in actionCreators) {
        const actionCreator  = actionCreators[key] //
        boundActionCreators[key] = bindActionCreator(actionCreator,dispatch)
    }
    return boundActionCreators
}
export default bindActionCreators