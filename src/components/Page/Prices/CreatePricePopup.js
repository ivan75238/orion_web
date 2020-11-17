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


@connect(state => ({
    routs: _get(state.app, "routs"),
    user: _get(state.app, "user"),
}))
class CreatePricePopup extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            otkyda: null,
            kyda: null,
            cost: "",
            rout: null
        };
    }

    create = async() => {
        const {onClose, onUpdate} = this.props;
        const {cost, rout, kyda, otkyda} = this.state;

        if (!rout) {
            toast.warn("Выберите маршрут");
            return;
        }

        if (!otkyda) {
            toast.warn("Выберите начальный пункт");
            return;
        }

        if (!kyda) {
            toast.warn("Выберите конечныйпункт");
            return;
        }

        if (!cost) {
            toast.warn("Введите стоимость");
            return;
        }

        await API.price.create({
            id_marsh: rout.value,
            otkyda: otkyda.value,
            kyda: kyda.value,
            cost
        });
        toast.success("Изменения сохранены");
        onClose();
        onUpdate();
    };

    render() {
        const {onClose, routs} = this.props;
        const {cost, rout, kyda, otkyda} = this.state;

        const selectRoutOptions = routs.map(i => {
            return {value:i.id, label: i.name};
        });

        let selectKydaOptions = [], selectOtkydaOptions = [];

        if (rout) {
            const rr = routs.find(i => i.id === rout.value);
            selectOtkydaOptions = rr.locations.map(i => {
                return {value:i.id, label: i.name};
            });
            selectKydaOptions = rr.locations.map(i => {
                return {value:i.id, label: i.name};
            }).reverse();
        }

        return (
            <Popup onClose={onClose}
                   title={"Изменение стоимости"}
                   width={"400px"}
                   buttons={
                       <Button title={"Изменить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <ReactSelect value={rout}
                             height="40px"
                             width="100%"
                             margin={"0 0 16px 0"}
                             placeholder={"Маршрут"}
                             onChange={value => this.setState({rout: value, otkyda: null, kyda: null})}
                             options={selectRoutOptions}/>
                <ReactSelect value={otkyda}
                             height="40px"
                             width="100%"
                             margin={"0 0 16px 0"}
                             placeholder={"Откуда"}
                             onChange={value => this.setState({otkyda: value})}
                             options={selectOtkydaOptions}/>
                <ReactSelect value={kyda}
                             height="40px"
                             width="100%"
                             margin={"0 0 16px 0"}
                             placeholder={"Куда"}
                             onChange={value => this.setState({kyda: value})}
                             options={selectKydaOptions}/>
                <Input width="100%"
                       value={cost}
                       onChange={cost => this.setState({cost})}
                       title="Стоимость"
                       type="number"
                       height="40px"/>
            </Popup>
        )
    }
}

CreatePricePopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    routs: PropTypes.array,
};

export default CreatePricePopup;
