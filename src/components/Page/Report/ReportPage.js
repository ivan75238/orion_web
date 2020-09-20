import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import ReportParkPage from "components/Page/Report/Subpage/ReportPark/ReportParkPage";

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
    text-align: center;
    border-bottom: ${props => props.isActive ? '2px solid #00b700' : ""};
    
    &:hover {
        background: #e3e3e3;
    }
`;

@connect(() => ({}))
class ReportPage extends PureComponent {
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
            title: "Парк",
            component: ReportParkPage
        },
        {
            id: 2,
            title: "График загруженности",
            component: null
        },
        {
            id: 3,
            title: "График заказов по типу билета",
            component: null
        },
        {
            id: 4,
            title: "График по способам оформления заказов",
            component: null
        },
    ];

    render() {
        let {selectedTabId} = this.state;
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

ReportPage.propTypes = {
    routs: PropTypes.array,
};

export default ReportPage;
