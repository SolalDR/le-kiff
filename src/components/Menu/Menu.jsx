import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./styles.sass";
import { getChapters } from "../../services/stores/reducers/selectors";

class Menu extends React.PureComponent {

  handleCloseClick = (e) => {
    this.props.closeCallback(e);
  }

  renderMenuItems() {
    return this.props.chapters.map((chapter, index) => {
      return (
        <Link onClick={this.handleCloseClick} key={index} to={`/chapter-${chapter.rank}`} className="menu__item">
          <h1 className="menu__item__title heading-3">{chapter.rank}.{chapter.title}</h1>
          <div className="menu__item__time">
            <svg width="10" height="12" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.6 12H0L9.6 0H0z" stroke="#FFF" fill="none" fillRule="evenodd"/>
            </svg> <span className="heading-6"> - 5 minutes</span>
          </div>
          <p className="menu__item__content teasing-3">{chapter.content}</p>
        </Link>
      )
    })
  }

  render() {
    var className = this.props.open ? "menu is-active" : "menu";
    return (
      <div className={className}>
        {/* {this.renderMenuItems} */}
          <button className="menu__close" onClick={this.handleCloseClick}>
            <i className="material-icons">close</i>
          </button>
          <div className="menu__container">
            {this.renderMenuItems()}
          </div>
      </div>
    );
  }
  
}


const mapStateToProps = (state) => {
  console.log(state.entities.chapters);
  return {
    chapters: getChapters(state)
  }
}


export default connect(mapStateToProps)(Menu);
