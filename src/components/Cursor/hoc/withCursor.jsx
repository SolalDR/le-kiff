import React from "react";
import Cursor from "./../Cursor";

function withCursor(WrappedComponent) {
  return class extends React.Component {
    
    constructor(props) {
      super(props);
      this.cursorDelay = 5000;
      this.state = {
        isHoldAllowed: false,
        isLoading: false
      }

      console.log(props);
    }

    componentWillUnmount() {
      if (this.holdTimeout) {
        clearTimeout(this.holdTimeout);
      }
    }

    onUpdate(cursorState) {

      if (this.child.onCursorUpdate && typeof this.child.onCursorUpdate !== undefined) {
        this.child.onCursorUpdate(cursorState);
      }
    }

    onHoldComplete(e) {
      this.setState({
        isHoldAllowed: false
      });
      this.child.onHoldComplete();
    }

    onStepChange(e) {
      this.holdTimeout = setTimeout( () => {
        this.setState({
          isHoldAllowed: true
        })
      }, this.cursorDelay);
    }

    onHoldAllowed(e) {
      this.setState({
        isHoldAllowed: true
      }) 
    }

    onHoldNotAllowed(e) {
      this.setState({
        isHoldAllowed: false
      }) 
    }

    onLoad(value) {
      this.setState({
        isLoading: value
      });

      
    }

    render() {
      return <>
        <Cursor onHoldComplete={this.onHoldComplete.bind(this)} isHoldAllowed={this.state.isHoldAllowed} isLoading={this.state.isLoading}  onUpdate={(cursorState) => {this.onUpdate(cursorState)}} isIntro={this.props.location.pathname === '/'} />
        <WrappedComponent {...this.props} onRef={ref => (this.child = ref)} onStepChange={this.onStepChange.bind(this)} onLoad={this.onLoad.bind(this)} onHoldAllowed={this.onHoldAllowed.bind(this)} onHoldNotAllowed={this.onHoldNotAllowed.bind(this)} />;
        </>;
    }
  };
}
export default withCursor;
