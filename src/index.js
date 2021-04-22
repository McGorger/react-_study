import React from './react';
import ReactDOM from './react-dom';

function FunctionComponent(props) {
  return (
    <div className="title" style={{backgroundColor: 'green',color:'red'}}>
      <span>{props.name}</span>
      {props.children}
    </div>
  )
}
ReactDOM.render(<FunctionComponent name="zeg"> 
   <span>world</span>
</FunctionComponent>,document.getElementById('root'))