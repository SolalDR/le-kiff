import React from "react";
import Scene from "../../components/Scene/Scene";
import API from "./../../services/api";
import Timeline from "./../../components/Timeline/Timeline";

class Chapter extends React.Component {
    
    constructor(){
        API.call("http://le-kiff.bastiencornier.com/wp-json/v1/chapters")
        super();
        this.state = {};
    }

    render(){
        return (
            <div className="chapter chapter-1">
                <Timeline />
                <Scene />
            </div>
        );
    }

}

export default Chapter;
