import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChapter } from "../../services/stores/reducers/selectors";
import Scene from "../../components/Scene/Scene";
import Timeline from "./../../components/Timeline/Timeline";

class Chapter extends React.Component {
    
  static propTypes = {
    chapters: PropTypes.arrayOf(PropTypes.shape({
      api_id: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,

      steps: PropTypes.arrayOf(PropTypes.shape({
          api_id: PropTypes.number.isRequired,
          id: PropTypes.number.isRequired,
          title: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
          infos: PropTypes.array
        }))
      })).isRequired,
    }

    constructor(){
        super();
        this.state = {};
    }

    render(){
        return (
            <div className="chapter chapter-1">
                <Timeline />
                <Scene />
            </div>
        );
    }

}

const mapStateToProps = state => {
  return {
    chapter: getChapter(state, 1),
  }
}

export default connect(mapStateToProps)(Chapter);

