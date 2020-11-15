import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import {connect} from "react-redux";
import _get from "lodash/get";
import {toast} from "react-toastify";
import {API} from "components/API";
import Input from "components/Elements/Input";
import Checkbox from "react-simple-checkbox";
import styled from "styled-components";

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
class EditTipeTicketPopup extends PureComponent {
    defaultState = {
        id: null,
        name: "",
        price: "",
        fixed: false
    };

    constructor(props) {
        super(props);
        this.state = typeof props.item === "string" ?
            this.defaultState
        :
            {
                ...props.item,
                price: props.item.cost,
                fixed: props.item.fix === "1",
            }
    }

    create = async() => {
        const {onClose, onUpdate, item,} = this.props;
        const {name, price, fixed, id} = this.state;

        if (!name) {
            toast.warn("Введите наименование");
            return;
        }
        if (fixed) {
            if (!price) {
                toast.warn("Введите стоимость билета");
                return;
            }
        }
        else {
            if (!price) {
                toast.warn("Введите долю стоимости билета");
                return;
            }
            else {
                let priceFloat = parseFloat(price);
                if (priceFloat > 1 || priceFloat < 0 || priceFloat === 0) {
                    toast.warn("Доля должна быть больше 0 и меньше 1");
                    return;
                }
            }
        }

        if (typeof item !== "string"){
            await API.bilet.edit({
                name,
                price,
                fixed: fixed ? 1 : 0,
                id
            });
            toast.success("Тип билета обновлен");
        }
        else {
            await API.bilet.create({
                name,
                price,
                fixed: fixed ? 1 : 0,
            });
            toast.success("Тип билета добавлен");
        }
        onClose();
        onUpdate();
    };

    render() {
        const {onClose, item} = this.props;
        const {name, price, fixed} = this.state;

        return (
            <Popup onClose={onClose}
                   title={typeof item === "string" ? "Добавить тип билета" : "Редактировать тип билета"}
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
                       padding="8px 0"/>
                <LabelBox>
                    <Label>Фиксированная цена</Label>
                    <Checkbox checked={fixed}
                              onChange={fixed => this.setState({fixed})}/>
                </LabelBox>
                <Input width="100%"
                       value={price}
                       onChange={price => this.setState({price})}
                       title={fixed ? "Цена" : "Доля от стоимости билета"}
                       type="number"
                       height="40px"
                       padding="8px 0"/>
            </Popup>
        )
    }
}

EditTipeTicketPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default EditTipeTicketPopup;
