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
          <h1 className="heading-3">Chapitre {chapter.rank}</h1>
          <p class="teasing-3">{chapter.content}</p>
        </Link>
      )
    })
  }

  render() {
    var className = this.props.open ? "menu menu--visible" : "menu menu--hidden";
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
