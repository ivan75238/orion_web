import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import ReactSelect from "components/Elements/ReactSelect";
import {connect} from "react-redux";
import {API} from "components/API";
import styled from "styled-components";
import _get from "lodash/get";
import Button from "components/Elements/Button";
import {carSheme} from "components/Page/Schedules/EditTripPopup";
import CustomDatePicker from "components/Elements/DatePicker";
import Input from "components/Elements/Input";
import _orderBy from "lodash/orderBy";
import {toast} from "react-toastify";

const Wrapper = styled.div`
    display: flex;
    align-item:center;
    justify-content: flex-start;
`;

const SchemeContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 358px;
    margin-left: 16px;
    padding: 8px;    
    align-items: center;
    justify-content: center;
`;

const SchemeContainerWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;    
    border: 1px solid gray;
    border-radius: 5px;
    margin-top: 16px;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 270px;
`;

const Row = styled.div`
    display: flex;
`;

const Spot = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 60px;
    border-radius: 5px;
    border: 1px solid #000;
    margin: 4px;
    cursor: ${props => props.isBusy || props.isDriver ? "default" : "pointer"};
    background: ${props => props.isBusy ? "#cecece" :  props.isSelected ? "#0099cc" : "transparent"};
`;

const Label = styled.p`
    font-family: Roboto,sans-serif;
    font-size: 14px;
    color: #000;
`;

const LabelString = styled.p`
    font-family: Roboto,sans-serif;
    font-size: 12px;
    color: #000;
