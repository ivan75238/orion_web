import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import _get from "lodash/get";
import Button from "components/Elements/Button";
import {toast} from "react-toastify";
import Table from "components/Elements/Table";
import Input from "components/Elements/Input";
import Paginator from "components/Elements/Paginator";
import {API} from "components/API";
import Passcard from "components/Icons/Passcard";
import ClientCardPopup from "./ClientCardPopup";

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
class ClientsPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            clientsData: [],
            clients: [],
            countOnPage: 25,
            currentPage: 1,
            openPopup: false
        };
        this.load();
    }

    load = () => {
        API.client.getAllClient()
            .then(response => {
                const resp = response.data;
                this.setState({clientsData: resp, phone: "", currentPage: 1});
                this.getAll();
            })
    };

    componentDidMount() {
        document.title = "Клиенты";
    }

    columns = [
        {
            name: "fio",
            title: "ФИО",
            justifyContent: "flex-start",
            flex: "1 0 200px"
        },
        {
            name: "phone",
            title: "Телефон",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "count",
            title: "Количество поездок",
            justifyContent: "center",
            flex: "1 0 200px"
        },
        {
            name: "cost",
            title: "Суммарная стоимость",
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

    getAll = () => {
        this.setState({
            clients: this.state.clientsData,
            currentPage: 1
        });
    };

    search = () => {
        const {phone, clientsData} = this.state;
        if (!phone) {
            toast.warn("Для поиска необходимо ввести номер телефона");
            return;
        }
        const clients = clientsData.filter(i => i.phone.indexOf(phone) > -1);
        this.setState({
            clients,
            currentPage: 1
        })
    };

    render() {
        let {phone, clients, currentPage, countOnPage, openPopup} = this.state;

        let clientsForRender = clients.slice((currentPage-1)*countOnPage, currentPage*countOnPage);
        clientsForRender = clientsForRender.map(i => {
            return {
                ...i,
                actions: <ActionContainer>
                    <IconContainer onClick={() => this.setState({openPopup: i})}>
                        <Passcard/>
                    </IconContainer>
                </ActionContainer>
            }
        });
        return (
            <ContentWrapper>
                <Header>
                    <Filters>
                        <Input width="100%"
                               value={phone}
                               onChange={val => this.setState({phone: val})}
                               title="Телефон"
                               height="40px"
                               padding="8px 0"/>
                        <Button title={"Поиск"}
                                height="40px"
                                onClick={this.search}
                                margin="0 0 0 16px"/>
                    </Filters>
                    <Button title={"Показать всех"}
                            height="40px"
                            onClick={this.getAll}/>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={clientsForRender}/>
                </Body>
                <Paginator countOnPage={countOnPage}
                           countItems={clients.length}
                           currentPage={currentPage}
                           onChangeCurrentPage={i => this.setState({currentPage: i})}/>
                {
                    openPopup &&
                    <ClientCardPopup onClose={() => this.setState({openPopup: false})}
                                   item={openPopup}
                                   onUpdate={this.load}/>
                }
            </ContentWrapper>
        )
    }
}

ClientsPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
};

export default ClientsPage;
