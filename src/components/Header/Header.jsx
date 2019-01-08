import React from "react";
import Menu from "../Menu/Menu";
import "./styles.sass";

class Header extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false 
    }
  }

  handleToggleMenu = (e)=>{
    this.setState({menuOpen: !this.state.menuOpen});
  }
  
  render () {
    return (
      <div className="header">
        <button className="header__menu-open" onClick={this.handleToggleMenu}>
          <i className="header__burger">menu</i>
          <i className="header__burger__line"></i>
        </button>
        <Menu open={this.state.menuOpen} closeCallback={this.handleToggleMenu} />
      </div>
    );
  }
}

export default Header;
