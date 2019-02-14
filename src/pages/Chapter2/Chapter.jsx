import React from "react";
import withCursor from '~/components/Cursor/hoc/withCursor';
import "./styles.sass";
import Bus from "../../helpers/Bus";

class Chapter extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
      Bus.verbose("chapter-2:mounted");
    }

    render () {
        return (
            <div className="chapter chapter-2">
                <h1 className="heading-2 chapter__discovery">À découvrir</h1>
                <h1 className="heading-1 chapter__title">Transport</h1>
                <h2 className="heading-2 chapter__date chapter__date">Le 01.03.2019</h2>
                <div className="chapter__share">
                    <p className="heading-6 chapter__share__title">Partagez</p>
                    <div className="chapter__share__list">
                        <a href="#" className="chapter__share__item"> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" viewBox="0 0 25 20">
                                <path fill="#FEFEFE" fillRule="evenodd" d="M7.236 15.65c-2.295-.255-3.834-1.345-4.687-3.512h2.074C2.263 11.262.962 9.645.755 7.13l2.081.581.094-.106C.766 5.756.297 3.553 1.46.911c2.77 3.235 6.202 5 10.265 5.287.104-.951.063-1.883.323-2.722 1.08-3.474 5.47-4.622 8.14-2.163.253.234.474.29.765.186.883-.318 1.764-.642 2.665-.97-.346 1.066-1.073 1.884-1.946 2.662l2.543-.676.09.088c-.66.666-1.282 1.375-1.993 1.98-.353.301-.45.581-.448 1.009.023 5.679-3.435 11.08-8.588 13.216-4.414 1.831-8.76 1.54-12.951-.786a2.454 2.454 0 0 1-.186-.114c-.029-.02-.05-.049-.139-.137 2.659.167 5.03-.477 7.236-2.122"/>
                            </svg>
                        </a>
                        <a href="#" className="chapter__share__item"> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 10 20">
                                <path fill="#FEFEFE" fillRule="evenodd" d="M2.492 20v-9.994H0V6.575h2.492v-.228c0-.722-.015-1.445.005-2.167.02-.726.089-1.447.344-2.139C3.232.981 4.011.375 5.093.172 5.67.064 6.265.03 6.853.013 7.81-.012 8.767.006 9.723.006h.223v3.437h-.2c-.722 0-1.445-.013-2.168.007a3.484 3.484 0 0 0-.855.144c-.355.102-.458.424-.468.74-.024.733-.008 1.469-.008 2.223H10l-.365 3.436h-3.38c-.006.069-.015.118-.015.168l-.004 9.742c0 .032.004.065.006.097h-3.75z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        );

    }
}

export default withCursor(Chapter);

