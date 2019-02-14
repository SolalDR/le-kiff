import React from "react";
import { connect } from 'react-redux';
import withCursor from '~/components/Cursor/hoc/withCursor';

import { TimelineLite } from 'gsap';

import PropTypes from 'prop-types';
import { getWholeChapter, getChapter, getStep, getIsChapterReady } from "~/services/stores/reducers/selectors";
import { setCurrentChapterData, setCurrentStepRank, setTutorialDone } from "~/services/stores/actions";
import AssetsManager from "~/services/assetsManager/AssetsManager";

import Scene from "~/components/Scene/Scene";
import Timeline from "~/components/Timeline/Timeline";
import LetterReveal from '~/components/LetterReveal/LetterReveal';
import Loading from "~/components/Loading/Loading";

import "./styles.sass";
import Bus from "../../helpers/Bus";
import AbilitiesManager from "~/services/AbilitiesManager";


class Chapter extends React.Component {
    
  static propTypes = {
    chapter: PropTypes.shape({
      api_id: PropTypes.number,
      id: PropTypes.number,
      rank: PropTypes.number,
      title: PropTypes.string,
      slug: PropTypes.string,
      type: PropTypes.string,
      content: PropTypes.string,
      steps: PropTypes.array
      }),
      onRef: PropTypes.func,
      onStepChange: PropTypes.func
    }

  /**
   * @constructor
   * @param {boolean} isReady True if the steps are loaded
   */
  constructor(props) {
      super(props);

      this.state = {
        isReady: false,
        isWebglReady: false,
        reveal: false,
        hideTitle: false,
        stepId: 1,
        isChapterIntroReady: false
      };

      this.video = null;
      this.videoRef = React.createRef();
  }

  componentWillMount() {
    if (!this.props.isChapterReady) {
      this.props.history.push("");
    }

    const assets = AssetsManager.loader.getFiles("chapter-1");

    if (assets && assets.chapter_title_reveal) {
      this.video = assets.chapter_title_reveal.result;
    }
  }

  componentWillUnmount() {
    Bus.off("scale:display", this.endChapterIntro);
  }

  componentDidMount() {
    Bus.verbose("chapter-1:mounted");

    Bus.on("intro:text:disappear", () => {
      const video = document.querySelector('.chapter__video');
      video.play();
      this.setState({
        reveal: true
      });
    });

    this.props.onRef(this);

    if (this.props.isChapterReady) {
  
      this.props.onStepChange(); //Allow cursor
      this.setState({
        isReady: true
      });

      this.props._setCurrentChapterData({
        chapter: this.props.chapter,
        step: this.props.chapter.steps[this.state.stepId - 1],
        steps: this.props.chapter.steps,
        infos: this.props.chapter.steps[this.state.stepId - 1].infos,
        scale: "human"
      });  
    }

    Bus.on("scale:display", this.endChapterIntro);
  }


  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  onHoldComplete() {
    this.onStepChange(this.props.step.rank + 1);
    this.props.onStepChange();
  }

  onStepChange = rank => {
    if( !AbilitiesManager.can("changeStep") ) return;
    if (rank < this.props.chapter.steps.length + 1) {
      this.props._setCurrentStepRank(rank);
    } else {
      this.onChapterChange(this.props.chapter.rank + 1);
    }
  }

  // TODO Call router to navigate 
  onChapterChange = chapterRank => {

  }

  onEnded = () => {
    this.setState({
      isChapterIntroReady: true
    })
  }

  endChapterIntro = () => {
    if (!this.state.isWebglReady) {
      this.setState({
        isWebglReady: true, 
        isChapterReady: true
      });
      this.endAnimation();
    }
  }
  
