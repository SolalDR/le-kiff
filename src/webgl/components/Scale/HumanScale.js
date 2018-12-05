import React from 'react';
import hocScale from "./withScale";
import Raf from "./../../Raf/Raf"
import AssetManager from "./../../../services/loaders/AssetsManager";

class HumanScale extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  initScene(e){
    this.props.group.add(e.step_1_human_leaf.result.scene);
  }

  componentWillMount(){
    if( AssetManager.loader.isLoaded("chapter-1") ) {
      this.initScene(AssetManager.loader.getFiles("chapter-1"));
    }
    AssetManager.loader.on("load:chapter-1", (event)=> this.initScene( event ))
  }

  componentWillReceiveProps(){
    if( (this.props.currentScale === "human" && this.props.previousScale === "micro") ||
         this.props.currentScale === "micro"  ){
      this.props.group.scale.x = 1 + (2 - this.props.visibility*2);
      this.props.group.scale.y = 1 + (2 - this.props.visibility*2);
      this.props.group.scale.z = 1 + (2 - this.props.visibility*2);
      return; 
    }
   
    if( this.props.currentScale === "human" || 
        this.props.currentScale === "macro" ){
      this.props.group.scale.x = this.props.visibility;
      this.props.group.scale.y = this.props.visibility;
      this.props.group.scale.z = this.props.visibility;
      return;
    }
  }

  render(){ return (
    <Raf>{
        ()=>{
            
        }
    }</Raf>
    ); 
  }

  loop(){
      
  }
}

export default hocScale(HumanScale);
