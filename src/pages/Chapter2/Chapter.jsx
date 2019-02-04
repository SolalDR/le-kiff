import React from "react";
import withCursor from '~/components/Cursor/hoc/withCursor';
import "./styles.sass";
import Bus from "../../helpers/Bus";

class Chapter extends React.Component {


    /**
     * @constructor
     * @param {boolean} isReady True if the steps are loaded
     */
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {
      Bus.verbose("chapter-2:mounted");
    }

    componentWillUnmount() {
    }

    onHoldComplete() {
    }

    render () {
      return <div className="chapter chapter-2">
          <h1 className="heading-2">À découvrir</h1>
          <h1 className="heading-1">Transport</h1>
          <h2 className="heading-2 chapter__date">Le 01.03.2019</h2>
          <p className="t-heading-8">Partagez</p>
        </div>;
      
    }
}
export default withCursor(Chapter);

