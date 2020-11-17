import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import {connect} from "react-redux";
import _get from "lodash/get";
import {API} from "components/API";
import styled from "styled-components";
import Table from "components/Elements/Table";
import {toast} from "react-toastify";
import Input from "components/Elements/Input";
import Close from "components/Icons/Close";
import ArrowTop from "components/Icons/ArrowTop";

const TablesWrapper = styled.div`
    width: 100%;
    display: flex;
    max-height: 400px;
    justify-content: space-between;
    margin-top: 24px;
`;

const TableWrapper = styled.div`
    width: 350px;
    display: flex;
    flex-direction: column;
    max-height: 400px;
    overflow-y: auto;
`;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const ValuesWrapper = styled.div`
    width: 100%;
    display: flex;
`;

const TableW = styled.div`
    width: 350px;
    display: flex;
    flex-direction: column;
`;

const HeaderTable = styled.p`
    font-family: Roboto,sans-serif;
    font-size: 18px; 
    color: #000;
    width: 100%;
    text-align: center;
`;

const ActionContainer = styled.div`
    display: flex;
`;

const ArrowWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
    margin-top: 150px;
`;

const ArrowIconWrapper = styled.div`
    padding: 2px;
    cursor: pointer;
    
    svg {
        width: 30px;
    }
`;

const ArrowIconWrapperRotate = styled.div`
    padding: 2px;
    transform: rotate(180deg);
    
    svg {
        width: 30px;
    }
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    cursor: pointer;
    
    &:hover {
        border: 1px solid #cdcdcd;
        border-radius: 3px;
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`;


@connect(state => ({
    user: _get(state.app, "user"),
}))
class EditRoutsPopup extends PureComponent {
    defaultState = {
        id: null,
        name: "",
        url_map: "",
        locations: [],
        selectedIndex: 0
    };

    constructor(props) {
        super(props);
        this.state = typeof props.item === "string" ? this.defaultState :
            {
                ...props.item,
                selectedIndex: 0
            };
        this.load();
    }

    load = async() => {
        await API.rout.getAllLocality()
            .then(response => {
                const resp = response.data;
                this.setState({localitiesDictionary: resp});
            })
    };

    create = async() => {
        const {onClose, onUpdate, item} = this.props;
        const {name, url_map, locations, id} = this.state;

        if (!name) {
            toast.warn("Введите название маршрута");
            return;
        }
        if (!url_map) {
            toast.warn("Введите ссылку на карту");
            return;
        }
        if (locations.length < 2) {
            toast.warn("Укажите минимум 2 промежуточных пункта");
            return;
        }

        if (typeof item !== "string"){
            await API.rout.edit({
                id,
                name,
                url_map,
                locations
            });
            toast.success("Маршрут создан");
        }
        else {
            await API.rout.create({
                name,
                url_map,
                locations
            });
            toast.success("Маршрут создан");
        }
        onClose();
        onUpdate();
    };

    columns = [
        {
            name: "name",
            title: "Название",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "actions",
            title: "",
            justifyContent: "center",
            flex: "0 0 70px"
        }
    ];

    columnsDictionary = [
        {
            name: "name",
            title: "Название",
            justifyContent: "center",
            flex: "1 0 150px"
        }
    ];

    removeLocality = index => {
        const {locations} = this.state;
        const loc = locations.filter((i, j) => j !== index);
        this.setState({locations: loc});
    };

    addLocality = item => {
        const {locations} = this.state;
        const loc = [...locations];
        loc.push(item);
        this.setState({locations: loc});
    };

    indexTop = () => {
        let {locations, selectedIndex} = this.state;
        if (selectedIndex === 0)
            return;

        locations.splice(selectedIndex-1, 0, locations[selectedIndex]);
        let locat = locations.filter((i, j) => j !== selectedIndex + 1);
        this.setState({
            locations: locat,
            selectedIndex: selectedIndex-1
        });
    };

    indexBottom = () => {
        let {locations, selectedIndex} = this.state;
        if (selectedIndex === locations.length-1)
            return;

        locations.splice(selectedIndex+2, 0, locations[selectedIndex]);
        let locat = locations.filter((i, j) => j !== selectedIndex);
        this.setState({
            locations: locat,
            selectedIndex: selectedIndex+1
        });
    };

    render() {
        const {onClose, item} = this.props;
        let {name, url_map, locations, localitiesDictionary = [], selectedIndex} = this.state;

        locations = locations.map((item, i) => {
            return {
                ...item,
                isActive: selectedIndex === i,
                rowClick: e => e.target.closest('.ignoreEvents') ? null : this.setState({selectedIndex: i}),
                actions: <ActionContainer>
                        <IconContainer onClick={() => this.removeLocality(i)}
                                       className="ignoreEvents">
                            <Close/>
                        </IconContainer>
                    </ActionContainer>
            }
        });

        localitiesDictionary = localitiesDictionary.map((item) => {
            return {
                ...item,
                doubleClick: () => this.addLocality(item)
            }
        });

        return (
            <Popup onClose={onClose}
                   title={typeof item === "string" ? "Добавить маршрут" : "Редактировать маршрут"}
                   width={"800px"}
                   buttons={
                       <Button title={"Сохранить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <Wrapper>
                    <ValuesWrapper>
                        <Input width="40%"
                               value={name}
                               onChange={name => this.setState({name})}
                               title="Название"
                               height="40px"
                               padding="8px 0"/>
                        <Input width="60%"
                               value={url_map}
                               onChange={url_map => this.setState({url_map})}
                               title="Ссылка на карту"
                               height="40px"
                               margin={"0 0 0 8px"}
                               padding="8px 0"/>
                    </ValuesWrapper>
                    <TablesWrapper>
                        <TableW>
                            <HeaderTable>Промежуточные пункты</HeaderTable>
                            <TableWrapper>
                                <Table columns={this.columns}
                                       items={locations}/>
                            </TableWrapper>
                        </TableW>
                        <ArrowWrapper>
                            <ArrowIconWrapper onClick={this.indexTop}>
                                <ArrowTop/>
                            </ArrowIconWrapper>
                            <ArrowIconWrapperRotate onClick={this.indexBottom}>
                                <ArrowTop/>
                            </ArrowIconWrapperRotate>
                        </ArrowWrapper>
                        <TableW>
                            <HeaderTable>Справочник</HeaderTable>
                            <TableWrapper>
                                <Table columns={this.columnsDictionary}
                                       items={localitiesDictionary || []}/>
                            </TableWrapper>
                        </TableW>
                    </TablesWrapper>
                </Wrapper>
            </Popup>
        )
    }
}

EditRoutsPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default EditRoutsPopup;
