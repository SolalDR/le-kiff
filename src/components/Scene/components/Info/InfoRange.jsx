import React from "react";
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';

class InfoPoint extends React.Component {

  static propTypes = {
    rangeInfo: PropTypes.object,
    answer: PropTypes.string
  };


  constructor(props) {
    super(props);

    this.state = {
      answer: 0,
      isAnswerRevealed: false,
      isAnswered: false,
      isInMinRange: false,
      isInMaxRange: false
    }

    this.rangeButtonPosX = 0;
    
    this.config = {};
    this.answer = { valueInt: 0};
    this.ui = {};
    this.ui.rangeWrapper = React.createRef();

    this.timeline = new TimelineLite({ onComplete: this.onComplete, paused: true });

  }

  componentWillReceiveProps(nextProps){
    if( this.props.visible !== nextProps.visible ) {
      if(nextProps.visible){
        this.ui.rangeWrapper.current.addEventListener('mousemove', this.onMouseMove);
      } else {
        this.ui.rangeWrapper.current.removeEventListener('mousemove', this.onMouseMove);
      }
    }
  }

  componentDidMount () {
    if (this.ui.rangeWrapper.current) {
      this.ui.rangeText = this.ui.rangeWrapper.current.querySelector('.info__range__slide__text');
      this.ui.rangeSlide = this.ui.rangeWrapper.current.querySelector('.info__range__slide');

      //TODO : Implement RAF ??
      this.initRange();
    }
  }

  initRange() {
    const totalRange = (this.props.rangeInfo.max - this.props.rangeInfo.min);
    const rangeWidth = this.ui.rangeWrapper.current.clientWidth;
    const isInteger = Number.isInteger(this.props.rangeInfo.max);

    this.config = {
      rangeWidth: rangeWidth,
      isInteger: isInteger,
      rangeMiddle: isInteger ? Math.floor(this.props.rangeInfo.max / 2) : (this.props.rangeInfo.max / 2).toFixed(2),
      rangeOffsetX: this.ui.rangeWrapper.current.getBoundingClientRect().left,
      totalRange: totalRange,
      ratioWidth: totalRange / rangeWidth,
      minXRange: rangeWidth * 0.2,
      maxXRange: rangeWidth * 0.8
    }

    this.setState({
      answer: this.config.rangeMiddle
    });  

    this.moveRangeButton(this.config.rangeWidth / 2);
  }

  onClick = () => {
    this.setState({
      isAnswered: true
    });  

    this.answer.valueInt = this.state.answer;
    this.timeline.to(this.answer, 1, {valueInt: this.props.rangeInfo.response_max, roundProps:"valueInt", onUpdate:this.updateAnswer});
    this.timeline.play();
  }

  updateAnswer = () => {
    this.setState({
      answer: this.answer.valueInt
    }); 
  }

  onComplete = () => {
    this.setState({
      isAnswerRevealed: true
    });
  }

  moveRangeButton(value) {
    if (value >= 0) {

      let valueStep = 0;
      if (this.props.rangeInfo.precision > 0 && this.config.ratioWidth) {

        valueStep = (Math.round((value * this.config.ratioWidth) / this.props.rangeInfo.precision) * this.props.rangeInfo.precision) + this.props.rangeInfo.precision;
      } else {
        if (this.config.isInteger) {
          valueStep = Math.round(value * this.config.ratioWidth);
        } else {
          valueStep = (value * this.config.ratioWidth).toFixed(1);
        }
      }
      
      if (valueStep !== this.state.answer) {
        this.ui.rangeSlide.style.left = `${value}px`;

        this.setState({
          answer: valueStep,
          isInMinRange: (value < this.config.minXRange),
          isInMaxRange: (value > this.config.maxXRange)
        });  
      }
    }
  }


  onMouseMove = (e) => {
    this.moveRangeButton(e.offsetX);
  }

  render() {
    return (
      <div className={`info__range ${this.state.isAnswered ? 'is-answered' : ''}`}> 
        <div className="info__range__question">
          <div className="info__range__wrapper" ref={this.ui.rangeWrapper} > 
              <div className="info__range__slider">
                <span className={`info__range__value info__range__value--min ${this.state.isInMinRange ? '' : 'is-visible'}`}>{this.props.rangeInfo.min}</span>
                <button className="info__range__slide">
                  <span className="info__range__slide__button"></span>
                  <span className="info__range__slide__text">{isNaN(this.state.answer) ? 0 : this.state.answer}</span>
                </button>
                <span className={`info__range__value info__range__value--max ${this.state.isInMaxRange ? '' : 'is-visible'}`}>{this.props.rangeInfo.max}</span>
              </div>
            
          </div>
          <button className="info__range__btn heading-6" onClick={this.onClick}>Crack it</button>
        </div>
        <div className="info__range__answer">
          <p className="info__range__number heading-3">{this.state.answer} {this.props.rangeInfo.unit}</p>
          <p className={`info__range__text teasing-3 ${this.state.isAnswerRevealed ? 'is-visible' : ''}`} dangerouslySetInnerHTML={{__html: this.props.answer}}></p> 
        </div>
      </div>
    )
  }

}

export default InfoPoint;
