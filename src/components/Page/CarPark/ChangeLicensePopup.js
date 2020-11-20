import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import CustomDatePicker from "components/Elements/DatePicker";
import {connect} from "react-redux";
import _get from "lodash/get";
import {toast} from "react-toastify";
import {API} from "components/API";

@connect(state => ({
    user: _get(state.app, "user"),
}))
class ChangeLicensePopup extends PureComponent {

    constructor(props) {
        super(props);
        this.state = props.item;
    }

    create = async() => {
        const {onClose, onUpdate} = this.props;
        const {arenda_nach, arenda_konec, id} = this.state;

        if (!arenda_nach) {
            toast.warn("Выберите дату начала аренды");
            return;
        }
        if (!arenda_konec) {
            toast.warn("Выберите дату завершения аренды");
            return;
        }

        await API.park.renewLease(id, arenda_nach, arenda_konec);
        toast.success("Изменения сохранены");
        onClose();
        onUpdate();
    };

    render() {
        const {onClose} = this.props;
        const {arenda_nach, arenda_konec} = this.state;

        return (
            <Popup onClose={onClose}
                   title={"Продление аренды"}
                   width={"400px"}
                   buttons={
                       <Button title={"Изменить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <CustomDatePicker selected={new Date(arenda_nach)}
                                  onChange={arenda_nach => this.setState({arenda_nach})}
                                  height="40px"
                                  width="100%"
                                  title="Начало аренды"
                                  margin={"16px 0 0 0"}
                                  dateFormat="dd.MM.yyyy"/>
                <CustomDatePicker selected={new Date(arenda_konec)}
                                  onChange={arenda_konec => this.setState({arenda_konec})}
                                  height="40px"
                                  width="100%"
                                  title="Завершение аренды"
                                  margin={"16px 0 0 0"}
                                  dateFormat="dd.MM.yyyy"/>
            </Popup>
        )
    }
}

ChangeLicensePopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default ChangeLicensePopup;
