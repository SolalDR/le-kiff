import React from "react";
import "./styles.sass";
import Info from "./Info";
import InfoManager from "~/webgl/components/Info/InfoManager";
import Bus from "~/helpers/Bus";

class InfoList extends React.Component {

  constructor(props){
    super(props);
    this.infos = [];
    this.state = {
      visibleId: null
    }

    InfoManager.on("infos:update", this.onInfosUpdatePosition.bind(this));
  }

  /**
   * Callback InfoManager info-update
   * @param {Map} infosPosition A Map with infos id as keys
   */
  onInfosUpdatePosition(infosPosition){
    this.infos.forEach((info)=>{
      if( !info.ref.current ) return;
      
      // If position has been modified, update directly state
      var screenPosition = infosPosition.get(info.props.info.id);
      if( screenPosition ){
        info.ref.current.setState({ screenPosition })
      }
    })
  }

  render(){
    this.infos = this.props.infos.map(info => {
      Bus.verbose("infos-react:update")
      return <Info ref={React.createRef()} key={info.id} info={info}/>
    });

    return (
      <div className="info-list"> 
        {this.infos}        
      </div>
    )
  }
}

export default InfoList;
