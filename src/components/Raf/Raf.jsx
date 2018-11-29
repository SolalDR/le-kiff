import React from "react";

var callbackStack = [];
var raf = () => {
  callbackStack.forEach(callback => callback[1]());
  if( Raf.running ){
    requestAnimationFrame(raf);
  }
}; 

class Raf extends React.Component {

  static running = false;

  static start(){
    if( Raf.running ) return; 
    Raf.running = true;
    raf();
  }

  static stop(){
    Raf.running = false;
  }

  static order(){
    callbackStack.sort((a, b)=>{
      if( a[0] < b[0] ) return -1;
      if( a[0] > b[0] ) return 1;
      return 0;
    })
  }

  componentDidMount(){
    var callback = this.props.children; 
    if( !Array.isArray(callback) ) {
      callback = [1, callback];
    }
    
    callbackStack.push(callback);
    Raf.order();

    if( callbackStack.length > 0 ) Raf.start();
  }
  
  componentWillUnmount(){
    callbackStack.splice(callbackStack.indexOf(this.props.children), 1);
    if( callbackStack.length === 0 ) Raf.stop();
  }

  render(){
    return null;
  }

}

export default Raf;
