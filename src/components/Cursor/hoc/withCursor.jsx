import React, {higherOrderComponent} from "react";
import Cursor from "./../Cursor";

function withCursor(WrappedComponent) {
  return class extends React.Component {
    
    constructor(props) {
      super(props);
      this.cursorDelay = 5000;
      this.isHoldAllowed = false;
      this.state = {
        isHoldAllowed: false
      }
    }

    componentWillUnmount() {
      clearTimeout(this.holdTimeout);
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

    render() {
      return (
        <>
          <Cursor onHoldComplete={this.onHoldComplete.bind(this)} isHoldAllowed={this.state.isHoldAllowed} />
          <WrappedComponent {...this.props} onRef={ref => (this.child = ref)} onStepChange={this.onStepChange.bind(this)}  />;
        </>
      )
    }
  };
}
export default withCursor;