`;

@connect(state => ({
    routs: _get(state.app, "routs"),
    ticketTypes: _get(state.app, "ticketTypes"),
    user: _get(state.app, "user"),
}))
class CreateOrderPopup extends PureComponent {
    defaultState = {
        typeTicket: null,
        rout: null,
        from: null,
        to: null,
        date: new Date(),
        cost: "",
        phone: "",
        fio: "",
        trips: [],
        trip: null,
        spotSheme: [],
        selectedSpots: []
    };

    constructor(props) {
        super(props);
        this.state = typeof props.item === "string" ? this.defaultState : props.item;
    }

    onChangeRout = rout => {
        this.setState({
            rout,
            from: null,
            to: null,
            cars: [],
            car: null,
            spotSheme: [],
            selectedSpots: []
        })
    };

    onChangeFrom = from => {
        this.setState({from},
            () => {
                this.checkCanCreate();
                this.loadTrips();
            });
    };

    onChangeTo = to => {
        this.setState({to},
            () => {
                this.checkCanCreate();
                this.loadTrips();
            });
    };

    onChangeTypeTicket = typeTicket => {
        this.setState({typeTicket}, () => this.checkCanCreate(true));
    };

    onChangeDate = date => {
        this.setState({date},() => this.loadTrips());
    };

    loadTrips = () => {
        const {from, to, rout, date} = this.state;
        if (from && to && rout && date) {
            API.trip.getTripDate(date, rout.value, from.value, to.value)
                .then(response => {
                    const resp = response.data;
                    this.setState({
                        trips: resp,
                        spotSheme: [],
                        selectedSpots: []
                    });
                });
        }
    };

    onChangeTrip = trip => {
        const {rout, from, to} = this.state;
        this.setState({trip}, async () => {
            let spotSheme = await API.trip.getTripSheme(trip.value, rout.value, from.value, to.value)
                .then(response => {return response.data});
            spotSheme = spotSheme.split(',').map(i => parseInt(i));
            this.setState({
                spotSheme,
                selectedSpots: []
            });
        });
    };

    checkCanCreate = async (saveTrip) => {
        const {from, to, typeTicket, rout, trips, trip, spotSheme, selectedSpots} = this.state;
        const {ticketTypes} = this.props;
        if (from && to && typeTicket) {
            const price = await API.price.getPrice(from.value, to.value, rout.value);
            if (!price) {
                toast.error("Перевозка между этими пунктами не осуществляется");
                this.setState({
                    from: null,
                    to: null,
                    trips: [],
                    trip: null,
                    cost: "",
                    spotSheme: [],
                    selectedSpots: []
                });
                return null;
            }
            const typeT = ticketTypes.find(i => i.id === typeTicket.value);
            if (typeT.fix == 1) {
                this.setState({
                    cost: typeT.cost,
                    trips: saveTrip ? trips : [],
                    trip: saveTrip ? trip : null,
                    spotSheme: saveTrip ? spotSheme : [],
                    selectedSpots: saveTrip ? selectedSpots : []
                })
            }
            else {
                this.setState({
                    cost: typeT.cost * parseFloat(price),
                    trips: saveTrip ? trips : [],
                    trip: saveTrip ? trip : null,
                    spotSheme: saveTrip ? spotSheme : [],
                    selectedSpots: saveTrip ? selectedSpots : []
                })
            }
        }
    };

    removeOrAddSpot = spot => {
        const {selectedSpots} = this.state;
        let newSelectedSpots = [...selectedSpots];
        const index = newSelectedSpots.findIndex(i => i.index === spot.index);
        if (index > -1) {
            newSelectedSpots = selectedSpots.filter(i => i.index !== spot.index);
        }
        else {
            newSelectedSpots.push(spot);
        }
        this.setState({selectedSpots: newSelectedSpots});
    };

    render() {
        const {onClose, item, ticketTypes, routs} = this.props;
        const {trips, trip, spotSheme, typeTicket, date, rout, fio, from, to, cost, phone, selectedSpots} = this.state;
        const selectOptionsRouts = routs.map(i => {
            return {value:i.id, label: i.name};
        });
        const selectOptionsTickets = ticketTypes.map(i => {
            return {value:i.id, label: i.name};
        });
        const selectOptionsTrips = trips.map((i, j) => {
            return {value:i.id, label: `Микроавтобус №${j+1}`};
        });
        let selectOptionsLocalities = [];
        if (rout) {
            let selectedRout = routs.find(i => i.id === rout.value);
            if (!selectedRout){
                this.setState({rout: null});
            }
            else {
                selectOptionsLocalities = _orderBy(selectedRout.locations, i => parseInt(i.position))
                    .map(i => {return {value: i.id, label: i.name}});
            }
        }
        return (
            <Popup onClose={onClose}
                   title={typeof item === "string" ? "Новый заказ" : "Редактирование заказа"}
                   buttons={<Button title={"Сохранить"}
                                    height="40px"
                                    onClick={this.edit}/>
                   }>
                <Wrapper>
                    <InfoContainer>
                        <ReactSelect value={rout}
                                     height="40px"
                                     width="100%"
                                     margin={"0 0 8px 0"}
                                     placeholder={"Маршрут"}
                                     onChange={this.onChangeRout}
                                     options={selectOptionsRouts}/>
                        <ReactSelect value={from}
                                     height="40px"
                                     width="100%"
                                     margin={"0 0 8px 0"}
                                     placeholder={"Откуда"}
                                     onChange={this.onChangeFrom}
                                     options={selectOptionsLocalities}/>
                        <ReactSelect value={to}
                                     height="40px"
                                     width="100%"
                                     margin={"0 0 8px 0"}
                                     placeholder={"Куда"}
                                     onChange={this.onChangeTo}
                                     options={[...selectOptionsLocalities].reverse()}/>
                        <CustomDatePicker selected={new Date(date)}
                                          onChange={this.onChangeDate}
                                          height="40px"
                                          width="100%"
                                          title="Дата"
                                          margin={"0 0 8px 0"}
                                          dateFormat="dd.MM.yyyy"/>
                        <ReactSelect value={trip}
                                     height="40px"
                                     width="100%"
                                     margin={"0 0 8px 0"}
                                     placeholder={"Машина"}
                                     onChange={this.onChangeTrip}
                                     options={selectOptionsTrips}/>
                        <Input width="100%"
                               value={fio}
                               onChange={fio => this.setState({phone: fio})}
                               title="ФИО"
                               height="40px"
                               margin={"0 0 8px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={phone}
                               onChange={phone => this.setState({phone})}
                               title="Телефон"
                               height="40px"
                               margin={"0 0 8px 0"}
                               padding="8px 0"/>
                        <ReactSelect value={typeTicket}
                                     height="40px"
                                     width="100%"
                                     margin={"0 0 8px 0"}
                                     placeholder={"Тип билета"}
                                     onChange={this.onChangeTypeTicket}
                                     options={selectOptionsTickets}/>
                        <Input width="100%"
                               value={cost}
                               onChange={cost => this.setState({cost})}
                               title="Стоимость"
                               type={"number"}
                               height="40px"
                               margin={"0 0 8px 0"}
                               padding="8px 0"/>
                    </InfoContainer>
                    <SchemeContainer>
                        <Label>Схема расположения мест</Label>
                        <SchemeContainerWrap>
                            {
                                carSheme.map((row, i) => {
                                    return (
                                        <Row key={i}>
                                            {
                                                row.map((spot, j) => {
                                                    return (
                                                        <Spot key={`${i}-${j}`}
                                                              onClick={() => typeof spot.label === "string" || spotSheme.length === 0 ? null : this.removeOrAddSpot(spot)}
                                                              isDriver={typeof spot.label === "string"}
                                                              isSelected={selectedSpots.find(i => i.index === spot.index)}
                                                              isBusy={spotSheme[spot.index] === 1}>
                                                            {
                                                                typeof spot.label === "string" ?
                                                                    <LabelString>{spot.label}</LabelString>
                                                                    :
                                                                    <Label>{spot.label}</Label>
                                                            }
                                                        </Spot>
                                                    )
                                                })
                                            }
                                        </Row>
                                    )
                                })
                            }
                        </SchemeContainerWrap>
                    </SchemeContainer>
                </Wrapper>
            </Popup>
        )
    }
}

CreateOrderPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    routs: PropTypes.array,
    ticketTypes: PropTypes.array,
    rout: PropTypes.object,
    item: PropTypes.object,
    user: PropTypes.object,
};

export default CreateOrderPopup;
