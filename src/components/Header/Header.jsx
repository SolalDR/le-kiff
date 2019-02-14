import React from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import Menu from "../Menu/Menu";
import "./styles.sass";
import SoundManager from "~/services/soundManager/SoundManager";


class Header extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false,
      menuPosY: 0,
      menuHovered: false
    }
  }

  onMouseOver = () => {
    this.setState({
      ...this.state,
      menuHovered: true
    })
  }

  onMouseOut = () => {
    this.setState({
      ...this.state,
      menuHovered: false
    })
  }

  handleToggleMenu = (e)=>{
    this.setState({menuOpen: !this.state.menuOpen});
    SoundManager.play('ui_sounds', 'toggle_default'); 
  }

  initPos = (el) => {
    this.setState({
      ...this.state,
      menuPosY: el.getBoundingClientRect().top
    });
  }
  
  render () {
  let menu = this.state.menuPosY > 0 ? <Menu open={this.state.menuOpen} menuPosY={this.state.menuPosY} closeCallback={this.handleToggleMenu} hover={!this.state.menuOpen ? this.state.menuHovered : false} /> : null;
    const headerClass = this.state.menuOpen ? "header is-active" : "header";
    return (
      <div className={headerClass}>
        { this.props.isLoaded && 
          <div>
            <div className="header__top">
              <div className="header__links">
                <Link className="header__link" to={'/credits'}>
                  <span className="heading-8">Credits</span>
                </Link>
                <Link className="header__link" to={'/about'}>
                  <span className="heading-8">About</span>
                </Link>
              </div>

            <button className="header__menu" onClick={this.handleToggleMenu} ref={this.initPos} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
                <span className="header__menu--close"></span>
              </button> 
            </div>
            {menu}
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoaded: state.entities.chaptersLoaded
  }
}

export default connect(mapStateToProps)(Header);
