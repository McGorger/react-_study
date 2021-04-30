import React from 'react'
import ReactReduxContent from "./ReactReduxContent";
function Provider(props) {
    let value = {store:props.store}
    return (
        <ReactReduxContent.Provider value={value}>
            {props.children}
        </ReactReduxContent.Provider>
    )
}
export default Provider