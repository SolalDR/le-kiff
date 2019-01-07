import React from "react";
import PropTypes from 'prop-types';
// import AnimationManager from '~/webgl/helpers/AnimationManager';
// import "./styles.sass";

class LetterReveal extends React.Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    // duration: PropTypes.number.isRequired,
    // delays: PropTypes.array,
    // delay: PropTypes.number
  }

  constructor (props) {
    super(props);
    this.length = props.text.length;
    this.lettersArray = props.text.split('');

    setTimeout(this.revealIn.bind(this), 2000)
  }

  handleToggleMenu = (e)=>{
    // this.setState({menuOpen: !this.state.menuOpen});
  }

  revealIn = (e) => {
    console.log('lettersArray', this.lettersArray);
  }
  
  unRevea = (e) => {
    console.log(e);
  }

  render () {
    return (
      <span>{this.props.text}</span>
    );
  }
}

export default LetterReveal;
