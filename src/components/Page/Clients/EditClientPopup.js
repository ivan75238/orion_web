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

@connect(state => ({
    user: _get(state.app, "user"),
}))
class EditClientPopup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = props.item;
    }

    create = async() => {
        const {onClose, onUpdate} = this.props;
        const {fio, date, phone, email, id} = this.state;

        if (!fio) {
            toast.warn("Введите ФИО");
            return;
        }
        if (!date) {
            toast.warn("Выберите дату рождения");
            return;
        }
        if (!phone) {
            toast.warn("Введите номер телефона");
            return;
        }
        await API.client.edit(
            id,
            fio,
            date,
            phone,
            email ? email : "нет информации"
        );
        toast.success("Изменения сохранены");
        onClose();
        onUpdate();
    };

    render() {
        const {onClose} = this.props;
        const {fio, date, phone, email} = this.state;

        return (
            <Popup onClose={onClose}
                   title={"Редактирование клиента"}
                   width={"400px"}
                   buttons={
                       <Button title={"Сохранить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <Input width="100%"
                       value={fio}
                       onChange={fio => this.setState({fio})}
                       title="ФИО"
                       height="40px"
                       margin={"0 0 16px 0"}
                       padding="8px 0"/>
                <Input width="100%"
                       value={phone}
                       onChange={phone => this.setState({phone})}
                       title="Телефон"
                       height="40px"
                       margin={"0 0 16px 0"}
                       padding="8px 0"/>
                <Input width="100%"
                       value={email}
                       onChange={email => this.setState({email})}
                       title="Email"
                       height="40px"
                       margin={"0 0 16px 0"}
                       padding="8px 0"/>
                <CustomDatePicker selected={new Date(date)}
                                  onChange={date => this.setState({date})}
                                  height="40px"
                                  width="100%"
                                  title="Дата рождения"
                                  margin={"0 0 16px 0"}
                                  dateFormat="dd.MM.yyyy"/>
            </Popup>
        )
    }
}

EditClientPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default EditClientPopup;
