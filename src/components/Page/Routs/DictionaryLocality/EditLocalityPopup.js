import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import {connect} from "react-redux";
import _get from "lodash/get";
import {toast} from "react-toastify";
import {API} from "components/API";
import Input from "components/Elements/Input";


@connect(state => ({
    user: _get(state.app, "user"),
}))
class EditLocalityPopup extends PureComponent {
    defaultState = {
        id: null,
        name: "",
    };

    constructor(props) {
        super(props);
        this.state = typeof props.item === "string" ? this.defaultState : props.item;
    }

    create = async() => {
        const {onClose, onUpdate, item} = this.props;
        const {name, id} = this.state;

        if (!name) {
            toast.warn("Введите название пункта");
            return;
        }

        if (typeof item !== "string"){
            await API.rout.editLocality({
                name,
                id
            });
            toast.success("Изменения сохранены");
        }
        else {
            await API.rout.createLocality({
                name
            });
            toast.success("Пункт добавлен");
        }
        onClose();
        onUpdate();
    };

    render() {
        const {onClose, item} = this.props;
        const {name} = this.state;

        return (
            <Popup onClose={onClose}
                   title={typeof item === "string" ? "Добавить пункт" : "Редактировать пункт"}
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
                       height="40px"/>
            </Popup>
        )
    }
}

EditLocalityPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default EditLocalityPopup;
