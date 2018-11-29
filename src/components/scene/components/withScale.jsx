import React from "react";

export default function higherOrderComponent(ScaleComponent){
    return class extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                visibilityIntensity: props.visibility
            };
            this.scaleRef = React.createRef();
        }

        loop(){
            if( this.state.visibility !== this.props.visibility ){
                let next = this.state.visibility + (this.props.visibility - this.state.visibility)*0.1;
                if( Math.abs(next) < 0.01 ) next = 0;
                this.setState({
                    visibilityIntensity: next
                });
            }

            if( this.state.visibility > 0){
                this.scaleRef.current.loop();
            }
        }

        render(){
            return ( 
                <ScaleComponent 
                ref={this.scaleRef} 
                visibilityIntensity={this.state.visibilityIntensity} 
                scene={this.props.scene}/> 
            )
        }
    }
}