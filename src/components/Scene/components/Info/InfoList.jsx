import React from "react";
import "./styles.sass";
import InfoManager from "~/webgl/manager/Info";
import Info from "./Info";
import Bus from "~/helpers/Bus";
import AbilitiesManager from "../../../../services/AbilitiesManager";

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
    var callback = _ => {
      this.infos.forEach((info)=>{
        if( !info.ref.current ) return;
        
        // If position has been modified, update directly state
        var screenPosition = infosPosition.get(info.props.info.id);
        if( screenPosition ){
          info.ref.current.setState({ screenPosition })
        }
      })
    }
 
    if( !AbilitiesManager.can("selectInfo") ) {
      Bus.once("abilities-selectInfo:update", (value)=>{
        if( value === true ){
          callback();
        }
      })
    } else {
      callback();
    }
    
  }

  handleClick = (event) => {
    this.setState({
      visibleId: this.state.visibleId === event.id ? null : event.id
    })
  }

  render(){
    this.infos = this.props.infos.map(info => {
      Bus.verbose("infos-react:update")
      return <Info ref={React.createRef()} key={info.id} info={info} opened={this.state.visibleId === info.id} onClick={this.handleClick}/>
    });

    return (
      <div className="info-list"> 
        {this.infos}        
      </div>
    )
  }
}

export default InfoList;
