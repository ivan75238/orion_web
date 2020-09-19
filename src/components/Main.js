import React, {PureComponent} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import styled from "styled-components";
import Menu from "components/Menu/Menu";
import TopLine from "components/TopLine";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import _get from "lodash/get";
import AuthLoader from "components/Elements/AuthLoader";
import {Paths} from "../Paths";
import OrdersPage from "components/Page/Orders/OrdersPage";
import SchedulesPage from "components/Page/Schedules/SchedulesPage";
import ClientsPage from "components/Page/Clients/ClientsPage";
import StockPage from "components/Page/Stock/StockPage";
import CarParkPage from "components/Page/CarPark/CarParkPage";
import PricesPage from "components/Page/Prices/PricesPage";
import RoutsPage from "components/Page/Routs/RoutsPage";
import TypeTicketsPage from "components/Page/TypeTickets/TypeTicketsPage";
import WorkPlanPage from "components/Page/WorkPlan/WorkPlanPage";
import SettingsPage from "components/Page/Settings/SettingsPage";
import SmsPage from "components/Page/Sms/SmsPage";
import NewsPage from "components/Page/News/NewsPage";
import ReportPage from "components/Page/Report/ReportPage";

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

const PageInner = styled.div`
    width: 100%;
    height: auto;
    padding: 32px;
    box-sizing: border-box;
`;

const PageInnerContainer = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    box-sizing: border-box;
    overflow-y: auto;
    background: #fff;
`;

@connect(state => ({
    user: _get(state.app, "user"),
}))
class Main extends PureComponent {
    state = {
        isOpenMenu: true
    };

    render() {
        const {isOpenMenu} = this.state;
        const {timeoutSessionId, user} = this.props;

        if (!user)
            return <AuthLoader />;

        return (
            <MainWrapper>
                <Menu isOpen={isOpenMenu}
                      onChangeIsOpen={val => this.setState({isOpenMenu: val})}/>
                <PageContainer>
                    <TopLine timeoutSessionId={timeoutSessionId}/>
                    <PageInner>
                        <PageInnerContainer>
                            <Switch>
                                <Route exact path={Paths.order.list.path()} render={props => <OrdersPage {...props}/>}/>
                                <Route exact path={Paths.schedule.list.path()} render={props => <SchedulesPage {...props}/>}/>
                                <Route exact path={Paths.client.list.path()} render={props => <ClientsPage {...props}/>}/>
                                <Route exact path={Paths.sale.list.path()} render={props => <StockPage {...props}/>}/>
                                <Route exact path={Paths.carPark.list.path()} render={props => <CarParkPage {...props}/>}/>
                                <Route exact path={Paths.price.list.path()} render={props => <PricesPage {...props}/>}/>
                                <Route exact path={Paths.rout.list.path()} render={props => <RoutsPage {...props}/>}/>
                                <Route exact path={Paths.ticket.list.path()} render={props => <TypeTicketsPage {...props}/>}/>
                                <Route exact path={Paths.workplan.list.path()} render={props => <WorkPlanPage {...props}/>}/>
                                <Route exact path={Paths.setting.list.path()} render={props => <SettingsPage {...props}/>}/>
                                <Route exact path={Paths.report.list.path()} render={props => <ReportPage {...props}/>}/>
                                <Route exact path={Paths.sms.list.path()} render={props => <SmsPage {...props}/>}/>
                                <Route exact path={Paths.news.list.path()} render={props => <NewsPage {...props}/>}/>
                                <Redirect from="/" to={Paths.order.list.path()} />
                            </Switch>
                        </PageInnerContainer>
                    </PageInner>
                </PageContainer>
            </MainWrapper>
        )
    }
}

Main.propTypes = {
    timeoutSessionId: PropTypes.number,
    user: PropTypes.object,
};

export default Main;
