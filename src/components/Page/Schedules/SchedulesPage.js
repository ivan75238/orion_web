import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import CustomDatePicker from "components/Elements/DatePicker";
import _get from "lodash/get";
import ReactSelect from "components/Elements/ReactSelect";
import Button from "components/Elements/Button";
import {toast} from "react-toastify";
import Table from "components/Elements/Table";
import Close from "components/Icons/Close";
import AddTripPopup from "components/Page/Schedules/AddTripPopup";
import {API} from "components/API";

const ContentWrapper = styled.div`
    width: 100%;
`;

const Header = styled.div`
    width: 100%;
    padding: 8px;
    border-bottom: 1px solid #cdcdcd;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Filters = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const Body = styled.div`
    width: 100%;
    padding: 8px;
    display: flex;
    max-height: calc(100vh - 182px);
    flex-direction: column;
    overflow-x: auto;
`;

const ActionContainer = styled.div`
    display: flex;
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    cursor: pointer;
    
    &:hover {
        border: 1px solid #cdcdcd;
        border-radius: 3px;
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`;

@connect(state => ({
    routs: _get(state.app, "routs"),
    user: _get(state.app, "user"),
}))
class SchedulesPage extends PureComponent {
    state = {
        date: new Date(),
        rout: null,
        trips: [],
        openPopupCreate: false
    };

    columns = [
        {
            name: "name",
            title: "Название",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "gos_nomer",
            title: "Гос. номер",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "voditel",
            title: "Водитель",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "actions",
            title: "",
            justifyContent: "center",
            flex: "0 0 70px"
        }
    ];

    componentDidMount() {
        document.title = "Расписание";
    }

    search = () => {
        const {date, rout} = this.state;
        const {routs} = this.props;
        if (!rout) {
            toast.warn("Выберите маршрут");
            return;
        }
        if (!date) {
            toast.warn("Выберите день");
            return;
        }
        const routObj = routs.find(i => i.id === rout.value);
        API.trip.getTripDate(date, rout.value, routObj.locations[0].id, routObj.locations[routObj.locations.length-1].id)
            .then(response => {
                const resp = response.data;
                this.setState({trips: resp});
            })
    };

    removeTrip = trip => {
        API.trip.deleteTrip(trip.id)
            .then(() => {
                this.search();
            })
    };

    render() {
        let {date, rout, trips, openPopupCreate} = this.state;
        const {routs, user} = this.props;
        const selectOptions = routs.map(i => {
            return {value:i.id, label: i.name};
        });

        trips = trips.map((item, i) => {
            return {
                ...item,
                name: `Микроавтобус ${i+1}`,
                actions: <ActionContainer>
                        <IconContainer onClick={() => this.removeTrip(item)}>
                            <Close/>
                        </IconContainer>
                    </ActionContainer>
            }
        });

        return (
            <ContentWrapper>
                <Header>
                    <Filters>
                        <CustomDatePicker selected={date}
                                          onChange={date => this.setState({date})}
                                          height="40px"
                                          width="140px"
                                          dateFormat="dd.MM.yyyy"/>
                        <ReactSelect value={rout}
                                     height="40px"
                                     width="220px"
                                     margin={"0 0 0 16px"}
                                     placeholder={"Выберите маршрут"}
                                     onChange={value => this.setState({rout: value})}
                                     options={selectOptions}/>
                        <Button title={"Показать"}
                                height="40px"
                                onClick={this.search}
                                margin="0 0 0 16px"/>
                    </Filters>
                    {
                        trips.length < 3 ?
                            <Button title={"Создать рейс"}
                                    height="40px"
                                    onClick={() => this.setState({openPopupCreate: true})}/>
                        :
                            user.role == "1" &&
                                <Button title={"Создать рейс"}
                                        height="40px"
                                        onClick={() => this.setState({openPopupCreate: true})}/>
                    }
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={trips}/>
                </Body>
                {
                    openPopupCreate &&
                        <AddTripPopup onClose={() => this.setState({openPopupCreate: false})}
                                      onUpdate={this.search}/>
                }
            </ContentWrapper>
        )
    }
}

SchedulesPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
    user: PropTypes.object,
};

export default SchedulesPage;
