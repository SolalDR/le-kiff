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
      visibleId: null,
      visible: false
    }
    
    Bus.on("abilities:update", (abilities) => {
      if( abilities.selectInfo === true ){
        setTimeout(()=>{
          this.setState({
            visible: abilities.selectInfo
          })
        }, 1000)
      } else {
        this.setState({
          visible: abilities.selectInfo
        })
      }
    })
    InfoManager.on("infos:update", this.onInfosUpdatePosition.bind(this));
  }

  /**
   * Callback InfoManager info-update
   * @param {Map} infosPosition A Map with infos id as keys
   */
  onInfosUpdatePosition(infosPosition){
    this.infos.forEach((info)=>{
      if( !info.ref.current ) return;
      var screenPosition = infosPosition.get(info.props.info.id);
      if( screenPosition && info.ref.current !== null ){
        info.ref.current.myRef.style = `transform: scale(1) translate3d(${screenPosition.x}px, ${screenPosition.y}px, 0);`;
      }
    })
  }

  componentWillReceiveProps(nextProps){
    if( nextProps.infos !== this.props.infos ){
      this.setState({
        visibleId: null
      })
    }
  }

  display(){
    this.setState({
      visible: true
    })
  }

  hide(){
    this.setState({
      visible: false
    })
  }

  handleClick = (event) => {
    this.setState({
      visibleId: this.state.visibleId === event.id ? null : event.id
    })
  }

  render(){
    this.infos = this.props.infos.map(info => {
      Bus.verbose("infos-react:update")
      return <Info ref={React.createRef()} key={info.id} info={info} opened={this.state.visibleId === info.id} onClick={this.handleClick} visible={this.state.visible}/>
    });

    return (
      <div className="info-list"> 
        {this.infos}        
      </div>
    )
  }
}

export default InfoList;
