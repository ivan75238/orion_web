import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import _get from "lodash/get";
import Button from "components/Elements/Button";
import {toast} from "react-toastify";
import axios from "axios";
import {apiUrl} from "config/config";
import Table from "components/Elements/Table";
import Input from "components/Elements/Input";
import Paginator from "components/Elements/Paginator";
import moment from "moment";

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
    max-height: calc(100vh - 182px);
`;

@connect(state => ({
    routs: _get(state.app, "routs"),
}))
class StockPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            stock: []
        };
        this.load();
    }

    load = () => {
        axios.get(`${apiUrl}Action.Get`)
            .then(response => {
                const resp = response.data;
                this.setState({stock: resp});
            })
    };

    componentDidMount() {
        document.title = "Акции";
    }

    columns = [
        {
            name: "name",
            title: "Название",
            justifyContent: "flex-start",
            flex: "1 0 200px"
        },
        {
            name: "data_nach",
            title: "Начало акции",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "data_konec",
            title: "Конец акции",
            justifyContent: "center",
            flex: "1 0 200px"
        },
        {
            name: "cost",
            title: "Стоимость",
            justifyContent: "center",
            flex: "1 0 200px"
        }
    ];

    render() {
        let {stock} = this.state;

        stock = stock.map(i => {
            return {
                ...i,
                data_nach: moment(i.data_nach, "YYYY-MM-DD").format("DD.MM.YYYY"),
                data_konec: moment(i.data_konec, "YYYY-MM-DD").format("DD.MM.YYYY")
            }
        });

        return (
            <ContentWrapper>
                <Header>
                    <Filters/>
                    <Button title={"Создать акцию"}
                            height="40px"
                            onClick={() => {}}/>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={stock}/>
                </Body>
            </ContentWrapper>
        )
    }
}

StockPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
};

export default StockPage;
