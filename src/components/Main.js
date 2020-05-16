import React, {PureComponent} from "react";
import {Switch} from "react-router-dom";
import styled from "styled-components";
import Menu from "components/Menu/Menu";
import TopLine from "components/TopLine";

const MainWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
`;

const PageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

class Main extends PureComponent {
    state = {
        isOpenMenu: true
    };

    render() {
        const {isOpenMenu} = this.state;
        return (
            <MainWrapper>
                <Menu isOpen={isOpenMenu}
                      onChangeIsOpen={val => this.setState({isOpenMenu: val})}/>
                <PageContainer>
                    <TopLine/>
                    <Switch>
                    </Switch>
                </PageContainer>
            </MainWrapper>
        )
    }
}

export default Main;
