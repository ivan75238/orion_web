import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import {connect} from "react-redux";
import _get from "lodash/get";
import {API} from "components/API";
import Table from "components/Elements/Table";
import {CheckStatus} from "components/functions";
import styled from "styled-components";

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

const Body = styled.div`
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 238px);
    overflow-x: auto;
    position: relative;
`;

@connect(state => ({
    user: _get(state.app, "user"),
}))
class ClientHistoryPopup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        };
    }

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
            name: "status",
            title: "Статус",
            justifyContent: "center",
            flex: "1 0 120px"
        },
    ];

    componentDidMount() {
        this.load();
    }

    load = () => {
        API.order.getClientHistory(this.props.item.id)
            .then(response => {
                this.setState({orders: response.data});
            });
    };

    render() {
        const {onClose} = this.props;
        let {orders} = this.state;

        orders = orders.map((item, i) => {
            return {
                ...item,
                status: <Status status={item.status}>{CheckStatus(item.status)}</Status>,
                number: i+1
            }
        });

        return (
            <Popup onClose={onClose}
                   title={"История поездок"}
                   width={"1000px"}
                   buttons={null}>
                <Body>
                    <Table columns={this.columns}
                           items={orders}/>
                </Body>
            </Popup>
        )
    }
}

ClientHistoryPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default ClientHistoryPopup;
