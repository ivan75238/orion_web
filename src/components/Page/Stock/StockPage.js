import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import _get from "lodash/get";
import Button from "components/Elements/Button";
import Table from "components/Elements/Table";
import moment from "moment";
import Close from "components/Icons/Close";
import Edit from "components/Icons/Edit";
import {API} from "components/API";
import CreateStockPopup from "./CreateStockPopup";

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
    overflow-x: auto;
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
    user: _get(state.app, "user"),
}))
class StockPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            stock: [],
            openPopupCreate: false
        };
        this.load();
    }

    load = () => {
        API.stock.get()
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
        },
        {
            name: "actions",
            title: "",
            justifyContent: "center",
            flex: "0 0 70px"
        }
    ];

    render() {
        let {stock, openPopupCreate} = this.state;
        const {user} = this.props;

        stock = stock.map(i => {
            return {
                ...i,
                data_nach: moment(i.data_nach, "YYYY-MM-DD").format("DD.MM.YYYY"),
                data_konec: moment(i.data_konec, "YYYY-MM-DD").format("DD.MM.YYYY"),
                actions: <ActionContainer>
                    {
                        user.role === "1" &&
                            <>
                                <IconContainer onClick={() => this.setState({openPopupCreate: i})}>
                                    <Edit/>
                                </IconContainer>
                                <IconContainer onClick={async () => {
                                    await API.stock.del(i.id);
                                    this.load();
                                }}>
                                    <Close/>
                                </IconContainer>
                            </>
                    }
                </ActionContainer>
            }
        });

        return (
            <ContentWrapper>
                <Header>
                    <Filters/>
                    {
                        user.role === "1" &&
                        <Button title={"Создать акцию"}
                                height="40px"
                                onClick={() => this.setState({openPopupCreate: "new"})}/>
                    }
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={stock}/>
                </Body>
                {
                    openPopupCreate &&
                    <CreateStockPopup onClose={() => this.setState({openPopupCreate: false})}
                                        item={openPopupCreate}
                                        onUpdate={this.load}/>
                }
            </ContentWrapper>
        )
    }
}

StockPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
    user: PropTypes.object,
};

export default StockPage;
