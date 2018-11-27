import React from "react";
import Scene from "../scene/Scene";

class Chapter extends React.Component {
    
    constructor(){
        super();
        this.state = {};
    }

    render(){
        return (
            <div className="chapter chapter-1">
                <Scene/>
            </div>
        );
    }

}

export default Chapter;