import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import UserPage from "components/Page/Settings/Subpage/User/UserPage";
import _get from "lodash/get";
import AccessRights from "components/Elements/AccessRights";

const ContentWrapper = styled.div`
    width: 100%;
`;

const SubPageWrapper = styled.div`
    width: 100%;
`;

const TabsContainer = styled.div`
    width: 100%;
    display: flex;
`;

const Tab = styled.div`
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    cursor: pointer;
    border-bottom: ${props => props.isActive ? '2px solid #00b700' : ""};
    
    &:hover {
        background: #e3e3e3;
    }
`;

@connect(state => ({
    user: _get(state.app, "user")
}))
class SettingsPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabId: 1
        };
    }

    componentDidMount() {
        document.title = "Настройки";
    }

    pages = [
        {
            id: 1,
            title: "Пользователи",
            component: UserPage
        }
    ];

    render() {
        let {selectedTabId} = this.state;

        const {user} = this.props;

        if (user.role === "0")
            return <AccessRights/>;

        const SubPageComponent = this.pages.find(i => i.id === selectedTabId).component;

        return (
            <ContentWrapper>
                <TabsContainer>
                    {
                        this.pages.map((item, i) => {
                            return (
                                <Tab isActive={item.id === selectedTabId}
                                     key={i}
                                     onClick={() => this.setState({selectedTabId: item.id})}>
                                    {item.title}
                                </Tab>
                            )
                        })
                    }
                </TabsContainer>
                <SubPageWrapper>
                    {
                        SubPageComponent &&
                        <SubPageComponent />
                    }
                </SubPageWrapper>
            </ContentWrapper>
        )
    }
}

SettingsPage.propTypes = {
    routs: PropTypes.array,
    user: PropTypes.object,
};

export default SettingsPage;
