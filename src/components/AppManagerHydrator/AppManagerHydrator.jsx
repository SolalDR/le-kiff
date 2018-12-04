import React from "react";
import PropTypes from 'prop-types';
import { withRouter } from "react-router"

class AppManagerHydrator extends React.Component {

  constructor (props) {
    super(props);
  }

  static propTypes = {
    onRouteChange: PropTypes.func
  }

  componentWillMount() {
    this.handleRouteChange(this.props.history.location);

    this.unlisten = this.props.history.listen((location, action) => {
      this.handleRouteChange(location);
    });
  }

  componentWillUmount() {
    this.unlisten();
  }

  handleRouteChange(location) {
    this.props.onRouteChange(location.pathname);
  }

  render() {
    return null
  }
}

export default withRouter(AppManagerHydrator);
