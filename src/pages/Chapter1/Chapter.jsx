import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Scene from "../../components/Scene/Scene";
import API from "./../../services/api";
import Timeline from "./../../components/Timeline/Timeline";

class Chapter extends React.Component {
    
  static propTypes = {
    chapters: PropTypes.arrayOf(PropTypes.shape({
      api_id: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
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
    chapters: state.entities.chapters
  }
}

export default connect(mapStateToProps)(Chapter);

