import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./styles.sass";
import { getChapters } from "../../services/stores/reducers/selectors";
import PropTypes from 'prop-types';
import LetterReveal from "~/components/LetterReveal/LetterReveal";

class Menu extends React.PureComponent {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    menuPosY: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.sizes = [];
    this.gap = 8;
    this.menu = null;

    this.state = {
      isReady: false,
      current: null
    }
  }

  initPositions(itemList) {
    [].forEach.call(itemList, (item, index) => {
      const expand = item.querySelector(".menu__item__expand");
      const content = item.querySelector(".menu__item__content");
      const posY = item.getBoundingClientRect().top;

      this.sizes[index] = {
        height: expand.scrollHeight + content.scrollHeight * .5,
        posY: posY,
        burgerPosY: (- (posY - this.props.menuPosY)) + this.gap * index
      }
    });
    this.setState({
      isReady: true
    });
  }

  onMouseOver(rank) {
    if (this.state.rank !== rank) { 
      this.setState({
        current: rank
      })
    }
  }

  onMouseOut() {
    this.setState({
      current: null
    })
  }

  handleCloseClick = (e) => {
    this.props.closeCallback(e);
  }

  componentDidMount = (e) => {
    const items = this.menu.querySelectorAll(".menu__item");
    this.initPositions(items);
  }

  renderMenuItems() {
    return this.props.chapters.map((chapter, index) => {
      const size = this.sizes.length > 0 ? this.sizes[index] : null;
      const transform = this.props.open || !size ? "translateX(0)" : `translateY(${size.burgerPosY}px)`;
      const height = this.state.current === chapter.rank ? size.height : 0;
      const className = this.state.current === chapter.rank ? 'menu__item is-active' : 'menu__item';

      return <div onClick={this.handleCloseClick} key={index} to={`/chapter-${chapter.rank}`} className={`${className} ${chapter.rank === 1 ? 'is-available' : ''}`} onMouseOver={() => this.onMouseOver(chapter.rank)} onMouseOut={this.onMouseOut.bind(this)}>
          <Link onClick={this.handleCloseClick} key={index} to={`/chapter-${chapter.rank}`} className="menu__item__link">
            <h1 className="menu__item__title heading-4">
              {chapter.title}
            </h1>
            <span className="menu__item__burger" style={{ transform: transform }} />
          </Link>
          <div className="menu__item__expand" style={{ height: height }}>
            <div className="menu__item__time">
              <svg width="10" height="12" xmlns="http://www.w3.org/2000/svg" className="menu__item__time__icon">
                <path d="M9.6 12H0L9.6 0H0z" stroke="#FFF" fill="none" fillRule="evenodd" />
              </svg> <span className="menu__item__time__value t-heading-7"> - 5 minutes</span>
            </div>
            <p className="menu__item__content teasing-3">
              {chapter.content}
            </p>
            { chapter.rank == 2 && 
              <p className="menu__item__available teasing-3">Disponible le 01.03.2019 </p>
            }
            { chapter.rank == 3 && 
              <p className="menu__item__available teasing-3">Disponible le 07.03.2019 </p>
            }
            { chapter.rank == 4 && 
              <p className="menu__item__available teasing-3">Disponible le 14.03.2019 </p>
            }
          </div>
        </div>;
    })
  }

  render() {
    var className = this.props.open ? "menu is-active" : "menu";
    return (
      <div className={className} ref={(ref) => this.menu = ref}>
        <a className="menu__close" onClick={this.handleCloseClick}></a>
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
