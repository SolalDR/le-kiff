import React from "react";
import "./styles.sass";

class ScaleMenu extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            scale: props.scale
        };
    }

    /**
     * Callback to parent
     */
    handleClick = this.props.onSelectCallback;

    /**
     * @param {string} scale The scale represented
     */
    computeClassName(scale){
        return scale === this.props.scale ? 
            "scale-menu__link scale-menu__link--active" : 
            "scale-menu__link";
    }

    render(){
        return (
            <div className="scale-menu">
                <button 
                    className={this.computeClassName("micro")}
                    onClick={this.handleClick.bind(this, "micro")} >Molécules</button>
                <button 
                    className={this.computeClassName("human")}
                    onClick={this.handleClick.bind(this, "human")} >Humain</button>
                <button 
                    className={this.computeClassName("macro")}
                    onClick={this.handleClick.bind(this, "macro")} >Mondiale</button>
            </div>
        )
    }

}

export default ScaleMenu;