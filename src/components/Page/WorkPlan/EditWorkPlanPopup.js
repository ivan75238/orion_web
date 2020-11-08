import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import {connect} from "react-redux";
import _get from "lodash/get";
import {toast} from "react-toastify";
import {API} from "components/API";
import Input from "components/Elements/Input";
import CustomDatePicker from "components/Elements/DatePicker";
import styled from "styled-components";
import moment from "moment";

const ColumnWrapper = styled.div`
    display: flex;
    width: 100%;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: 0 4px;
`;

@connect(state => ({
    user: _get(state.app, "user"),
}))
class EditWorkPlanPopup extends PureComponent {
    defaultState = {
        id: null,
        year: new Date(),
        january: "",
        february: "",
        march: "",
        april: "",
        may: "",
        june: "",
        july: "",
        august: "",
        september: "",
        october: "",
        november: "",
        december: "",
    };

    constructor(props) {
        super(props);
        this.state = typeof props.item === "string" ? this.defaultState : props.item;
    }

    create = async() => {
        const {onClose, onUpdate, item} = this.props;
        const {
            id, year, january, february, march, april, may,
            june, july, august, september, october, november, december
        } = this.state;

        if (!year) {
            toast.warn("Выберите планируемый год");
            return;
        }

        if (
            !january || !february || !march || !april || !may || !june || !july || !august ||
            !september || !october || !november || !december
        ) {
            toast.warn("Заполните все месяца");
            return;
        }

        if (typeof item !== "string"){
            await API.workPlan.edit({
                year: moment(year).format("YYYY-MM-DD HH:mm:ss"),
                id, january, february, march, april, may,
                june, july, august, september, october, november, december
            });
        }
        else {
            await API.workPlan.create({
                year: moment(year).format("YYYY-MM-DD HH:mm:ss"),
                january, february, march, april, may,
                june, july, august, september, october, november, december
            });
        }
        onClose();
        onUpdate();
    };

    render() {
        const {onClose, item} = this.props;
        const {year, january, february, march, april, may,
            june, july, august, september, october, november, december} = this.state;

        return (
            <Popup onClose={onClose}
                   title={typeof item === "string" ? "Новый план" : "Редактирование плана"}
                   width={"660px"}
                   buttons={
                       <Button title={"Сохранить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <CustomDatePicker selected={new Date(year)}
                                  onChange={year => this.setState({year})}
                                  height="40px"
                                  width="200px"
                                  title={"Планируемый год"}
                                  margin={"0 0 16px 4px"}
                                  format="yyyy"/>
                <ColumnWrapper>
                    <Column>
                        <Input width="100%"
                               value={january}
                               onChange={january => this.setState({january})}
                               title="Январь"
                               height="40px"
                               type="number"
                               margin={"0 0 16px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={february}
                               onChange={february => this.setState({february})}
                               title="Февраль"
                               height="40px"
                               type="number"
                               margin={"0 0 16px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={march}
                               onChange={march => this.setState({march})}
                               title="Март"
                               height="40px"
                               type="number"
                               margin={"0 0 16px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={april}
                               onChange={april => this.setState({april})}
                               title="Апрель"
                               height="40px"
                               type="number"
                               margin={"0 0 16px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={may}
                               onChange={may => this.setState({may})}
                               title="Май"
                               height="40px"
                               type="number"
                               margin={"0 0 16px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={june}
                               onChange={june => this.setState({june})}
                               title="Июнь"
                               height="40px"
                               type="number"
                               margin={"0 0 0 0"}
                               padding="8px 0"/>
                    </Column>
                    <Column>
                        <Input width="100%"
                               value={july}
                               onChange={july => this.setState({july})}
                               title="Июль"
                               height="40px"
                               type="number"
                               margin={"0 0 16px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={august}
                               onChange={august => this.setState({august})}
                               title="Август"
                               height="40px"
                               type="number"
                               margin={"0 0 16px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={september}
                               onChange={september => this.setState({september})}
                               title="Сентябрь"
                               height="40px"
                               type="number"
                               margin={"0 0 16px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={october}
                               onChange={october => this.setState({october})}
                               title="Октябрь"
                               height="40px"
                               type="number"
                               margin={"0 0 16px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={november}
                               onChange={november => this.setState({november})}
                               title="Ноябрь"
                               height="40px"
                               type="number"
                               margin={"0 0 16px 0"}
                               padding="8px 0"/>
                        <Input width="100%"
                               value={december}
                               onChange={december => this.setState({december})}
                               title="Декабрь"
                               height="40px"
                               type="number"
                               margin={"0 0 0 0"}
                               padding="8px 0"/>
                    </Column>
                </ColumnWrapper>
            </Popup>
        )
    }
}

EditWorkPlanPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default EditWorkPlanPopup;
