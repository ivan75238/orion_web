import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import CustomDatePicker from "components/Elements/DatePicker";
import _get from "lodash/get";
import ReactSelect from "components/Elements/ReactSelect";
import Button from "components/Elements/Button";
import {toast} from "react-toastify";
import Table from "components/Elements/Table";
import {CheckStatus} from "components/functions";
import {API} from "../../API";
import CreateOrderPopup from "./CreateOrderPopup";

const ContentWrapper = styled.div`
    width: 100%;
`;

const Header = styled.div`
    width: 100%;
    padding: 8px;
    border-bottom: 1px solid #cdcdcd;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Filters = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const Body = styled.div`
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 238px);
    overflow-x: auto;
    position: relative;
`;

const Status = styled.div`
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    background: ${props => switchBackgroundColor(props.status)};    
    color: ${props => switchColor(props.status)};    
    border: 1px solid ${props => switchBorderColor(props.status)};   
    border-radius: 5px; 
`;

function switchBackgroundColor(status) {
    switch(status) {
        case "0":
            return "rgba(209, 205, 23, 0.5)";
        case "1":
            return "rgba(52, 235, 168, 0.5)";
        case "2":
            return "rgba(10, 110, 242, 0.5)";
        case "3":
            return "rgba(209, 23, 29, 0.5)";
    }
}

function switchBorderColor(status) {
    switch(status) {
        case "0":
            return "rgba(209, 205, 23, 0.8)";
        case "1":
            return "rgba(52, 235, 168, 0.8)";
        case "2":
            return "rgba(10, 110, 242, 0.8)";
        case "3":
            return "rgba(209, 23, 29, 0.8)";
    }
}

function switchColor(status) {
    switch(status) {
        case "0":
            return "rgba(237, 186, 0, 1)";
        case "1":
            return "rgba(6, 150, 57, 1)";
        case "2":
            return "rgba(5, 65, 245, 1)";
        case "3":
            return "rgba(209, 23, 29, 1)";
    }
}

const ButtonsContainer = styled.div`
    display: flex;
`;

@connect(state => ({
    routs: _get(state.app, "routs"),
}))
class OrdersPage extends PureComponent {
    state = {
        date: new Date(),
        rout: null,
        orders: [],
        openPopup: false
    };

    columns = [
        {
            name: "number",
            title: "#",
            justifyContent: "center",
            flex: "0 0 30px"
        },
        {
            name: "type_bilet",
            title: "Тип билета",
            justifyContent: "center",
            flex: "0 0 90px"
        },
        {
            name: "fio",
            title: "ФИО",
            justifyContent: "flex-start",
            flex: "1 0 150px"
        },
        {
            name: "phone",
            title: "Телефон",
            justifyContent: "center",
            flex: "0 0 120px"
        },
        {
            name: "data",
            title: "Дата",
            justifyContent: "center",
            flex: "0 0 120px"
        },
        {
            name: "name_marsh",
            title: "Маршрут",
            justifyContent: "center",
            flex: "0 0 200px"
        },
        {
            name: "otkyda",
            title: "Место отправления",
            justifyContent: "flex-start",
            flex: "1 0 140px"
        },
        {
            name: "kyda",
            title: "Место назначения",
            justifyContent: "flex-start",
            flex: "1 0 140px"
        },
        {
            name: "mesto",
            title: "Место",
            justifyContent: "center",
            flex: "0 0 60px"
        },
        {
            name: "voditel",
            title: "Водитель",
            justifyContent: "flex-start",
            flex: "1 0 120px"
        },
        {
            name: "gos_nomer",
            title: "Машина",
            justifyContent: "center",
            flex: "0 0 90px"
        },
        {
            name: "cost",
            title: "Стоимость",
            justifyContent: "center",
            flex: "0 0 100px"
        },
        {
            name: "cost_bron",
            title: "Стоимость брони",
            justifyContent: "center",
            flex: "0 0 100px"
        },
        {
            name: "status",
            title: "Статус",
            justifyContent: "center",
            flex: "1 0 120px"
        },
    ];

    componentDidMount() {
        document.title = "Заказы";
    }

    lookLast = () => {
        API.order.getLastOrders()
            .then(response => {
                const resp = response.data;
                this.setState({orders: resp});
            })
    };

    search = () => {
        const {date, rout} = this.state;
        if (!rout) {
            toast.warn("Выберите маршрут");
            return;
        }
        if (!date) {
            toast.warn("Выберите день");
            return;
        }
        API.order.getAllOrders(date, rout.value)
            .then(response => {
                const resp = response.data;
                this.setState({orders: resp});
            })
    };

    render() {
        let {date, rout, orders, openPopup} = this.state;
        const {routs} = this.props;
        const selectOptions = routs.map(i => {
            return {value:i.id, label: i.name};
        });

        orders = orders.map((item, i) => {
            return {
                ...item,
                status: <Status status={item.status}>{CheckStatus(item.status)}</Status>,
                number: i+1,
                rowClick: () => this.setState({openPopup: item})
            }
        });
        return (
            <ContentWrapper>
                <Header>
                    <Filters>
                        <CustomDatePicker selected={date}
                                          onChange={date => this.setState({date})}
                                          height="40px"
                                          width="140px"
                                          dateFormat="dd.MM.yyyy"/>
                        <ReactSelect value={rout}
                                     height="40px"
                                     width="220px"
                                     margin={"0 0 0 16px"}
                                     placeholder={"Выберите маршрут"}
                                     onChange={value => this.setState({rout: value})}
                                     options={selectOptions}/>
                        <Button title={"Показать"}
                                height="40px"
                                onClick={this.search}
                                margin="0 0 0 16px"/>
                    </Filters>
                    <ButtonsContainer>
                        <Button title={"Новый"}
                                height="40px"
                                margin={"0 8px 0 0"}
                                onClick={() => this.setState({openPopup: "new"})}/>
                        <Button title={"Показать последние"}
                                height="40px"
                                onClick={this.lookLast}/>
                    </ButtonsContainer>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={orders}/>
                </Body>
                {
                    openPopup &&
                    <CreateOrderPopup onClose={() => this.setState({openPopup: false})}
                                      item={openPopup}
                                      onUpdate={this.search}/>
                }
            </ContentWrapper>
        )
    }
}

OrdersPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
};

export default OrdersPage;
