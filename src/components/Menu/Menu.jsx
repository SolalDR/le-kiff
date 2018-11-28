import React from "react";
import { Link } from "react-router-dom";
import "./styles.sass";

class Menu extends React.PureComponent {

    handleCloseClick = (e) => {
        this.props.closeCallback(e);
    }

    render(){

        var className = this.props.open ? "menu menu--visible" : "menu menu--hidden";

        return (
            <div className={className}>
                <button className="menu__close" onClick={this.handleCloseClick}>
                    <i className="material-icons">close</i>
                </button>
                <div className="menu__container">
                    <Link onClick={this.handleCloseClick} to="/chapter-1" className="menu__item"></Link>
                    <Link onClick={this.handleCloseClick} to="/chapter-1" className="menu__item"></Link>
                    <Link onClick={this.handleCloseClick} to="/chapter-1" className="menu__item"></Link>
                    <Link onClick={this.handleCloseClick} to="/chapter-1" className="menu__item"></Link>
                </div>
            </div>
        )
    }

}

export default Menu;