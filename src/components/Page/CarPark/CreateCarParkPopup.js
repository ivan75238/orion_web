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
import Checkbox from "react-simple-checkbox";
import styled from "styled-components";
import moment from "moment";

const LabelBox = styled.div`
    display: flex;
    height: 36px;
    align-items: center;
    margin-bottom: 8px;
    
    .Checkbox {
        top: unset;
    }
`;

const Label = styled.p`
    margin-right: 8px;
    font-family: Roboto,sans-serif;
    font-size: 12px;
    color: #000;
`;

@connect(state => ({
    user: _get(state.app, "user"),
}))
class CreateCarParkPopup extends PureComponent {
    defaultState = {
        marka: "",
        gos_nomer: "",
        voditel: "",
        tech_obsyzh: false,
        arenda_nach: moment().format(),
        arenda_konec: moment().format(),
    };

    constructor(props) {
        super(props);
        this.state = typeof props.item === "string" ? this.defaultState :
            {
                ...props.item,
                tech_obsyzh: props.item.tech_obsyzh === "1" ? true : false
            };
    }

    create = async() => {
        const {onClose, onUpdate, item} = this.props;
        const {marka, gos_nomer, teh_obslyzh, voditel, arenda_nach, arenda_konec, id} = this.state;

        if (!marka) {
            toast.warn("Введите марку автомобиля");
            return;
        }
        if (!gos_nomer) {
            toast.warn("Введите гос. номер автомобиля");
            return;
        }
        if (!voditel) {
            toast.warn("Введите ФИО водителя");
            return;
        }
        if (!arenda_nach) {
            toast.warn("Выберите дату начала аренды");
            return;
        }
        if (!arenda_konec) {
            toast.warn("Выберите дату завершения аренды");
            return;
        }
        if (typeof item !== "string") {
            await API.park.edit(
                id,
                marka,
                gos_nomer,
                teh_obslyzh ? "1" : "0",
                voditel,
                arenda_nach,
                arenda_konec
            );
        }
        else {
            await API.park.create(
                marka,
                gos_nomer,
                teh_obslyzh ? "1" : "0",
                voditel,
                arenda_nach,
                arenda_konec
            );
        }
        toast.success("Изменения сохранены");
        onClose();
        onUpdate();
    };

    render() {
        const {onClose, item} = this.props;
        const {marka, gos_nomer, teh_obslyzh, voditel, arenda_nach, arenda_konec} = this.state;

        return (
            <Popup onClose={onClose}
                   title={typeof item === "string" ? "Новый водитель" : "Редактирование водителя"}
                   width={"400px"}
                   buttons={
                       <Button title={"Добавить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <Input width="100%"
                       value={voditel}
                       onChange={voditel => this.setState({voditel})}
                       title="ФИО водителя"
                       height="40px"
                       margin={"0 0 16px 0"}
                       padding="8px 0"/>
                <Input width="100%"
                       value={marka}
                       onChange={marka => this.setState({marka})}
                       title="Марка"
                       height="40px"
                       margin={"0 0 16px 0"}
                       padding="8px 0"/>
                <Input width="100%"
                       value={gos_nomer}
                       onChange={gos_nomer => this.setState({gos_nomer})}
                       title="Гос. номер"
                       height="40px"
                       margin={"0 0 16px 0"}
                       padding="8px 0"/>
                <LabelBox>
                    <Label>Тех. обслуживание</Label>
                    <Checkbox checked={teh_obslyzh}
                              onChange={teh_obslyzh => this.setState({teh_obslyzh})}/>
                </LabelBox>
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

CreateCarParkPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default CreateCarParkPopup;
