import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./styles.sass";
import { getChapters } from "../../services/stores/reducers/selectors";
import PropTypes from 'prop-types';

class Menu extends React.PureComponent {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    menuPosY: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.sizes = [];
    this.burgerPos = [];
    this.gap = 14;
    this.menu = null;
  }

  componentDidMount() {
   
  }
 
  initPositions(itemList) {
    [].forEach.call(itemList, (item, index) => {
      var rect = item.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      this.sizes[index] = {
        height: item.clientHeight,
        posY: item.getBoundingClientRect().top,
        pos: item.offsetTop
      };
    
      this.burgerPos[index] = (-(this.sizes[index].posY - this.props.menuPosY)) + this.gap * index;
    });
  }

  handleCloseClick = (e) => {
    this.props.closeCallback(e);
  }
  
  componentDidUpdate() {
    console.log('did update');
    const items = this.menu.querySelectorAll('.menu__item')
    this.initPositions(items);
  }

  renderMenuItems() {
    return this.props.chapters.map((chapter, index) => {
      // console.log('props', this.props.open, this.burgerPos[index]);
      const transform = this.props.open ? `translateY(${this.burgerPos[index]}px)` : 'translateX(0)';
      return (
        <div onClick={this.handleCloseClick} key={index} to={`/chapter-${chapter.rank}`} className="menu__item">
          <Link onClick={this.handleCloseClick} key={index} to={`/chapter-${chapter.rank}`} className="menu__item__link">
            <h1 className="menu__item__title heading-3">{chapter.rank}. {chapter.title}</h1>
            {/* <span className="menu__item__burger" style={{transforrm: this.props.open ? `translateY(${this.burgerPos[index]})` : 'translateX(0)'}}></span> */}
            <span className="menu__item__burger"  style={{ transform: transform }}></span>
          </Link>
          <div className="menu__item__time">
            <svg width="10" height="12" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.6 12H0L9.6 0H0z" stroke="#FFF" fill="none" fillRule="evenodd"/>
            </svg> <span className="heading-6"> - 5 minutes</span>
          </div>
          <p className="menu__item__content teasing-3">{chapter.content}</p>
        </div>
      )
    })
  }

  render() {
    var className = this.props.open ? "menu is-active" : "menu";
    return (
      <div className={className} ref={(ref) => this.menu = ref}>
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
  return {
    chapters: getChapters(state)
  }
}


export default connect(mapStateToProps)(Menu);
