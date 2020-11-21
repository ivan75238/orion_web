import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import CustomDatePicker from "components/Elements/DatePicker";
import {connect} from "react-redux";
import _get from "lodash/get";
import {toast} from "react-toastify";
import {API} from "components/API";
import Input from "components/Elements/Input";
import moment from "moment";

@connect(state => ({
    user: _get(state.app, "user"),
}))
class CreateStockPopup extends PureComponent {
    defaultState = {
        name: "",
        data_nach: moment().format(),
        data_konec: moment().format(),
        cost: 0
    };

    constructor(props) {
        super(props);
        this.state = typeof props.item === "string" ? this.defaultState : props.item;
    }

    create = async() => {
        const {onClose, onUpdate, item} = this.props;
        const {name, data_nach, data_konec, cost, id} = this.state;

        if (!name) {
            toast.warn("Введите название акции");
            return;
        }
        if (!data_nach) {
            toast.warn("Выберите дату начала");
            return;
        }
        if (!data_konec) {
            toast.warn("Выберите дату завершения");
            return;
        }
        if (typeof item !== "string") {
            await API.stock.edit(
                id,
                name,
                data_nach,
                data_konec,
                cost
            );
        }
        else {
            await API.stock.create(
                name,
                data_nach,
                data_konec,
                cost
            );
        }
        toast.success("Изменения сохранены");
        onClose();
        onUpdate();
    };

    render() {
        const {onClose, item} = this.props;
        const {name, data_nach, data_konec, cost} = this.state;

        return (
            <Popup onClose={onClose}
                   title={typeof item === "string" ? "Новая акция" : "Редактирование акции"}
                   width={"400px"}
                   buttons={
                       <Button title={"Добавить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <Input width="100%"
                       value={name}
                       onChange={name => this.setState({name})}
                       title="Название"
                       height="40px"
                       margin={"0 0 16px 0"}
                       padding="8px 0"/>
                <CustomDatePicker selected={new Date(data_nach)}
                                  onChange={data_nach => this.setState({data_nach})}
                                  height="40px"
                                  width="100%"
                                  title="Начало"
                                  margin={"0 0 16px 0"}
                                  dateFormat="dd.MM.yyyy"/>
                <CustomDatePicker selected={new Date(data_konec)}
                                  onChange={data_konec => this.setState({data_konec})}
                                  height="40px"
                                  width="100%"
                                  title="Конец"
                                  margin={"0 0 16px 0"}
                                  dateFormat="dd.MM.yyyy"/>
                <Input width="100%"
                       value={cost}
                       type={"number"}
                       onChange={cost => this.setState({cost})}
                       title="Стоимость билета"
                       height="40px"
                       padding="8px 0"/>
            </Popup>
        )
    }
}

CreateStockPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default CreateStockPopup;