  endAnimation = () => {
    const timeline = new TimelineLite();
    const ui = {
      svgFilter: document.querySelector('#displaceChapter1'),
      svgFilterTurbulence: document.querySelector('#displaceChapter1 feTurbulence'),
      svgFilterDisplacement: document.querySelector('#displaceChapter1 feDisplacementMap')
    }

    const filters = {
      entry: {
        baseFrequency: 0,
        numOctaves: 1,
        scale: 4,
      },
      output: {
        baseFrequency: 0.03,
        numOctaves: 2,
        scale: 30,
      }
    }

    timeline.to(filters.entry, 2.5, { baseFrequency: filters.output.baseFrequency, numOctaves: filters.output.numOctaves, scale: filters.output.scale, roundProps:"numOctaves", onUpdate: () => {
      ui.svgFilterTurbulence.setAttribute('numOctaves', filters.entry.numOctaves);
      ui.svgFilterTurbulence.setAttribute('baseFrequency', filters.entry.baseFrequency);
      ui.svgFilterDisplacement.setAttribute('scale', filters.entry.scale);
    }});

    this.setState({
      hideTitle: true
    })
  }

  renderSteps () {
    return this.props.chapter.steps.map((item, rank) => {
      let newDate = new Date();
      const days = item.days * 1
      newDate.setDate(newDate.getDate() + days);
      
      return (
        <div className={`chapter__text ${item.rank == (this.props.step.rank) ? 'is-active' : '' } ${this.state.isWebglReady ? 'is-visible' : ''} `} key={`chapter-text-${rank}`}>
          <h1 className="chapter__step__title heading-5">{item.place} - {newDate.toLocaleDateString('fr', {
              weekday: "long", year: "numeric", month: "long", day: "numeric"
            })}
          </h1>
          <h2 className="chapter__step__text teasing-1">{item.content}</h2>
        </div>
      )
    })
  }

  render () {
    if( !this.props.step.rank ) return null;
    const videoSrc = this.video ? this.video.getAttribute("src") : '';

    if (this.state.isReady) {
      return (
        <div className={`chapter chapter-1 ${this.state.isReady ? 'is-ready' : ''} ${this.state.isWebglReady ? 'is-shown' : ''}`}>
          {this.renderSteps()}

          <video muted className="chapter__video" src={videoSrc} ref={this.videoRef} onEnded={this.onEnded} />
          <div className={`chapter__title ${this.state.hideTitle ? 'is-hidden' : ''}`}>
            <svg viewBox={'0 0 150 80'} className="chapter__title__svg">
              <filter id="displaceChapter1">
                <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="1" result="turbulence" />
                <feDisplacementMap scale="4" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="turbulence" />
              </filter>
              <g id="target" filter="url(#displaceChapter1)" fill="#fff">
                <LetterReveal
                    text={this.props.chapter.title}
                    class={"intro__title heading-1 heading-1--svg "}
                    duration={0.09}
                    delay={0.08}
                    globalDelay={.8}
                    from={{ opacity: 0}}
                    to={{ opacity: 1 }}
                    svg={true}
                    positionSvg={{textX: 20, spanY: 50}}
                    reveal={this.state.reveal}
                  />
                </g>
              </svg>
          </div>
          <Timeline 
            show={this.state.isWebglReady}
            length={this.props.chapter.steps.length} 
            previousChapter={this.props.previousChapter} 
            nextChapter={this.props.nextChapter} 
            current={this.props.step.rank}
            steps={this.props.chapter.steps} 
            chapter={this.props.chapter.rank} 
            onStepChangeCallBack={this.onStepChange} />
          

          <Scene step={this.props.step} isReady={this.state.isChapterIntroReady} showElements={this.state.isWebglReady} />
        </div>
      )
    }
    return <Loading />
  }
}

const mapStateToProps = (state) => {
  return {
    chapter: getWholeChapter(state, 1),
    previousChapter: getChapter(state, 0),
    nextChapter: getChapter(state, 2),
    isChapterReady: getIsChapterReady(state, 1),
    step: getStep(state)
  }
}

const mapDispatchToProps = dispatch => {
  return { 
    _setCurrentChapterData: chapterData => {
      dispatch(setCurrentChapterData(chapterData));
    }, 
    _setCurrentStepRank: rank => {
      dispatch(setCurrentStepRank(rank));
    }
  };
};

export default withCursor(connect(mapStateToProps, mapDispatchToProps)(Chapter));

