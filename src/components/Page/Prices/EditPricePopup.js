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
class EditPricePopup extends PureComponent {

    constructor(props) {
        super(props);
        this.state = props.item;
    }

    create = async() => {
        const {onClose, onUpdate} = this.props;
        const {cost, id} = this.state;

        if (!cost) {
            toast.warn("Введите новую стоимость");
            return;
        }

        await API.price.set(id, cost);
        toast.success("Изменения сохранены");
        onClose();
        onUpdate();
    };

    render() {
        const {onClose} = this.props;
        const {cost} = this.state;

        return (
            <Popup onClose={onClose}
                   title={"Изменение стоимости"}
                   width={"400px"}
                   buttons={
                       <Button title={"Изменить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <Input width="100%"
                       value={cost}
                       onChange={cost => this.setState({cost})}
                       title="Новая стоимость"
                       type="number"
                       height="40px"/>
            </Popup>
        )
    }
}

EditPricePopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default EditPricePopup;
