import React from 'react';
import ScaleMenu from "./components/ScaleMenu/ScaleMenu";
import * as THREE from "three";
import ThreeScene from "./../../webgl/Scene";
window.THREE = THREE;

class Scene extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      currentScale: "human",
      previousScale: "human",
      targetScale: null,
      microVisibility: 0,
      macroVisibility: 0,
      humanVisibility: 1
    };

    this.sceneElement = React.createRef();
  }

  componentDidMount(){
    this.threeScene = new ThreeScene({
      element: this.sceneElement.current
    });
  }

  /**
   * @param {string} name Name of scale
   */
  selectScale = (name) => {
    this.threeScene.selectScale(name); 
  }

  render(){
    return (
      <>
        <div ref={(this.sceneElement)} className="scene">
            <ScaleMenu scale={this.state.currentScale} onSelectCallback={this.selectScale} />
        </div>
      </>
    );
  }

}


export default Scene;
