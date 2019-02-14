import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LetterReveal from '~/components/LetterReveal/LetterReveal';
import withCursor from '~/components/Cursor/hoc/withCursor';
import "./styles.sass";
import { getIsLoadedChapters, getIsChapterReady } from "~/services/stores/reducers/selectors";
import AssetsManager from '~/services/assetsManager/AssetsManager';

class Intro extends React.Component {
  static propTypes = {
    onLoad: PropTypes.func,
    onRef: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      autoLoadChapter: false,
      reveal: false,
      videoEnded: false
    };
  }

  componentWillMount() {
    AssetsManager.loader.on("load:global", (event) => {
      this.video = event.smoke.result;
      this.revealLetters();
    });
  }

  componentDidMount() {
    this.props.onRef(this);

    if (this.props.isChapterReady) {
      this.props.onLoad(false);
      // TODO: To Remove - Temporary auto load chapter-1 
      if(this.state.autoLoadChapter) this.onHoldComplete();
    } else {
      this.props.onLoad(true);
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  revealLetters() {
    this.setState({
      reveal: true
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.isChapterReady !== nextProps.isChapterReady &&
      nextProps.isChapterReady
    ) {
      this.props.onLoad(false);
      this.props.onHoldAllowed();
      // TODO: To Remove - Temporary auto load chapter-1 
      if(this.state.autoLoadChapter) this.onHoldComplete();
    }
  }

  onHoldComplete() {
    //Do smth
    this.props.history.push("/chapter-1");
  }

  onVideoEnded = () => {
    this.setState({
      videoEnded: true
    })
  }

  render() {
    const videoSrc = this.video ? this.video.getAttribute("src") : '';

    return (
      <div className="intro" >
        { !this.state.videoEnded && 
          <video muted autoPlay className="intro__video" src={videoSrc} onEnded={this.onVideoEnded}/>
        }
        <div className="intro__inner">
          <div className="intro__inner__layer"></div>
          <div className="intro__inner__content">
            <svg viewBox={'0 0 150 80'} className="intro__inner__svg">
              <filter id="displaceIntro">
                <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="1" result="turbulence" />
                <feDisplacementMap scale="4" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="turbulence" />
              </filter>
              <g id="target" filter="url(#displaceIntro)" fill="#fff">
                <LetterReveal
                    text="Le Kiff"
                    class={"intro__title heading-1 heading-1--svg "}
                    duration={0.09}
                    delay={0.07}
                    globalDelay={1}
                    svg={true}
                    positionSvg={{textX: 20, spanY: 50}}
                    reveal={this.state.reveal}
                    options={{ filter: "blur(0)" }}
                  />
                </g>
              </svg>
            <LetterReveal
              text="Story of disappearances"
              class={"intro__subtitle heading-2"}
              duration={0.09}
              delay={-0.05}
              globalDelay={1.5}
              reveal={this.state.reveal}
              options={{ scale: 1, left: 0, x: 0 }}
              start={{ opacity: 0, x: 50, scale: 0.5 }}
            />
            <p className={`intro__teasing teasing-3 ${this.state.reveal ? 'is-revealed' : ''}`}>
              <span className="intro__teasing__item">Discover the story of a crack rock,</span> 
              <span className="intro__teasing__item">from its birth in Colombia to its consumption in Paris.</span>
            </p>
          </div>

          <div className="intro__inner__bottom">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="26" className={`intro__sound ${this.state.reveal ? 'is-revealed' : ''}`}>
              <g
                fill="none"
                fillRule="evenodd"
                stroke="#FFF"
                transform="translate(0 1)"
              >
                <path d="M27.333 14.19v-2.196C27.333 5.37 21.812 0 15 0S2.667 5.37 2.667 11.994v2.195" />
                <rect
                  width="4.333"
                  height="9.811"
                  x="25.167"
                  y="14.689"
                  rx="2.167"
                />
                <rect
                  width="4.333"
                  height="9.811"
                  x=".5"
                  y="14.689"
                  rx="2.167"
                />
              </g>
            </svg>
            <p className={`intro__indication small ${this.state.reveal ? 'is-revealed' : ''}`}>
              Better experience with sound
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    isChapterReady: getIsChapterReady(state, 1)
  };
}

export default withCursor(connect(mapStateToProps)(Intro));
