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
      menuPosY: 0
    }
  }

  handleToggleMenu = (e)=>{
    this.setState({menuOpen: !this.state.menuOpen});
    SoundManager.play('toggle_default_sound');
  }

  initPos = (el) => {
    this.setState({
      ...this.state,
      menuPosY: el.getBoundingClientRect().top
    });
  }
  
  render () {
    let menu = this.state.menuPosY > 0 ? <Menu open={this.state.menuOpen} menuPosY={this.state.menuPosY} closeCallback={this.handleToggleMenu} /> : null;
    const headerClass = this.state.menuOpen ? "header is-active" : "header";
    return (
      <div className={headerClass}>
        { this.props.isLoaded && 
          <div>
            <div className="header__top">
              <div className="header__links">
                <Link className="header__link" to={'/'}>
                  <span className="heading-8">Credits</span>
                </Link>
                <Link className="header__link" to={'/'}>
                  <span className="heading-8">About</span>
                </Link>
              </div>

              <button className="header__menu" onClick={this.handleToggleMenu} ref={this.initPos}>
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
