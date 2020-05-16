import React, {PureComponent} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import _get from "lodash/get";
import PropTypes from "prop-types";

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

@connect(state => ({
    headerText: _get(state.app, "headerText")
}))
class TopLine extends PureComponent {
    render() {
        const {headerText} = this.props;
        return (
            <LineWrapper>
                <HeaderText>{headerText}</HeaderText>
            </LineWrapper>
        )
    }
}

TopLine.propTypes = {
    headerText: PropTypes.string,
};

export default TopLine;
