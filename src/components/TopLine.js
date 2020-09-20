import React, {PureComponent} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import _get from "lodash/get";
import PropTypes from "prop-types";
import {appActions} from "reducers/actions";
import {withRouter} from "react-router-dom";
import {API} from "components/API";

const LineWrapper = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #00b700;
`;

const HeaderText = styled.h1`
    font-size: 18px;
    marin-bottom: 0px;
    margin-left: 16px;
    color: #fff;
`;

const UserBlock = styled.div`
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const UserName = styled.p`
    color: #fff;
    margin-right: 8px;
`;

const SvgContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    cursor: pointer;
    position: relative;    
`;

const ContextMenu = styled.div`
    align-items: flex-start;
    justify-content: flex-start;
    width: 160px;
    height: auto;
    position: absolute;
    top: 22px;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(0,0,0,0.5);
    right: 0;
    background: #fff;
    display: none;
    
    ${SvgContainer}:hover & {
        display: flex;
    }
`;

const ContextMenuItem = styled.p`
    margin-bottom: 0;
    width: 100%;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 500;
    font-size: 14px;
    color: ${props => props.red ? "#de0b2e" : "#000"};
    
    &:hover {
        background: #ededed;
    }
`;

@connect(state => ({
    headerText: _get(state.app, "headerText"),
    user: _get(state.app, "user"),
}))
class TopLine extends PureComponent {
    logout = () => {
        const {user, dispatch, history} = this.props;
        API.user.logoutV2(user.id)
            .then(response => {
                const resp = response.data;
                if (resp.result) {

                    localStorage.removeItem("ori_uid");
                    dispatch({type: appActions.SET_AUTH_VALUE, auth: false});
                    dispatch({type: appActions.SET_AUTH_DATA, user: null});
                    history.push("/");
                }
            })
            .catch(() => {
                this.setState({loading: false});
            });
    }

    render() {
        const {headerText, user} = this.props;
        return (
            <LineWrapper>
                <HeaderText>{headerText}</HeaderText>
                <UserBlock>
                    <UserName>{user.fio}</UserName>
                    <SvgContainer>
                        <svg x="0px" y="0px"
                             width="16" height="16"
                             fill={"#fff"}
                             viewBox="0 0 292.362 292.362" >
                            <g>
                                <path d="M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424   C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428   s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z"/>
                            </g>
                        </svg>
                        <ContextMenu>
                            <ContextMenuItem onClick={this.logout}
                                             red>
                                {"Выход"}
                            </ContextMenuItem>
                        </ContextMenu>
                    </SvgContainer>
                </UserBlock>
            </LineWrapper>
        )
    }
}

TopLine.propTypes = {
    headerText: PropTypes.string,
    user: PropTypes.object,
    dispatch: PropTypes.func,
    history: PropTypes.func,
    timeoutSessionId: PropTypes.number,
};

export default withRouter(TopLine);
