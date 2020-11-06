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
    user: _get(state.app, "user"),
}))
class EditNewsPopup extends PureComponent {
    defaultState = {
        id: null,
        datePublish: new Date(),
    };

    constructor(props) {
        super(props);
        this.state = props.openPopup === "new" ? this.defaultState : this.load();
    }

    load() {
        //ToDo: Временно возвращаем defaultState
        return this.defaultState;
    }

    create = async() => {
        const {onClose, onUpdate} = this.props;
        const {id} = this.state;
    };

    render() {
        const {onClose} = this.props;
        const {id, datePublish} = this.state;

        return (
            <Popup onClose={onClose}
                   title={id ? "Добавить новость" : "Редактировать новость"}
                   buttons={
                       <Button title={"Добавить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <CustomDatePicker selected={datePublish}
                                  onChange={datePublish => this.setState({datePublish})}
                                  height="40px"
                                  width="100%"
                                  margin={"0 0 16px 0"}
                                  dateFormat="dd.MM.yyyy"/>
            </Popup>
        )
    }
}

EditNewsPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
};

export default EditNewsPopup;
