import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import _get from "lodash/get";
import ReactSelect from "components/Elements/ReactSelect";
import Button from "components/Elements/Button";
import {toast} from "react-toastify";
import axios from "axios";
import {apiUrl} from "config/config";
import Table from "components/Elements/Table";
import moment from "moment";
import Edit from "components/Icons/Edit";
import Close from "components/Icons/Close";

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

const ActionContainer = styled.div`
    display: flex;
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
    routs: _get(state.app, "routs"),
}))
class PricesPage extends PureComponent {
    constructor(props) {
        super(props);
        let selectRout;
        if (props.routs){
            if (props.routs.length > 0)
                selectRout = {value:props.routs[0].id, label: props.routs[0].name};
        }
        this.state = {
            rout: selectRout,
            prices: []
        };
        if (selectRout)
            this.load();
    }

    columns = [
        {
            name: "Kyda",
            title: "Откуда",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "Otkyda",
            title: "Куда",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "cost",
            title: "Стоимость",
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

    componentDidMount() {
        document.title = "Прейскурант";
    }

    load = () => {
        const {rout} = this.state;
        if (!rout) {
            toast.warn("Выберите маршрут");
            return;
        }
        axios.get(`${apiUrl}Price.GetPriceForMarsID&id_marsh=${rout.value}`)
            .then(response => {
                const resp = response.data;
                this.setState({prices: resp});
            })
    };

    render() {
        let {rout, prices} = this.state;
        const {routs} = this.props;
        const selectOptions = routs.map(i => {
            return {value:i.id, label: i.name};
        });

        prices = prices.map(i => {
            return {
                ...i,
                actions: <ActionContainer>
                    <IconContainer onClick={() => {}}>
                        <Edit/>
                    </IconContainer>
                    <IconContainer onClick={() => {}}>
                        <Close/>
                    </IconContainer>
                </ActionContainer>
            }
        });

        return (
            <ContentWrapper>
                <Header>
                    <Filters>
                        <ReactSelect value={rout}
                                     height="40px"
                                     width="220px"
                                     margin={"0 0 0 16px"}
                                     placeholder={"Выберите маршрут"}
                                     onChange={value => this.setState({rout: value}, () => this.load())}
                                     options={selectOptions}/>
                    </Filters>
                    <Button title={"Добавить запись"}
                            height="40px"
                            onClick={() => {}}/>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={prices}/>
                </Body>
            </ContentWrapper>
        )
    }
}

PricesPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
};

export default PricesPage;
