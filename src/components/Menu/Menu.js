import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {IconHumburger} from "components/Icons";
import {Link} from "react-router-dom";
import {appActions} from "reducers/actions";
import {connect} from "react-redux";
import {MenuItems} from "../../MenuItems";

const Title = styled.p`
    text-transform: uppercase;
    font-size: 32px;
    line-height: 32px;
    font-weight: 400;
    margin-left: 16px;
    transition: all 0.1s ease;
    opacity: ${props => props.isOpen ? "1" : "0"};
    color: #fff;
`;

const MainWrapper = styled.div`
    min-width: ${props => props.isOpen ? "260px" : "48px"};
    width: ${props => props.isOpen ? "260px" : "48px"};
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    background: #fff;
    transition: all 0.3s ease;
`;

const ToggleContainer = styled.div`
    width: 100%;
    height: 60px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #00b700;
    padding: 0 8px;
    cursor: pointer;
`;

const ItemsContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding: ${props => props.isOpen ? "16px" : "16px 0"};
    overflow-y: auto;
`;

const ItemContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const ItemText = styled.p`
    margin: 0 0 0 16px;
    font-size: 16px;
    color: #232735;
    
    &:hover {
        color: #00b700;  
    }
`;

const LinkStyled = styled(Link)`
    text-decoration: none;
    width: 100%;
    padding: ${props => props.isOpen ? "8px" : "8px"};
    box-sizing: border-box;
    
    ${props => props.isActive ? "border-left: 4px solid #00b700" : ""}
    
    ${
        props => !props.isOpen &&
        `
            &:hover {            
                svg {
                    border: 1px solid #cdcdcd;
                    border-radius: 3px;
                }
            }
        `
    }
`;

@connect()
class Menu extends PureComponent {
    state = {
        openCreateMenu: false
    };

    changeTitle = item => {
        const {dispatch} = this.props;
        dispatch({type: appActions.SET_HEADER_TEXT, text: item.title});
    };

    render() {
        const {isOpen, onChangeIsOpen} = this.props;
        return (
            <MainWrapper isOpen={isOpen}>
                <ToggleContainer>
                    <IconHumburger onClick={() => onChangeIsOpen(!isOpen)}/>
                    <Title isOpen={isOpen}>ORION</Title>
                </ToggleContainer>
                <ItemsContainer isOpen={isOpen}>
                    {
                        MenuItems.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <LinkStyled to={item.link}
                                            key={i}
                                            onClick={() => this.changeTitle(item)}
                                            isOpen={isOpen}>
                                    <ItemContainer>
                                        <Icon/>
                                        {
                                            isOpen &&
                                            <ItemText>{item.title}</ItemText>
                                        }
                                    </ItemContainer>
                                </LinkStyled>
                            )
                        })
                    }
                </ItemsContainer>
            </MainWrapper>
        )
    }
}

Menu.propTypes = {
    isOpen: PropTypes.bool,
    onChangeIsOpen: PropTypes.func,
    dispatch: PropTypes.func,
};

export default Menu;
