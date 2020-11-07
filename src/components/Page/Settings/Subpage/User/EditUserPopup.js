import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import {connect} from "react-redux";
import _get from "lodash/get";
import {toast} from "react-toastify";
import {API} from "components/API";
import Input from "components/Elements/Input";
import ReactSelect from "components/Elements/ReactSelect";

const roles = [
    {value: 0, label: "Диспетчер"},
    {value: 1, label: "Администратор"},
];

@connect(state => ({
    user: _get(state.app, "user"),
}))
class EditUserPopup extends PureComponent {
    defaultState = {
        id: null,
        name: "",
        role: null,
        pass: ""
    };

    constructor(props) {
        super(props);
        this.state = typeof props.item === "string" ? this.defaultState : props.item;
    }

    create = async() => {
        const {onClose, onUpdate, item} = this.props;
        const {id, name, role, pass} = this.state;

        if (!name) {
            toast.warn("Введите ФИО");
            return;
        }
        if (role === null) {
            toast.warn("Выберите роль");
            return;
        }

        if (typeof item !== "string"){
            await API.user.edit({
                id,
                name,
                role,
                pass
            });
        }
        else {
            await API.user.create({
                name,
                role,
                pass
            });
        }
        onClose();
        onUpdate();
    };

    render() {
        const {onClose, item} = this.props;
        const {name, role, pass} = this.state;

        return (
            <Popup onClose={onClose}
                   title={typeof item === "string" ? "Новый пользователь" : "Редактировать пользователя"}
                   width={"300px"}
                   buttons={
                       <Button title={"Добавить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <Input width="100%"
                       value={name}
                       onChange={name => this.setState({name})}
                       title="ФИО"
                       height="40px"
                       margin={"0 0 16px 0"}
                       padding="8px 0"/>
                <Input width="100%"
                       value={pass}
                       onChange={pass => this.setState({pass})}
                       title="Пароль"
                       height="40px"
                       margin={"0 0 16px 0"}
                       padding="8px 0"/>
                <ReactSelect value={roles.find(i => i.value === parseInt(role))}
                             height="40px"
                             width="100%"
                             placeholder={"Роль пользователя"}
                             onChange={role => this.setState({role: role.value})}
                             options={roles}/>
            </Popup>
        )
    }
}

EditUserPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default EditUserPopup;
