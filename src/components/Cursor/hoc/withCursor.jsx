import React from "react";
import Cursor from "./../Cursor";

function withCursor(WrappedComponent) {
  return class extends React.Component {
    
    constructor(props) {
      super(props);
      this.cursorDelay = 5000;
      this.isHoldAllowed = false;
      this.state = {
        isHoldAllowed: false,
        isLoading: false
      }
    }

    componentWillUnmount() {
      if (this.holdTimeout) {
        clearTimeout(this.holdTimeout);
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

    onLoad(value) {
      this.setState({
        isLoading: value
      });
    }

    render() {
      return <>
        <Cursor onHoldComplete={this.onHoldComplete.bind(this)} isHoldAllowed={this.state.isHoldAllowed} isLoading={this.state.isLoading} />
        <WrappedComponent {...this.props} onRef={ref => (this.child = ref)} onStepChange={this.onStepChange.bind(this)} onLoad={this.onLoad.bind(this)} onHoldAllowed={this.onHoldAllowed.bind(this)} />
        </>
    }
  };
}
export default withCursor;
