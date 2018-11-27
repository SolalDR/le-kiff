import React from "react";
import Scene from "./scene/Scene";

class Outro extends React.Component {
    
    constructor(){
        super();
        this.state = {};
    }

    render(){
        return (
            <div className="outro">
                <Scene/>
            </div>
        );
    }

}

export default Outro;