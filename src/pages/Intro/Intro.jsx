import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LetterReveal from '~/components/LetterReveal/LetterReveal';
import withCursor from '~/components/Cursor/hoc/withCursor';
import "./styles.sass";
import { getIsLoadedChapters, getIsChapterReady } from "~/services/stores/reducers/selectors";
// import { getIsChapterReady } from "./services/stores/reducers/selectors";

class Intro extends React.Component {
  static propTypes = {
    onLoad: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      reveal: false
    };
  }

  componentDidMount() {
    this.setState({
      reveal: true
    });

    if (this.props.isChapterReady) {
      this.props.onLoad(false);
    } else {
      this.props.onLoad(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.isChapterReady !== nextProps.isChapterReady &&
      nextProps.isChapterReady
    ) {
      this.props.onLoad(false);
      this.props.onHoldAllowed();
    }
  }

  onHoldComplete() {
    //Do smth
    this.props.history.push("/chapter-1");
  }

  render() {
    return (
      <div className="intro">
        <video muted autoPlay className="intro__video">
          <source src="../../videos/smoke.mp4" type="video/mp4" />
        </video>
        <div className="intro__inner">
          <div className="intro__inner__content">
            {/* <h1 className="intro__title heading-1">Le Kiff</h1> */}
            <LetterReveal
              text="Le Kiff"
              class={"intro__title heading-1"}
              duration={0.09}
              delay={0.07}
              globalDelay={1}
              reveal={this.state.reveal}
              options={{ filter: "blur(0)" }}
            />
            {/* <h2 className="intro__subtitle heading-2">Histoire de disparitions</h2> */}
            <LetterReveal
              text="Histoire de disparitions"
              class={"intro__subtitle heading-2"}
              duration={0.09}
              delay={-0.05}
              globalDelay={1.5}
              reveal={this.state.reveal}
              options={{ scale: 1, left: 0, x: 0 }}
              start={{ opacity: 0, x: 50, scale: 0.5 }}
            />
            <p className="intro__teasing teasing-1">
              Découvrez l’histoire d’un caillou de crack, de sa production à sa
              consommation, et ses conséquences sur la vie, la mort et l’humeur
            </p>
          </div>
          <div className="intro__inner__bottom">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="26">
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
            <p className="intro__indication small">
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
    isChapterReady: getIsChapterReady(state, '1') 
  };
}

export default withCursor(connect(mapStateToProps)(Intro));

// export default withCursor(Intro);
// export default Intro;
