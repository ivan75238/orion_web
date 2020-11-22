import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import ReactSelect from "components/Elements/ReactSelect";
import {connect} from "react-redux";
import {toast} from "react-toastify";
import {API} from "components/API";
import styled from "styled-components";
import _get from "lodash/get";
import Button from "components/Elements/Button";

const Wrapper = styled.div`
    display: flex;
    align-item:center;
    justify-content: flex-start;
`;

const SchemeContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 350px;
    margin-right: 16px;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    background: ${props => props.isBusy ? "#cecece" : "transparent"};
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

export const carSheme = [
    [
        {
            index: 9,
            label: 10,
            isDriver: false
        },
        {
            index: 6,
            label: 7,
            isDriver: false
        },
        {
            index: 3,
            label: 4,
            isDriver: false
        },
        {
            index: 0,
            label: 1,
            isDriver: false
        },
        {
            index: -1,
            label: "Водитель",
            isDriver: true
        }
    ],
    [
        {
            index: 10,
            label: 11,
            isDriver: false
        },
        {
            index: 7,
            label: 8,
            isDriver: false
        },
        {
            index: 4,
            label: 5,
            isDriver: false
        },
        {
            index: 1,
            label: 2,
            isDriver: false
        }
    ],
    [
        {
            index: 11,
            label: 12,
            isDriver: false
        },
        {
            index: 8,
            label: 9,
            isDriver: false
        },
        {
            index: 5,
            label: 6,
            isDriver: false
        },
        {
            index: 2,
            label: 3,
            isDriver: false
        },
        {
            index: 12,
            label: 14,
            isDriver: false
        }
    ],
];

@connect(state => ({
    routs: _get(state.app, "routs"),
    user: _get(state.app, "user"),
}))
class EditTripPopup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            car: null,
            cars: [],
            spotSheme: []
        };
    }

    componentDidMount() {
        this.load();
    }

    load = async() => {
        const {item, rout} = this.props;
        const cars = await API.park.getCars(1)
                .then(response => {return response.data});
        let spotSheme = await API.trip.getTripSheme(item.id, rout.id, rout.locations[0].id, rout.locations[rout.locations.length-1].id)
                .then(response => {return response.data});
        spotSheme = spotSheme.split(',').map(i => parseInt(i));
        this.setState({
            cars,
            spotSheme
        });
    };

    edit = async() => {
        const {onClose, onUpdate} = this.props;
        const {car} = this.state;
        const {item} = this.props;

        if (!car) {
            toast.warn("Выберите водителя");
            return;
        }

        API.trip.setDriver(item.id, car.value, item.id_car)
            .then(() => {
                onClose();
                onUpdate()
            })
    };

    render() {
        const {onClose, item} = this.props;
        const {cars, car, spotSheme} = this.state;
        const selectOptionsCar = cars.map(i => {
            return {value:i.id, label: i.voditel};
        });
        let selectedCar = null;
        if (car) {
            selectedCar = cars.find(i => i.id === car.value);
        }
        return (
            <Popup onClose={onClose}
                   title={"Изменить водителя"}
                   buttons={null}>
                <Wrapper>
                    <SchemeContainer>
                        {
                            carSheme.map((row, i) => {
                                return (
                                    <Row key={i}>
                                        {
                                            row.map((spot, j) => {
                                                return (
                                                    <Spot key={`${i}-${j}`}
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
                    </SchemeContainer>
                    <InfoContainer>
                        <Label style={{marginBottom: 8}}>{item.busName}</Label>
                        <ReactSelect value={car}
                                     height="40px"
                                     width="220px"
                                     margin={"0 0 8px 0"}
                                     placeholder={"Выберите водителя"}
                                     onChange={value => this.setState({car: value})}
                                     options={selectOptionsCar}/>
                        <Label style={{marginBottom: 8}}>{`Гос. номер: ${_get(selectedCar, "gos_nomer", "-")}`}</Label>
                        <Button title={"Сохранить"}
                                height="40px"
                                onClick={this.edit}/>
                    </InfoContainer>
                </Wrapper>
            </Popup>
        )
    }
}

EditTripPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    routs: PropTypes.array,
    rout: PropTypes.object,
    item: PropTypes.object,
    user: PropTypes.object,
};

export default EditTripPopup;
