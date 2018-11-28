import React from "react";

export default function higherOrderComponent(ScaleComponent){
    return class extends React.Component {
        constructor(props){
            super(props);
            this.data = {};
        }

        render(){
            return ( <ScaleComponent/> )
        }
    }
}