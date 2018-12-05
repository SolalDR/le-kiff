import React from 'react';
import ScaleMenu from "./components/ScaleMenu/ScaleMenu";
import ThreeScene from "./../../webgl/Scene";

class Scene extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      currentScale: "human",
      previousScale: "human",
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
    this.setState({
      previousScale: this.state.currentScale,
      currentScale: name
    })
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
