import React, {PureComponent} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
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
import AuthLoader from "components/Elements/AuthLoader";
import Main from "components/Main";

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
        timeoutSessionId: null,
        loading: true
    };

    constructor(props) {
        super(props);
        this.checkSession();
    }

    checkSession = () => {
        const {dispatch} = this.props;
        const uid = localStorage.getItem("ori_uid");

        if (!uid || uid === "undefined") {
            setTimeout(() => this.setState({loading: false}), 500);
            return;
        }

        axios.get(`${apiUrl}User.CheckSession&uid=${uid}`)
            .then(response => {
                const resp = response.data;
                if (resp.result) {
                    this.setState({loading: false});

                    localStorage.setItem("ori_uid", resp.user.id);
                    dispatch({type: appActions.SET_AUTH_VALUE, auth: true});
                    dispatch({type: appActions.SET_AUTH_DATA, user: resp});
                }
                else {
                    this.setState({loading: false});
                }
            })
            .catch(() => {
                this.setState({loading: false});
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
        }, 3 * 60 * 1000); //3 минут, хотя сессия держится 5 минут
        this.setState({timeoutSessionId: timeoutSessionIdNew});
    };

    render() {
        const {auth} = this.props;
        const {loading} = this.state;
        return(
            <MainWrapper>
                <ReactTooltip className="EventTooltip"/>
                <HashRouter>
                    <BackgroundContainer />
                        <MainWrapperInner>
                            <StyledToastContainer />
                            {
                                auth ?
                                    <Main/>
                                :
                                    <Switch>
                                        <Route exact path='/' render={props => <Auth {...props}
                                                                                     updateSession={this.updateSession}/>}/>
                                    </Switch>
                            }
                            {
                                loading &&
                                    <AuthLoader />
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
