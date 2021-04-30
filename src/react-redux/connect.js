import React  from 'react'
import ReactReduxContent from "./ReactReduxContent";
import { bindActionCreators } from "../redux";
/**
 * 组件和仓库进行关联
 * @param {*} mapStateToProps 把仓库的状态映射为属性
 * @param {*} mapDispatchToProps 把dispatch 方法映射为属性
 */
function connect(mapStateToProps,mapDispatchToProps) {
    return function(OldComponent) {
        function NewComponent(props) {
            const {store} = React.useContext(ReactReduxContent)
            const state = store.getState() //获取仓库的总状态
            const stateProps = React.useMemo(() => mapStateToProps(state),[state]); //把返回的对象当成组件的属性 
            // const dispatchProps = bindActionCreators(mapDispatchToProps,store.dispatch)
          
            let dispatchProps = React.useMemo(()=>{
                let dispatchProps
                if(typeof mapDispatchToProps === 'object') {
                    dispatchProps = bindActionCreators(mapDispatchToProps,store.dispatch)
                }else if(typeof mapDispatchToProps === 'function') {
                    dispatchProps = mapDispatchToProps(store.dispatch)
                }else {
                    dispatchProps =  {dispatch:store.dispatch }
                }
                return dispatchProps
            },[store.dispatch])
            const [ ,setState] = React.useState({})
            React.useEffect(() => {
                let unsubscribe =  store.subscribe(()=>setState({}))
                //这个函数的返回React会存起来，在下次回调之前执行
                return unsubscribe
            },[store])
            return <OldComponent {...props} {...stateProps} {...dispatchProps}/>
        }
        return  NewComponent
    }
}
// function connect2(mapStateToProps,mapDispatchToProps) {
//     return function(OldComponent) {
//         return class  extends React.Component {
//             static contextType = ReactReduxContent
//             state = {}
//             componentDidMount(){
//                 this.unsubscribe = this.context.store.subscribe(()=>this.setState({}))
//             }
//             componentWillUnmount() {
//                 this.unsubscribe()
//             }
//             render() {
//                 const {store} =  this.context
//                 const state = store.getState()
//                 const stateProps = mapStateToProps(state)
//                 const dispatchProps = bindActionCreators(mapDispatchToProps.store.dispatch)
//                 return <OldComponent {...this.props} {...stateProps} {...dispatchProps}/>
//             }
//         }
//     }
// }
export default connect