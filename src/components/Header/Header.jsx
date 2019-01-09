import React from "react";
import { connect } from 'react-redux';
import Menu from "../Menu/Menu";
import "./styles.sass";

class Header extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false,
      menuPosY: 0
    }
  }

  handleToggleMenu = (e)=>{
    this.setState({menuOpen: !this.state.menuOpen});
  }

  initPos = (el) => {
    console.log('upate ef');
    this.setState({
      ...this.state,
      menuPosY: el.getBoundingClientRect().top
    });
  }
  
  render () {
    let menu = this.state.menuPosY > 0 ? <Menu open={this.state.menuOpen} menuPosY={this.state.menuPosY} closeCallback={this.handleToggleMenu} /> : null;
    return (
      <div className="header">
        { this.props.isLoaded && 
          <div>
            <button className="header__menu--open" onClick={this.handleToggleMenu} ref={this.initPos}>
              <i className="header__burger">menu</i>
              <i className="header__burger__line"></i>
            </button> 
            {menu}
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('JE SUIS UN STATE', state);
  return {
    isLoaded: state.entities.chaptersLoaded
  }
}

export default connect(mapStateToProps)(Header);
