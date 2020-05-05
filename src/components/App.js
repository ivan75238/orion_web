import React, {PureComponent} from "react";
import styled from "styled-components";
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";
import {HashRouter, Route, Switch} from 'react-router-dom';
import _get from 'lodash/get';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from "react-tooltip";
import Auth from "components/Auth/Auth";
import axios from "axios";
import {apiUrl} from "config/config";
import {appActions} from "reducers/actions";

const MainWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
`;

const MainWrapperInner = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
`;

const BackgroundContainer = styled.div`
    background: #e9e9e9;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
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

@connect(state => ({
    auth: _get(state.app, "auth"),
    user: _get(state.app, "user"),
}))
class App extends PureComponent {
    state = {
        timeoutSessionId: null
    };

    constructor(props) {
        super(props);
        this.checkSession();
    }

    checkSession = () => {
        const {dispatch} = this.props;
        const uid = localStorage.getItem("ori_uid");

        if (!uid || uid === "undefined")
            return;

        axios.get(`${apiUrl}User.CheckSession&uid=${uid}`)
            .then(response => {
                const resp = response.data;
                if (resp.result) {
                    localStorage.setItem("ori_uid", resp.id);
                    dispatch({type: appActions.SET_AUTH_VALUE, auth: true});
                    dispatch({type: appActions.SET_AUTH_DATA, user: resp});
                }
            });
    };

    updateSession = () => {
        const {user, dispatch} = this.props;
        const {timeoutSessionId} = this.state;
        clearTimeout(timeoutSessionId);
        const timeoutSessionIdNew = setTimeout(() => {
            axios.get(`${apiUrl}User.UpdateSession&uid=${user.id}`)
                .then(response => {
                    if (!response.data.result) {
                        toast.error("Истекла сессия пользователя, для продолжения работы необходимо повторно войти в приложение");
                        dispatch({type: appActions.SET_AUTH_VALUE, auth: false});
                        clearTimeout(timeoutSessionId);
                    }
                    else {
                        this.updateSession();
                    }
                });
        }, 4 * 60 * 1000); //4 минут, хотя сессия держится 5 минут
        this.setState({timeoutSessionId: timeoutSessionIdNew});
    };

    render() {
        const {auth} = this.props;
        return(
            <MainWrapper>
                <ReactTooltip className="EventTooltip"/>
                <HashRouter>
                    <BackgroundContainer />
                        <MainWrapperInner>
                            <StyledToastContainer />
                            {
                                auth ?
                                    <Switch>
                                    </Switch>
                                :
                                    <Switch>
                                        <Route exact path='/' render={props => <Auth {...props}
                                                                                     updateSession={this.updateSession}/>}/>
                                    </Switch>
                            }
                        </MainWrapperInner>
                </HashRouter>
            </MainWrapper>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func,
    auth: PropTypes.bool,
    user: PropTypes.object,
};

export default App;
