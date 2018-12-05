import React from 'react';
import hocScale from "./withScale";
import Molecule from "./../../../scripts/components/chemistry/Molecule";
import * as THREE from "three";
import Raf from "./../../Raf/Raf";
import AssetManager from "./../../../services/loaders/AssetsManager";

class MicroScale extends React.Component {

  constructor(props, ref){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    if( AssetManager.loader.isLoaded("micro") ) {
      this.initScene(AssetManager.loader.getFiles("micro"));
    }
    AssetManager.loader.on("load:micro", (event)=> this.initScene( event ));
  }
  
  initScene(e){
    this.molecules = {
      cocaine: new Molecule({name: "cocaine", renderer: this.props.renderer, pdb: e.cocaine.result}),
      kerosene: new Molecule({name: "kerosene", renderer: this.props.renderer, pdb: e.kerosene.result}),
    }

    this.props.group.add(this.molecules.cocaine.object3D);
    this.props.group.add(this.molecules.kerosene.object3D);
  }

  componentWillReceiveProps(e){
    this.props.group.scale.x = this.props.visibility;
    this.props.group.scale.y = this.props.visibility;
    this.props.group.scale.z = this.props.visibility;
  }
  
  render(){ 
  return ( 
    <Raf>{
    () => {
      return null;
    }
    }</Raf>
  )
  }
}

export default hocScale(MicroScale);
  