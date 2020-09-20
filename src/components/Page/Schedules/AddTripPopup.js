import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import CustomDatePicker from "components/Elements/DatePicker";
import ReactSelect from "components/Elements/ReactSelect";
import {connect} from "react-redux";
import _get from "lodash/get";
import {toast} from "react-toastify";
import {API} from "components/API";


@connect(state => ({
    routs: _get(state.app, "routs"),
}))
class AddTripPopup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            rout: null,
            car: null,
            cars: []
        };
    }

    componentDidMount() {
        API.park.getCars(1)
            .then(cars => {
                this.setState({cars});
            })
    }

    create = () => {
        const {onClose, onUpdate} = this.props;
        const {rout, car, date} = this.state;
        if (!rout) {
            toast.warn("Выберите маршрут");
            return;
        }
        if (!car) {
            toast.warn("Выберите водителя");
            return;
        }
        API.trip.createTrip(date, rout.value, car.value)
            .then(() => {
                onClose();
                onUpdate()
            })
    };

    render() {
        const {onClose, routs} = this.props;
        const {cars, rout, car, date} = this.state;
        const selectOptions = routs.map(i => {
            return {value:i.id, label: i.name};
        });
        const selectOptionsCar = cars.map(i => {
            return {value:i.id, label: i.voditel};
        });
        return (
            <Popup onClose={onClose}
                   title={"Новый рейс"}
                   buttons={
                       <Button title={"Создать рейс"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <CustomDatePicker selected={date}
                                  onChange={date => this.setState({date})}
                                  height="40px"
                                  width="100%"
                                  margin={"0 0 16px 0"}
                                  dateFormat="dd.MM.yyyy"/>
                <ReactSelect value={rout}
                             height="40px"
                             width="220px"
                             margin={"0 0 16px 0"}
                             placeholder={"Выберите маршрут"}
                             onChange={value => this.setState({rout: value})}
                             options={selectOptions}/>
                <ReactSelect value={car}
                             height="40px"
                             width="220px"
                             placeholder={"Выберите водителя"}
                             onChange={value => this.setState({car: value})}
                             options={selectOptionsCar}/>
            </Popup>
        )
    }
}

AddTripPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    routs: PropTypes.array,
};

export default AddTripPopup;
