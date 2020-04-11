import React, {PureComponent} from "react";
import styled from "styled-components";
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";
import {HashRouter, Switch} from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from "react-tooltip";

const MainWrapper = styled.div`
`;

const BackgroundContainer = styled.div`
    background: #fff;
`;

const StyledToastContainer = styled(ToastContainer).attrs({
    className: 'toast-container',
    toastClassName: 'toast',
    bodyClassName: 'body',
    progressClassName: 'progress',
})`
  .toast {
    border-radius: 5px;
  }
`;

@connect()
class App extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return(
            <>
                <ReactTooltip className="EventTooltip"/>
                <HashRouter>
                    <BackgroundContainer />
                        <MainWrapper>
                            <StyledToastContainer />
                                <Switch>
                                </Switch>
                        </MainWrapper>
                </HashRouter>
            </>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func,
};

export default App;
